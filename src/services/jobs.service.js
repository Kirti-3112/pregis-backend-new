/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
const { ObjectId } = require('mongodb'); //eslint-disable-line
const logger = require('../config/logger');
const { Jobs } = require('../models');
const {
  covertStringToDate,
  timeToDecimal,
  convertDateToTimeRange,
  convertMillisecondsToHHMMSS,
  checkFieldCategory,
  convertMeasurementUnit,
  getConversionFactor,
  applyConversion,
} = require('../utils/common');
const config = require('../config/config');
const { getMachineGroupByName } = require('./config_machine_group.service');

const { TODO, COMPLETED } = config.jobsProductionStatus;

/**
 * Query for Get Job Data
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */

const getJob = async (options, selectionFields = '', reqUrl = '') => {
  try {
    const { pageLimit, pageSize } = options.pagination;
    const { filters } = options;

    const modifiedFilters = {};

    const filterKeyMap = {
      Barcode: 'barcode',
      ID: 'jobId',
      productionStatus: 'productionStatus',
      machineId: 'machineId',
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (filterKeyMap[key] && value) {
        modifiedFilters[filterKeyMap[key]] = {
          $regex: value,
          $options: 'i',
        };
      }
    });

    let count = 0;
    let job = [];
    let skip = 0;
    let filterQuery = modifiedFilters;

    // if (filters.productionStatus !== IN_PROGRESS) {
    //   filterQuery = {
    //     $or: [{ machineId: null, productionStatus: TODO }, modifiedFilters],
    //   };
    // }

    const urlIncludesSizeMaster = !reqUrl.includes('sense-and-dispense');
    const urlIncludesSenseAndDispense = reqUrl.includes('sense-and-dispense');

    if (urlIncludesSizeMaster) {
      if (filters.Barcode || filters.ID) {
        const { machineId, ...restFilters } = modifiedFilters;
        filterQuery = {
          $or: [restFilters],
        };
      } else if (filters.productionStatus) {
        if (filters.productionStatus === TODO) {
          filterQuery = {
            $or: [{ machineId: null, productionStatus: TODO }, modifiedFilters],
          };
        } else {
          filterQuery = {
            $or: [modifiedFilters],
          };
        }
      } else {
        filterQuery = {
          $or: [{ machineId: null, productionStatus: TODO }, modifiedFilters],
        };
      }
    } else if (urlIncludesSenseAndDispense) {
      filterQuery = {
        $or: [modifiedFilters],
      };
    } else {
      filterQuery = {
        $or: [{ machineId: null, productionStatus: TODO }, modifiedFilters],
      };
    }

    count = await Jobs.countDocuments(filterQuery);

    if (count > pageLimit || !filters) {
      skip = (pageSize - 1) * pageLimit;
    }

    job = await Jobs.find(filterQuery)
      .select(selectionFields)
      .limit(pageLimit)
      .skip(skip)
      .sort({ updatedAt: -1 })
      .exec();
    const jobData = {
      job,
      rowsPerPage: pageLimit,
      totalPages: Math.ceil(count / pageLimit),
      currentPage: pageSize,
      totalRecords: count,
    };
    return jobData;
  } catch (error) {
    logger.error(
      `Error while Fetching logged events Details. Error : ${error}`
    );
    throw error;
  }
};

