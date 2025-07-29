const httpStatus = require('http-status');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { Jobs, MachineLookup, MachineEvent } = require('../models');
const { commonPipelineStages } = require('../utils/common_utils');
const config = require('../config/config');

const { NOT_HANDLED, COMPLETED } = config.jobsProductionStatus;
/* eslint-disable */

const getLoggedEvents = async (options) => {
  try {
    const { pageLimit, page } = options.pagination;
    const { filters } = options;

    const modifiedFilters = {};

    const filterKeyMap = {
      'Event Area': 'area',
      'Event Count': 'eventCount',
      machineId: 'machineId',
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (filterKeyMap[key]) {
        modifiedFilters[filterKeyMap[key]] = {
          $regex: value,
          $options: 'i',
        };
      }
    });

    const count = await MachineEvent.countDocuments(modifiedFilters);

    // Determine skip value based on count and filters
    let skip = 0;
    if (count > pageLimit || !filters) {
      skip = (page - 1) * pageLimit;
    }

    // Fetch logged events
    const loggedEvents = await MachineEvent.find(modifiedFilters)
      .select({
        eventCount: 1,
        area: 1,
        status: 1,
        eventTime: 1,
        errorCode: 1,
      })
      .sort({ eventTime: -1 })
      .limit(pageLimit * 1)
      .skip(skip)
      .exec();

    // Extract unique areas and error codes from logged events
    const areaAndErrorCodeGroup = loggedEvents.reduce(
      (areaAndErrorCodes, loggedEvent) => {
        if (loggedEvent.area) {
          areaAndErrorCodes.area.push(loggedEvent.area);
        }
        if (loggedEvent.errorCode) {
          areaAndErrorCodes.errorCode.push(loggedEvent.errorCode);
        }
        return areaAndErrorCodes;
      },
      { area: [], errorCode: [] }
    );

    // Fetch machine lookup data based on unique areas and error codes
    const machineLookupsData = await MachineLookup.find({
      Area: { $in: areaAndErrorCodeGroup.area },
      MessageBitString: { $in: areaAndErrorCodeGroup.errorCode },
    })
      .select({
        Message: 1,
        Area: 1,
        MessageBitString: 1,
      })
      .exec();

    // Map logged events with corresponding machine lookup messages
    const loggedEventsWithMessage = loggedEvents.map((loggedEvent) => {
      const lookupMessage = machineLookupsData.find(
        (machinelookup) =>
          loggedEvent.area === machinelookup.Area &&
          loggedEvent.errorCode === machinelookup.MessageBitString
      );

      loggedEvent.message = lookupMessage
        ? lookupMessage.Message
        : 'No alarm !';
      return loggedEvent;
    });

    // Construct the result object
    const EventData = {
      loggedEvents: loggedEventsWithMessage,
      rowsPerPage: pageLimit,
      totalPages: Math.ceil(count / pageLimit),
      currentPage: page,
    };

    return EventData;
  } catch (error) {
    logger.error(
      `Error while Fetching logged events Details. Error : ${error}`
    );
    throw error;
  }
};

