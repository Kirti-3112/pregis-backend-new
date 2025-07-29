const { Types } = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { UserMachineShift } = require('../models');
const {
  calculateTotalHours,
  computeIntermediateShiftBoundaries,
  computeIntermediateShiftActivityData,
  clockOutPreviousShift,
  groupByClockInDate,
  computeShiftDurations,
  convertMillisecondsToHHMMSS,
} = require('../utils/common');
const { updateUserById, getUserById } = require('./user.service');

const { ObjectId } = Types;

const findUserShiftForToday = async (userId) => {
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);

  const userShift = await UserMachineShift.findOne({
    userId,
    clockIn: { $gte: startOfDay, $lt: endOfDay },
  });

  return userShift;
};

const fetchUserWishList = async (userId) => {
  const user = await getUserById(userId);

  if (!user.machineWishList) return;

  const { machineGroup, machineId } = user.machineWishList;
  return { machineGroup, machineId };
};

const createUserMachineShift = async (req) => {
  const { body } = req;
  // add the machine details to user wish list
  if (body.addMachineToWishlist) {
    await updateUserById(body.userId, {
      machineWishList: {
        machineGroup: body.machineGroup,
        machineId: body.machineId,
      },
      userId: body.userId,
    });
  } else {
    const userCurrentWishList = await fetchUserWishList(body.userId);
    if (
      userCurrentWishList &&
      body.machineGroup === userCurrentWishList.machineGroup &&
      body.machineId === userCurrentWishList.machineId
    ) {
      await updateUserById(body.userId, {
        machineWishList: {
          machineGroup: '',
          machineId: '',
        },
        userId: body.userId,
      });
    }
  }

  const userMachineShiftData = await findUserShiftForToday(body.userId);

  if (userMachineShiftData) {
    return userMachineShiftData;
  }

  delete body.addMachineToWishlist;

  const userMachineShiftToCreate = {
    ...body,
    clockIn: new Date(),
  };
  return UserMachineShift.create(userMachineShiftToCreate);
};