const getJobById = async (req, selectionFields = '') => {
  try {
    const { id } = req.params;
    const { filters, conversionFactor } = req.body;

    const modifiedFilters = {};

    const filterKeyMap = {
      Barcode: 'barcode',
      ID: 'jobId',
      productionStatus: 'productionStatus',
      machineId: 'machineId',
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (filterKeyMap[key] && value) {
        modifiedFilters[filterKeyMap[key]] = {
          $regex: value,
          $options: 'i',
        };
      }
    });

    let filterQuery = {};

    if (filters.Barcode || filters.ID) {
      const { machineId, ...restFilters } = modifiedFilters;
      filterQuery = {
        $or: [restFilters],
      };
    } else if (filters.productionStatus) {
      if (filters.productionStatus === TODO) {
        filterQuery = {
          $or: [{ machineId: null, productionStatus: TODO }, modifiedFilters],
        };
      } else {
        filterQuery = {
          $or: [modifiedFilters],
        };
      }
    } else {
      filterQuery = {
        $or: [{ machineId: null, productionStatus: TODO }, modifiedFilters],
      };
    }

    const jobData = await Jobs.findOne({ _id: id, ...filterQuery })
      .select(selectionFields)
      .lean();
    // Measurment Conversion Logic
    if (
      conversionFactor &&
      Object.keys(conversionFactor).length &&
      Object.values(conversionFactor).every(
        (cf) => cf !== null && cf !== undefined && cf !== ''
      )
    ) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in jobData) {
        const conversionType = checkFieldCategory(key);
        if (conversionType) {
          // Need To Modify Map if New Conversion Factor Occurs
          const factor = getConversionFactor(conversionFactor, conversionType);

          jobData[key] = applyConversion(jobData[key], conversionType, factor);
        }

        if (Array.isArray(jobData[key])) {
          // eslint-disable-next-line no-plusplus
          jobData[key] = jobData[key].map((event) => {
            // eslint-disable-next-line guard-for-in
            for (const eventkey in event) {
              const conversionTypes = checkFieldCategory(eventkey);
              if (conversionTypes) {
                const factor = getConversionFactor(
                  conversionFactor,
                  conversionTypes
                );
                // eslint-disable-next-line no-param-reassign
                event[eventkey] = applyConversion(
                  event[eventkey],
                  conversionTypes,
                  factor
                );
              }
            }
            return event;
          });
        }
      }
    }
    return jobData;
  } catch (error) {
    logger.error(
      `Error while Fetching logged events Details. Error : ${error}`
    );
    throw error;
  }
};

const getPercentageVolume = async (data) => {
  const { machineId } = data;

  const currentDate = new Date();
  const { startTime, endTime } = convertDateToTimeRange(currentDate);
  const percentVolumeData = await Jobs.aggregate([
    {
      $match: {
        completedTime: {
          $gte: new Date(startTime),
          $lte: new Date(endTime),
        },
        productionStatus: COMPLETED,
        machineId,
      },
    },
    {
      $addFields: {
        parsedVolumeReductionPercent: { $toDouble: '$volumeReductionPercent' },
      },
    },
    {
      $group: {
        _id: '$productionStatus',
        totalVolume: { $sum: '$parsedVolumeReductionPercent' },
        count: { $sum: 1 },
      },
    },
  ]);
  if (percentVolumeData.length === 0) {
    return 0;
  }
  const calculatedPercentage =
    percentVolumeData[0].totalVolume / percentVolumeData[0].count;
  return calculatedPercentage;
};

const getThroughput = async (data) => {
  const { machineId } = data;

  const currentDate = new Date();
  const { startTime, endTime } = convertDateToTimeRange(currentDate);

  const jobResult = Jobs.find({
    completedTime: {
      $gte: new Date(startTime),
      $lte: new Date(endTime),
    },
    machineId,
    productionStatus: COMPLETED,
  })
    .select('duration')
    .then((result) => {
      const durationCount = result.length;
      const durationSum = covertStringToDate(result);
      const timeInHour = timeToDecimal(durationSum);
      if (timeInHour === 0) {
        return '0.0';
      }

      const averagePerHour = durationCount / timeInHour;
      return averagePerHour.toFixed(2);
    });
  return jobResult;
};

const getJobCount = async (data) => {
  const { date, machineId } = data;
  const { startTime, endTime } = convertDateToTimeRange(new Date(date));
  const result = await Jobs.aggregate([
    {
      $match: {
        $or: [
          {
            machineId: null,
            productionStatus: TODO,
            createdAt: {
              $gte: new Date(startTime),
              $lte: new Date(endTime),
            },
          },
          {
            createdTime: {
              $gte: new Date(startTime),
              $lte: new Date(endTime),
            },
            machineId,
          },
        ],
      },
    },
    {
      $group: {
        _id: '$productionStatus',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        count: 1,
      },
    },
  ]);
  if (!result || result.length === 0) {
    const productionStatus = await Jobs.distinct('productionStatus');
    const zeroCountArray = productionStatus.map((status) => ({
      _id: status,
      count: 0,
    }));
    return zeroCountArray;
  }

  return result;
};