const getReportsVolumeReduction = async (query) => {
  const dateFrom = query.from + 'Z';
  const dateTo = query.to + 'Z';
  const machineId = query.machineId;
  if (!Date.parse(dateFrom) || !Date.parse(dateTo)) {
    return [];
  }

  try {
    const pipeline = [
      ...commonPipelineStages(dateFrom, dateTo, machineId),
      {
        $group: {
          _id: {
            $dateToString: {
              date: '$completedTime',
              format: '%Y-%m-%d',
              timezone: 'UTC',
            },
          },
          totalVolume: {
            $sum: { $toDouble: '$volumeReductionPercent' },
          },
          count: { $sum: 1 },
          averagePercentage: {
            $avg: { $toDouble: '$volumeReductionPercent' },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalVolume: 1,
          count: 1,
          averagePercentage: 1,
        },
      },
    ];

    const result = await Jobs.aggregate(pipeline);
    return result;
  } catch (error) {
    // Handle errors
    console.error(error);
    return [];
  }
};

const getReportsProductionByDay = async (query) => {
  const dateFrom = new Date(query.from);
  const dateTo = new Date(query.to);
  const machineId = query.machineId;

  dateFrom.setUTCHours(0, 0, 0, 0);
  dateTo.setUTCHours(23, 59, 59, 999);

  if (!Date.parse(dateFrom) || !Date.parse(dateTo)) {
    return [];
  }

  try {
    const pipeline = [
      ...commonPipelineStages(dateFrom, dateTo, machineId),
      {
        $group: {
          _id: {
            $dateToString: {
              date: '$completedTime',
              format: '%Y-%m-%d',
              timezone: 'UTC',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ];

    const result = await Jobs.aggregate(pipeline);
    return result;
  } catch (error) {
    // Handle errors
    console.error(error);
    return [];
  }
};

const getReportCountMachineEvent = async (query) => {
  let inputArea = query.area;
  let machineId = query.machineId;
  try {
    const matchCondition = {};
    // Add area condition to match if inputArea is defined
    if (inputArea && inputArea !== 'All') {
      matchCondition.area = inputArea;
    }

    const pipeline = [
      {
        $match: { ...matchCondition, machineId: machineId },
      },
      {
        $group: {
          _id: { errorCode: '$errorCode' },
          eventCount: { $sum: 1 },
          cumulativeArea: { $addToSet: { area: '$area' } },
        },
      },
      {
        $sort: { _id: 1 }, // Sort dates in ascending order
      },
      {
        $project: {
          _id: 0,
          area: { $first: '$cumulativeArea.area' },
          errorCode: '$_id.errorCode',
          eventCount: 1,
        },
      },
    ];

    const result = await MachineEvent.aggregate(pipeline);
    const filteredMachineEvents = result.filter((e) => e.errorCode !== null);
    // Extract error codes from the result
    const errorCodes = filteredMachineEvents
      .map((item) => item.errorCode)
      .filter(Boolean);
    const areas = filteredMachineEvents
      .map((item) => item.area)
      .filter(Boolean);

    // machine event api  - area
    let areaCondtion = [inputArea];
    if (inputArea === 'All') {
      areaCondtion = areas;
    }

    // Fetch data from MachineLookup based on error codes
    const machineLookupsData = await MachineLookup.aggregate([
      {
        $match: {
          MessageBitString: { $in: errorCodes },
          Area: { $in: areaCondtion },
        },
      },
    ]);

    // Create a map for quick access to message based on error code
    const messageMap = new Map();
    machineLookupsData.forEach((item) => {
      messageMap.set(item.MessageBitString, item.Message);
    });
    // Add messages to the result
    filteredMachineEvents.forEach((item) => {
      // Use the message from the map, or set to null if not found
      item.message = messageMap.get(item.errorCode) || 'No Alarm';
    });

    return filteredMachineEvents;
  } catch (error) {
    logger.error(
      `Error while Fetching count machine event Details. Error : ${error}`
    );
    return { error: 'An error occurred while processing the request.' };
  }
};

const getReportsJobCompletedByHour = async (query) => {
  const { timeRange, from, to, machineId } = query;

  const dateFrom = from + 'Z';
  const dateTo = to + 'Z';

  if (!Date.parse(dateFrom) || !Date.parse(dateTo)) {
    return [];
  }

  const intervalStages =
    timeRange === 'hourly'
      ? [
          {
            $group: {
              _id: {
                formattedTime: {
                  $dateToString: {
                    format: '%H:00',
                    date: '$completedTime',
                    timezone: 'UTC',
                  },
                },
              },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id.formattedTime',
              count: 1,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ]
      : [
          {
            $group: {
              _id: {
                $dateToString: { format: '%m/%d/%Y', date: '$completedTime' },
              },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              count: 1,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ];

  try {
    const aggregationPipeline = [
      ...commonPipelineStages(dateFrom, dateTo, machineId),
      ...intervalStages,
    ];
    const result = await Jobs.aggregate(aggregationPipeline);
    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error while Fetching Job Data.'
    );
  }
};

const getDistinctAreas = async () => {
  try {
    const result = await MachineLookup.find().distinct('Area');
    return result;
  } catch (error) {
    logger.error(`Error while Fetching Job Data. Error : ${error}`);
    return { error: 'An error occurred while processing the request.' };
  }
};

// Sense and Dispense Services
const getPaperLengthDispensedByTimerange = async (query) => {
  const { timeRange, from, to, machineId } = query;

  const dateFrom = from + 'Z';
  const dateTo = to + 'Z';

  if (!Date.parse(dateFrom) || !Date.parse(dateTo)) {
    return [];
  }

  const intervalStages =
    timeRange === 'hourly'
      ? [
          {
            $group: {
              _id: {
                formattedTime: {
                  $dateToString: {
                    format: '%H:00',
                    date: '$completedTime',
                    timezone: 'UTC',
                  },
                },
              },
              totalPaperLengthDispensed: {
                $sum: { $toDouble: '$paperLengthDispensed' },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id.formattedTime',
              totalPaperLengthDispensed: 1,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ]
      : [
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$completedTime' },
              },
              totalPaperLengthDispensed: {
                $sum: { $toDouble: '$paperLengthDispensed' },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              totalPaperLengthDispensed: 1,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ];

  try {
    const pipeline = [
      ...commonPipelineStages(dateFrom, dateTo, machineId),
      ...intervalStages,
    ];

    const result = await Jobs.aggregate(pipeline);
    return result;
  } catch (error) {
    // Handle errors
    console.error(error);
    return [];
  }
};

const getAirPillowsDispensedByTimerange = async (query) => {
  const { timeRange, from, to, machineId } = query;

  const dateFrom = from + 'Z';
  const dateTo = to + 'Z';

  if (!Date.parse(dateFrom) || !Date.parse(dateTo)) {
    return [];
  }

  const intervalStages =
    timeRange === 'hourly'
      ? [
          {
            $group: {
              _id: {
                formattedTime: {
                  $dateToString: {
                    format: '%H:00',
                    date: '$completedTime',
                    timezone: 'UTC',
                  },
                },
              },
              totalAirPillowsDispensed: {
                $sum: { $toDouble: '$airPillowsDispensed' },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id.formattedTime',
              totalAirPillowsDispensed: 1,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ]
      : [
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$completedTime' },
              },
              totalAirPillowsDispensed: {
                $sum: { $toDouble: '$airPillowsDispensed' },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              totalAirPillowsDispensed: 1,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ];

  try {
    const pipeline = [
      ...commonPipelineStages(dateFrom, dateTo, machineId),
      ...intervalStages,
    ];

    const result = await Jobs.aggregate(pipeline);
    return result;
  } catch (error) {
    // Handle errors
    console.error(error);
    return [];
  }
};

const getVoidVolumeMinimumByTimerange = async (body) => {
  const { from, to, machineId } = body;

  const dateFrom = new Date(from);
  const dateTo = new Date(to);

  dateFrom.setUTCHours(0, 0, 0, 0);
  dateTo.setUTCHours(23, 59, 59, 999);

  if (!Date.parse(dateFrom) || !Date.parse(dateTo)) {
    return [];
  }

  const pipeline = [
    {
      $match: {
        machineId,
        productionStatus: { $in: [COMPLETED, NOT_HANDLED] },
        updatedAt: {
          $gte: new Date(dateFrom),
          $lte: new Date(dateTo),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%m/%d/%Y', date: '$updatedAt' } },
        notHandledCount: {
          $sum: {
            $cond: {
              if: { $eq: ['$productionStatus', NOT_HANDLED] },
              then: 1,
              else: 0,
            },
          },
        },
        completedCount: {
          $sum: {
            $cond: {
              if: { $eq: ['$productionStatus', COMPLETED] },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        notHandledCount: 1,
        completedCount: 1,
        voidVolumeMinimumPercentage: {
          $round: [
            {
              $multiply: [
                {
                  $divide: [
                    '$notHandledCount',
                    { $add: ['$notHandledCount', '$completedCount'] },
                  ],
                },
                100,
              ],
            },
            1,
          ],
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];

  const result = await Jobs.aggregate(pipeline);
  return result;
};

module.exports = {
  getLoggedEvents,
  getReportsVolumeReduction,
  getReportsProductionByDay,
  getReportCountMachineEvent,
  getReportsJobCompletedByHour,
  getDistinctAreas,
  getPaperLengthDispensedByTimerange,
  getAirPillowsDispensedByTimerange,
  getVoidVolumeMinimumByTimerange,
};