const updateUserMachineShift = async (userId) => {
  const userMachineShiftData = await findUserShiftForToday(userId);

  if (!userMachineShiftData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  const currentDate = new Date();
  const currentClockIn = userMachineShiftData.clockIn;
  const totalHoursWorked = calculateTotalHours(currentClockIn, currentDate);

  const updatedUserMachineShiftData = {
    clockOut: currentDate,
    totalHoursWorked,
  };

  Object.assign(userMachineShiftData, updatedUserMachineShiftData);

  await userMachineShiftData.save();
  return userMachineShiftData;
};

const addMachineToWishList = async (req) => {
  const { body } = req;
  // add the machine details to user wish list
  if (body.addMachineToWishlist) {
    await updateUserById(body.userId, {
      machineWishList: {
        machineGroup: body.machineGroup,
        machineId: body.machineId,
      },
      userId: body.userId,
    });
  } else {
    const userCurrentWishList = await fetchUserWishList(body.userId);
    if (
      userCurrentWishList &&
      body.machineGroup === userCurrentWishList.machineGroup &&
      body.machineId === userCurrentWishList.machineId
    ) {
      await updateUserById(body.userId, {
        machineWishList: {
          machineGroup: '',
          machineId: '',
        },
        userId: body.userId,
      });
    }
  }
};

const startShift = async (req) => {
  const { userId, currentMachineGroupId, clockIn, machineId } = req.body;

  const [
    userMachineShiftData,
    unClockedOutUserShiftData,
    clockInDateUserShiftData,
  ] = await Promise.all([
    UserMachineShift.findOne({ userId }),
    UserMachineShift.findOne({
      userId,
      shiftActivity: { $elemMatch: { clockOut: { $exists: false } } },
    }),
    UserMachineShift.findOne({
      userId,
      shiftActivity: {
        $elemMatch: {
          clockIn: {
            $gte: new Date(clockIn).setUTCHours(0, 0, 0, 0),
            $lt: new Date(clockIn).setUTCHours(23, 59, 59, 999),
          },
        },
      },
    }),
  ]);

  if (!userMachineShiftData) {
    return UserMachineShift.create({
      userId,
      currentMachineGroupId,
      shiftActivity: [
        {
          machineGroup: currentMachineGroupId,
          clockIn: new Date(clockIn),
          machineId,
        },
      ],
    });
  }
  if (!clockInDateUserShiftData) {
    // data not exists for incoming clockIn date
    if (!unClockedOutUserShiftData) {
      return UserMachineShift.create({
        userId,
        currentMachineGroupId,
        shiftActivity: [
          {
            machineGroup: currentMachineGroupId,
            clockIn: new Date(clockIn),
            machineId,
          },
        ],
      });
    }
    if (!unClockedOutUserShiftData.currentMachineGroupId) {
      // unexpected error because if clockOut is undefined, then currentMachineGroupId is not null
      throw new Error(`Unexpected Error`);
    }
    if (
      unClockedOutUserShiftData.currentMachineGroupId === currentMachineGroupId
    ) {
      // Forbidden to update same machineGroup for same userId
      throw new Error(
        `Forbidden: Shift Activity ongoing for userId: ${userId} with machineGroupId: ${currentMachineGroupId}`
      );
    }

    const lastClockIn = unClockedOutUserShiftData.shiftActivity.find(
      (activity) => !activity.clockOut
    ).clockIn;
    if (lastClockIn > new Date(clockIn)) {
      throw new Error(
        `Forbidden: Shift Activity ongoing for userId: ${userId} with clockIn: ${lastClockIn}`
      );
    }
    if (lastClockIn.getUTCDate() === new Date(clockIn).getUTCDate()) {
      const intermediateShiftBoundaries = computeIntermediateShiftBoundaries(
        lastClockIn.toUTCString(),
        clockIn
      );
      if (intermediateShiftBoundaries.length > 0) {
        clockOutPreviousShift(
          unClockedOutUserShiftData,
          intermediateShiftBoundaries[0]
        );

        intermediateShiftBoundaries.push(clockIn);
        const intermediateShiftActivityData =
          computeIntermediateShiftActivityData(
            intermediateShiftBoundaries,
            unClockedOutUserShiftData.currentMachineGroupId
          );

        intermediateShiftActivityData.forEach((shiftActivityObject) => {
          unClockedOutUserShiftData.shiftActivity.push(shiftActivityObject);
        });
      } else {
        clockOutPreviousShift(unClockedOutUserShiftData, clockIn);
      }
      unClockedOutUserShiftData.shiftActivity.push({
        machineGroup: currentMachineGroupId,
        clockIn: new Date(clockIn),
      });
      const updatedUserShiftData = {
        currentMachineGroupId,
      };
      Object.assign(unClockedOutUserShiftData, updatedUserShiftData);
      return unClockedOutUserShiftData.save(); //eslint-disable-line
    }
    if (lastClockIn.getUTCDate() < new Date(clockIn).getUTCDate()) {
      const intermediateShiftBoundaries = computeIntermediateShiftBoundaries(
        lastClockIn.toUTCString(),
        clockIn
      );

      clockOutPreviousShift(
        unClockedOutUserShiftData,
        intermediateShiftBoundaries[0]
      );

      intermediateShiftBoundaries.push(clockIn);

      const intermediateShiftActivityData =
        computeIntermediateShiftActivityData(
          intermediateShiftBoundaries,
          unClockedOutUserShiftData.currentMachineGroupId
        );
      const groupedIntermediateShiftActivityData = groupByClockInDate(
        intermediateShiftActivityData
      );
      const lastClockInDateString = lastClockIn.toISOString().split('T')[0];

      let dataToBeUpdated = [];
      const newShiftActivityToBeInserted = [];
      Object.keys(groupedIntermediateShiftActivityData).forEach(
        (dateString) => {
          const currShiftActivityArr =
            groupedIntermediateShiftActivityData[dateString];
          if (dateString === lastClockInDateString) {
            dataToBeUpdated = [...dataToBeUpdated, ...currShiftActivityArr];
          } else {
            const newShiftActivity = {
              userId,
              currentMachineGroupId: null,
              shiftActivity: [...currShiftActivityArr],
            };
            newShiftActivityToBeInserted.push(newShiftActivity);
          }
        }
      );

      if (dataToBeUpdated.length > 0) {
        // update unclocked data
        await UserMachineShift.updateOne(
          {
            _id: unClockedOutUserShiftData._id,
          },
          {
            $push: { shiftActivity: { $each: dataToBeUpdated } },
          }
        );
      }

      let updatedCurrentMachineGroupId = {
        currentMachineGroupId: null,
      };
      Object.assign(unClockedOutUserShiftData, updatedCurrentMachineGroupId);
      unClockedOutUserShiftData.save();

      let insertManyOperationResult;
      if (newShiftActivityToBeInserted.length > 0) {
        // insertMany
        insertManyOperationResult = await UserMachineShift.insertMany(
          newShiftActivityToBeInserted
        );
        const lastDocInserted =
          insertManyOperationResult[insertManyOperationResult.length - 1];
        lastDocInserted.shiftActivity.push({
          machineGroup: currentMachineGroupId,
          clockIn: new Date(clockIn),
        });
        updatedCurrentMachineGroupId = {
          currentMachineGroupId,
        };
        Object.assign(lastDocInserted, updatedCurrentMachineGroupId);
        return lastDocInserted.save();
      }
    }
  }
  if (clockInDateUserShiftData) {
    // data exists for incoming clockIn date
    if (!clockInDateUserShiftData.currentMachineGroupId) {
      clockInDateUserShiftData.shiftActivity.push({
        machineGroup: currentMachineGroupId,
        clockIn: new Date(clockIn),
        machineId,
      });
      const updatedCurrentMachineGroupId = {
        currentMachineGroupId,
      };
      Object.assign(clockInDateUserShiftData, updatedCurrentMachineGroupId);
      return clockInDateUserShiftData.save();
    }
    if (
      clockInDateUserShiftData.currentMachineGroupId === currentMachineGroupId
    ) {
      throw new Error(
        `Forbidden: Shift Activity ongoing for userId: ${userId} with machineGroupId: ${currentMachineGroupId}`
      );
    }
    const lastClockIn = clockInDateUserShiftData.shiftActivity.find(
      (activity) => !activity.clockOut
    ).clockIn;
    const intermediateShiftBoundaries = computeIntermediateShiftBoundaries(
      lastClockIn.toUTCString(),
      clockIn
    );
    if (intermediateShiftBoundaries.length > 0) {
      clockOutPreviousShift(
        clockInDateUserShiftData,
        intermediateShiftBoundaries[0]
      );

      intermediateShiftBoundaries.push(clockIn);
      const intermediateShiftActivityData =
        computeIntermediateShiftActivityData(
          intermediateShiftBoundaries,
          clockInDateUserShiftData.currentMachineGroupId
        );

      intermediateShiftActivityData.forEach((shiftActivityObject) => {
        clockInDateUserShiftData.shiftActivity.push(shiftActivityObject);
      });
    } else {
      clockOutPreviousShift(clockInDateUserShiftData, clockIn);
    }
    clockInDateUserShiftData.shiftActivity.push({
      machineGroup: currentMachineGroupId,
      clockIn: new Date(clockIn),
    });
    const updatedUserShiftData = {
      currentMachineGroupId,
    };
    Object.assign(clockInDateUserShiftData, updatedUserShiftData);
    return clockInDateUserShiftData.save();
  }
};

const endShift = async (req) => {
  const { userId, clockOut } = req.body;
  const userShiftData = await UserMachineShift.findOne({
    userId,
    shiftActivity: { $elemMatch: { clockOut: { $exists: false } } },
  });

  if (!userShiftData) {
    throw new Error(`UserId: ${userId} has already clocked out`);
  } else {
    const lastClockIn = userShiftData.shiftActivity.find(
      (activity) => !activity.clockOut
    ).clockIn;

    const intermediateShiftBoundaries = computeIntermediateShiftBoundaries(
      lastClockIn.toUTCString(),
      clockOut
    );
    if (intermediateShiftBoundaries.length > 0) {
      clockOutPreviousShift(userShiftData, intermediateShiftBoundaries[0]);

      intermediateShiftBoundaries.push(clockOut);
      const intermediateShiftActivityData =
        computeIntermediateShiftActivityData(
          intermediateShiftBoundaries,
          userShiftData.currentMachineGroupId
        );

      intermediateShiftActivityData.forEach((shiftActivityObject) => {
        userShiftData.shiftActivity.push(shiftActivityObject);
      });
      clockOutPreviousShift(userShiftData, clockOut);
    } else {
      clockOutPreviousShift(userShiftData, clockOut);
    }

    const updatedUserShiftData = {
      currentMachineGroupId: null,
    };

    Object.assign(userShiftData, updatedUserShiftData);
    return userShiftData.save();
  }
};

const getShifts = async (req) => {
  const options = req.body;
  const { page, limit } = options.pagination;
  const { filters, userId } = options;
  let filterToApply = {};
  if (filters) {
    filterToApply = filters;
  }
  // user timezone offset
  let timeZoneOffset = 'UTC';
  let pipelineDateFormat = '%m/%d/%Y';
  const user = await getUserById(userId);
  const { preferences } = user;
  if (preferences) {
    const { dateAndTime } = preferences;
    const { timeZone, dateFormat } = dateAndTime;
    const timeZoneRegex = /([+-]?)(\d{2}):?(\d{2})/;
    const match = timeZone.match(timeZoneRegex);
    timeZoneOffset = match ? match[0] : 'UTC';
    pipelineDateFormat = dateFormat
      ? dateFormat.replace(/MM/, '%m').replace(/DD/, '%d').replace(/YYYY/, '%Y')
      : '%m/%d/%Y';
  }

  const pipeline = [
    {
      $match: {
        ...filterToApply,
      },
    },
    {
      $unwind: {
        path: '$shiftActivity',
      },
    },
    {
      $addFields: {
        userIdObjectId: { $toObjectId: '$userId' },
        'shiftActivity.machineGroupObjectId': {
          $toObjectId: '$shiftActivity.machineGroup',
        },
      },
    },
    {
      $lookup: {
        from: 'configMachineGroup',
        localField: 'shiftActivity.machineGroupObjectId',
        foreignField: '_id',
        as: 'shiftActivity.machineGroupDetails',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userIdObjectId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $addFields: {
        'shiftActivity.machineGroupDetails': {
          $arrayElemAt: ['$shiftActivity.machineGroupDetails', 0],
        },
        user: {
          $arrayElemAt: ['$user', 0],
        },
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'user.roles',
        foreignField: '_id',
        as: 'user.roles',
      },
    },
    {
      $addFields: {
        'user.roles': {
          $arrayElemAt: ['$user.roles', 0],
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        user: {
          $first: {
            _id: '$user._id',
            email: '$user.email',
            displayName: '$user.displayName',
            roles: {
              _id: '$user.roles._id',
              roleName: '$user.roles.roleName',
              isActive: '$user.roles.isActive',
            },
            isEmailVerified: '$user.isEmailVerified',
            isActive: '$user.isActive',
            isDeleted: '$user.isDeleted',
            machineWishList: '$user.machineWishList',
          },
        },
        date: {
          $min: '$shiftActivity.clockIn',
        },
        firstClockIn: {
          $min: '$shiftActivity.clockIn',
        },
        lastClockOut: {
          $max: '$shiftActivity.clockOut',
        },
        workDuration: {
          $sum: {
            $subtract: ['$shiftActivity.clockOut', '$shiftActivity.clockIn'],
          },
        },
        machineGroups: { $addToSet: '$shiftActivity.machineGroupDetails.name' },
      },
    },
    { $sort: { date: -1 } },
    {
      $project: {
        _id: 1,
        user: 1,
        date: {
          $dateToString: {
            format: pipelineDateFormat,
            date: '$firstClockIn',
            timezone: timeZoneOffset,
          },
        },
        firstClockIn: {
          $dateToString: {
            format: '%H:%M:%S',
            date: '$firstClockIn',
            timezone: timeZoneOffset,
          },
        },
        lastClockOut: {
          $dateToString: {
            format: '%H:%M:%S',
            date: '$lastClockOut',
            timezone: timeZoneOffset,
          },
        },
        workDuration: {
          $cond: {
            if: { $ne: ['$lastClockOut', null] },
            then: convertMillisecondsToHHMMSS('$workDuration'),
            else: '00:00:00',
          },
        },
        machineGroups: 1,
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const result = await UserMachineShift.aggregate(pipeline).exec();
  const count = await UserMachineShift.countDocuments(filterToApply);

  return {
    shiftsData: result,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const getShiftById = async (req) => {
  const { params, body } = req;
  const { id } = params;
  const { userId } = body;

  // user timezone offset
  let timeZoneOffsetInMinutes = 0;
  let pipelineDateFormat = '%m/%d/%Y';
  const user = await getUserById(userId);
  const { preferences } = user;
  if (preferences) {
    const { dateAndTime } = preferences;
    const { timeZone, dateFormat } = dateAndTime;
    const timeZoneRegex = /([+-]?)(\d{2}):?(\d{2})/;
    const match = timeZone.match(timeZoneRegex);
    if (match) {
      const sign = match[1] === '-' ? -1 : 1;
      const hours = parseInt(match[2], 10);
      const minutes = parseInt(match[3], 10);
      timeZoneOffsetInMinutes = sign * (hours * 60 + minutes);
    }
    pipelineDateFormat = dateFormat
      ? dateFormat.replace(/MM/, '%m').replace(/DD/, '%d').replace(/YYYY/, '%Y')
      : '%m/%d/%Y';
  }

  const mainDetailsPipeline = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $unwind: {
        path: '$shiftActivity',
      },
    },
    {
      $addFields: {
        userIdObjectId: { $toObjectId: '$userId' },
        'shiftActivity.machineGroupObjectId': {
          $toObjectId: '$shiftActivity.machineGroup',
        },
      },
    },
    {
      $lookup: {
        from: 'configMachineGroup',
        localField: 'shiftActivity.machineGroupObjectId',
        foreignField: '_id',
        as: 'shiftActivity.machineGroupDetails',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userIdObjectId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $addFields: {
        'shiftActivity.machineGroupDetails': {
          $arrayElemAt: ['$shiftActivity.machineGroupDetails', 0],
        },
        user: {
          $arrayElemAt: ['$user', 0],
        },
      },
    },
    {
      $addFields: {
        'shiftActivity.machineGroupName':
          '$shiftActivity.machineGroupDetails.name',
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'user.roles',
        foreignField: '_id',
        as: 'user.roles',
      },
    },
    {
      $addFields: {
        'user.roles': {
          $arrayElemAt: ['$user.roles', 0],
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        user: {
          $first: {
            _id: '$user._id',
            email: '$user.email',
            displayName: '$user.displayName',
            roles: {
              _id: '$user.roles._id',
              roleName: '$user.roles.roleName',
              isActive: '$user.roles.isActive',
            },
            isEmailVerified: '$user.isEmailVerified',
            isActive: '$user.isActive',
            isDeleted: '$user.isDeleted',
            machineWishList: '$user.machineWishList',
          },
        },
        shiftActivity: { $push: '$shiftActivity' },
        machineGroups: { $addToSet: '$shiftActivity.machineGroupDetails.name' },
      },
    },
    {
      $addFields: {
        date: {
          $add: [
            { $min: '$shiftActivity.clockIn' },
            { $multiply: [timeZoneOffsetInMinutes, 60000] },
          ],
        },
        firstClockIn: {
          $add: [
            { $min: '$shiftActivity.clockIn' },
            { $multiply: [timeZoneOffsetInMinutes, 60000] },
          ],
        },
        lastClockOut: {
          $add: [
            { $min: '$shiftActivity.clockOut' },
            { $multiply: [timeZoneOffsetInMinutes, 60000] },
          ],
        },
      },
    },
  ];

  const mainDetailsProjectStage = [
    {
      $project: {
        _id: 1,
        user: 1,
        date: { $dateToString: { format: pipelineDateFormat, date: '$date' } },
        firstClockIn: {
          $dateToString: { format: '%H:%M:%S', date: '$firstClockIn' },
        },
        lastClockOut: {
          $dateToString: { format: '%H:%M:%S', date: '$lastClockOut' },
        },
        machineGroups: 1,
      },
    },
  ];

  const shiftActivityByMachineGroupNamePipeline = [
    ...mainDetailsPipeline,
    {
      $unwind: '$shiftActivity',
    },
    {
      $addFields: {
        'shiftActivity.adjustedClockIn': {
          $add: [
            { $min: '$shiftActivity.clockIn' },
            { $multiply: [timeZoneOffsetInMinutes, 60000] },
          ],
        },
        'shiftActivity.adjustedClockOut': {
          $add: [
            { $min: '$shiftActivity.clockOut' },
            { $multiply: [timeZoneOffsetInMinutes, 60000] },
          ],
        },
      },
    },
    {
      $addFields: {
        'shiftActivity.shiftDurations': computeShiftDurations(
          '$shiftActivity.adjustedClockIn',
          '$shiftActivity.adjustedClockOut',
          timeZoneOffsetInMinutes
        ),
      },
    },
    {
      $group: {
        _id: {
          id: '$_id',
          machineGroupName: '$shiftActivity.machineGroupName',
        },
        night: {
          $sum: '$shiftActivity.shiftDurations.night',
        },
        morning: {
          $sum: '$shiftActivity.shiftDurations.morning',
        },
        evening: {
          $sum: '$shiftActivity.shiftDurations.evening',
        },
        workDuration: {
          $sum: {
            $add: [
              { $sum: '$shiftActivity.shiftDurations.morning' },
              { $sum: '$shiftActivity.shiftDurations.night' },
              { $sum: '$shiftActivity.shiftDurations.evening' },
            ],
          },
        },
        shiftActivities: {
          $push: {
            _id: '$shiftActivity._id',
            clockIn: '$shiftActivity.adjustedClockIn',
            clockOut: '$shiftActivity.adjustedClockOut',
            night: '$shiftActivity.shiftDurations.night',
            morning: '$shiftActivity.shiftDurations.morning',
            evening: '$shiftActivity.shiftDurations.evening',
            workDuration: {
              $sum: [
                '$shiftActivity.shiftDurations.morning',
                '$shiftActivity.shiftDurations.evening',
                '$shiftActivity.shiftDurations.night',
              ],
            },
            machineGroupName: '$shiftActivity.machineGroupName',
            machineGroup: '$shiftActivity.machineGroup',
          },
        },
      },
    },
    {
      $group: {
        _id: '$_id.id',
        shiftActivityGrouped: {
          $push: {
            k: '$_id.machineGroupName',
            v: {
              evening: '$evening',
              morning: '$morning',
              night: '$night',
              workDuration: { $sum: ['$evening', '$morning', '$night'] },
              shiftActivities: '$shiftActivities',
            },
          },
        },
      },
    },
    {
      $addFields: {
        night: convertMillisecondsToHHMMSS({
          $sum: '$shiftActivityGrouped.v.night',
        }),
        morning: convertMillisecondsToHHMMSS({
          $sum: '$shiftActivityGrouped.v.morning',
        }),
        evening: convertMillisecondsToHHMMSS({
          $sum: '$shiftActivityGrouped.v.evening',
        }),
        workDuration: convertMillisecondsToHHMMSS({
          $add: [
            { $sum: '$shiftActivityGrouped.v.night' },
            { $sum: '$shiftActivityGrouped.v.morning' },
            { $sum: '$shiftActivityGrouped.v.evening' },
          ],
        }),
      },
    },
    {
      $addFields: {
        shiftActivityGrouped: {
          $arrayToObject: '$shiftActivityGrouped',
        },
      },
    },
  ];

  const shiftActivityByMachineGroupNameProjectStage = [
    {
      $project: {
        night: 1,
        morning: 1,
        evening: 1,
        workDuration: 1,
        shiftActivityGrouped: {
          $map: {
            input: { $objectToArray: '$shiftActivityGrouped' },
            as: 'group',
            in: {
              k: '$$group.k',
              v: {
                night: convertMillisecondsToHHMMSS('$$group.v.night'),
                morning: convertMillisecondsToHHMMSS('$$group.v.morning'),
                evening: convertMillisecondsToHHMMSS('$$group.v.evening'),
                workDuration: convertMillisecondsToHHMMSS(
                  '$$group.v.workDuration'
                ),
                shiftActivities: {
                  $map: {
                    input: '$$group.v.shiftActivities',
                    as: 'activity',
                    in: {
                      _id: '$$activity._id',
                      clockIn: {
                        $dateToString: {
                          format: '%H:%M:%S',
                          date: '$$activity.clockIn',
                        },
                      },
                      clockOut: {
                        $dateToString: {
                          format: '%H:%M:%S',
                          date: '$$activity.clockOut',
                        },
                      },
                      night: convertMillisecondsToHHMMSS('$$activity.night'),
                      morning:
                        convertMillisecondsToHHMMSS('$$activity.morning'),
                      evening:
                        convertMillisecondsToHHMMSS('$$activity.evening'),
                      workDuration: convertMillisecondsToHHMMSS(
                        '$$activity.workDuration'
                      ),
                      machineGroupName: '$$activity.machineGroupName',
                      machineGroup: '$$activity.machineGroup',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        shiftActivityGrouped: {
          $arrayToObject: '$shiftActivityGrouped',
        },
      },
    },
  ];

  const mainDetailsResult = await UserMachineShift.aggregate([
    ...mainDetailsPipeline,
    ...mainDetailsProjectStage,
  ]).exec();

  const shiftActivityByMachineGroupNameResult =
    await UserMachineShift.aggregate([
      ...shiftActivityByMachineGroupNamePipeline,
      ...shiftActivityByMachineGroupNameProjectStage,
    ]).exec();

  return {
    ...mainDetailsResult[0],
    ...shiftActivityByMachineGroupNameResult[0],
  };
};

const getUserMachineGroupCurrentDayShift = async (filterOptions) => {
  // also check for role
  const userShift = await UserMachineShift.findOne(filterOptions);

  return userShift;
};

const findAndUserCurrentUserSession = async () => {
  const userShift = await UserMachineShift.findAndUserCurrentUserSession();
  return userShift;
};

module.exports = {
  createUserMachineShift,
  updateUserMachineShift,
  startShift,
  endShift,
  getShifts,
  getShiftById,
  getUserMachineGroupCurrentDayShift,
  findAndUserCurrentUserSession,
  addMachineToWishList,
};