const getJobCountByFilter = async (filter, machineId) => {
  const currentDate = new Date();
  const { startTime, endTime } = convertDateToTimeRange(currentDate);
  const count = await Jobs.countDocuments({
    updatedAt: {
      $gte: new Date(startTime),
      $lte: new Date(endTime),
    },
    machineId,
    productionStatus: { $in: [...filter] },
  });

  return count;
};

const getAverageCostSavings = async (data) => {
  const { machineId, from, to } = data;

  const dateFrom = new Date(from);
  const dateTo = new Date(to);

  dateFrom.setUTCHours(0, 0, 0, 0);
  dateTo.setUTCHours(23, 59, 59, 999);

  if (!Date.parse(dateFrom) || !Date.parse(dateTo)) {
    return 0;
  }

  try {
    const pipeline = [
      {
        $match: {
          productionStatus: COMPLETED,
          completedTime: {
            $gte: new Date(dateFrom),
            $lt: new Date(dateTo),
          },
          machineId,
        },
      },
      {
        $group: {
          _id: null,
          averageSavings: { $avg: '$savings' },
        },
      },
      {
        $project: {
          _id: 0,
          averageSavings: 1,
        },
      },
    ];

    const result = await Jobs.aggregate(pipeline);

    if (result.length > 0) {
      const { averageSavings } = result[0];
      return averageSavings;
    }
    return 0;
  } catch (error) {
    logger.error(error);
    return 0;
  }
};

const jobImportCheck = async (data) => {
  try {
    const { machineGroup: machineGroupName, dateFrom } = data;

    // get all machineIds from the machine group
    const { machines } = await getMachineGroupByName(machineGroupName);

    const machineIdList = machines.map((machine) => machine.machineId);

    const result = await Jobs.countDocuments({
      machineId: {
        $in: machineIdList,
      },
      createdAt: {
        $gte: dateFrom,
      },
    });

    return result;
  } catch (error) {
    logger.error(`Error while Fetching Jobs count. Error : ${error}`);
    throw error;
  }
};

const getAverageVoidVolumePercentage = async (data) => {
  const { machineId } = data;

  const currentDate = new Date();
  const { startTime, endTime } = convertDateToTimeRange(currentDate);
  const voidVolumePercentage = await Jobs.aggregate([
    {
      $match: {
        completedTime: {
          $gte: new Date(startTime),
          $lte: new Date(endTime),
        },
        productionStatus: COMPLETED,
        machineId,
      },
    },
    {
      $addFields: {
        // parsedvoidVolumePercentage: {
        //   $multiply: [
        //     {
        //       $divide: [
        //         { $toDouble: '$voidVolume' },
        //         { $toDouble: '$boxVolume' },
        //       ],
        //     },
        //     100,
        //   ],
        // },
        parsedvoidVolumePercentage: { $toDouble: '$voidPercentage' },
      },
    },
    {
      $group: {
        _id: '$productionStatus',
        totalVolume: { $sum: '$parsedvoidVolumePercentage' },
        count: { $sum: 1 },
      },
    },
  ]);
  if (voidVolumePercentage.length === 0) {
    return 0;
  }
  const averageVoidVolumePercentage =
    voidVolumePercentage[0].totalVolume / voidVolumePercentage[0].count;
  return averageVoidVolumePercentage;
};

const getJobCycleTime = async (data) => {
  const { machineId } = data;
  const currentDate = new Date();
  const { startTime, endTime } = convertDateToTimeRange(currentDate);
  const jobCycleTimeData = await Jobs.aggregate([
    {
      $match: {
        completedTime: {
          $gte: new Date(startTime),
          $lte: new Date(endTime),
        },
        productionStatus: COMPLETED,
        machineId,
      },
    },
    {
      $group: {
        _id: '$productionStatus',
        totalCycleTime: {
          $sum: {
            $toDouble: {
              $ifNull: ['$stationDuration', 0],
            },
          },
        },
        averageCycleTime: {
          $avg: {
            $toDouble: {
              $ifNull: ['$stationDuration', 0],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalCycleTimeInHHMMSS: convertMillisecondsToHHMMSS({
          $round: '$totalCycleTime',
        }),
        averageCycleTimeInHHMMSS: convertMillisecondsToHHMMSS({
          $round: '$averageCycleTime',
        }),
      },
    },
  ]);
  return jobCycleTimeData.length === 0
    ? { average: '00:00:00', total: '00:00:00' }
    : {
        average: jobCycleTimeData[0].averageCycleTimeInHHMMSS,
        total: jobCycleTimeData[0].totalCycleTimeInHHMMSS,
      };
};

const getLinearMaterialDispensed = async (data, conversionFactor) => {
  const { machineId } = data;

  const currentDate = new Date();
  const { startTime, endTime } = convertDateToTimeRange(currentDate);
  const dispenseMaterialData = await Jobs.aggregate([
    {
      $match: {
        completedTime: {
          $gte: new Date(startTime),
          $lte: new Date(endTime),
        },
        productionStatus: COMPLETED,
        machineId,
      },
    },
    {
      $group: {
        _id: '$productionStatus',
        totalVolume: {
          $sum: {
            $toDouble: {
              $ifNull: ['$paperLengthDispensed', 0],
            },
          },
        },
        averageVolume: {
          $avg: {
            $toDouble: {
              $ifNull: ['$paperLengthDispensed', 0],
            },
          },
        },
      },
    },
  ]);

  if (dispenseMaterialData.length === 0) {
    return {
      average: {
        value: 0,
        displayUnit: conversionFactor.exportDimension,
      },
      total: {
        value: 0,
        displayUnit: conversionFactor.exportDimension,
      },
    };
  }

  let average = dispenseMaterialData[0].averageVolume;
  let total = dispenseMaterialData[0].totalVolume;

  if (conversionFactor && Object.keys(conversionFactor).length) {
    average = convertMeasurementUnit(
      'dimension',
      average,
      conversionFactor.importDimension,
      conversionFactor.exportDimension
    );
    total = convertMeasurementUnit(
      'dimension',
      total,
      conversionFactor.importDimension,
      conversionFactor.exportDimension
    );
  }
  return {
    average: {
      value: average,
      displayUnit: conversionFactor.exportDimension,
    },
    total: {
      value: total,
      displayUnit: conversionFactor.exportDimension,
    },
  };
};

const getAirPillowDispensed = async (data) => {
  const { machineId } = data;

  const currentDate = new Date();
  const { startTime, endTime } = convertDateToTimeRange(currentDate);
  const dispenseMaterialData = await Jobs.aggregate([
    {
      $match: {
        completedTime: {
          $gte: new Date(startTime),
          $lte: new Date(endTime),
        },
        productionStatus: COMPLETED,
        machineId,
      },
    },
    {
      $group: {
        _id: '$productionStatus',
        totalVolume: {
          $sum: {
            $toDouble: {
              $ifNull: ['$airPillowsDispensed', 0],
            },
          },
        },
        averageVolume: {
          $avg: {
            $toDouble: {
              $ifNull: ['$airPillowsDispensed', 0],
            },
          },
        },
      },
    },
  ]);
  return dispenseMaterialData.length === 0
    ? { average: 0, total: 0 }
    : {
        average: dispenseMaterialData[0].averageVolume,
        total: dispenseMaterialData[0].totalVolume,
      };
};

module.exports = {
  getJob,
  getJobById,
  getPercentageVolume,
  getThroughput,
  getJobCount,
  getJobCountByFilter,
  getAverageCostSavings,
  jobImportCheck,
  getAverageVoidVolumePercentage,
  getJobCycleTime,
  getLinearMaterialDispensed,
  getAirPillowDispensed,
};
