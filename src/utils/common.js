const excel = require('exceljs');
const dayjs = require('dayjs');
const { default: mongoose } = require('mongoose');
const {
  EXTENSIONS,
  DEFAULT_TOTAL_UPTIME,
  DEFAULT_UPTIME,
  MACHINE_CYCLE_TIME,
  COVERSION_TYPE,
  LIST_OF_MEASUREMENT_FIELD,
} = require('../config/constants');
const logger = require('../config/logger');

const covertStringToDate = (duration) => {
  const jobDurationData = duration.map((element) => element.duration);
  let totalHours = 0;
  let totalMinutes = 0;
  let totalSeconds = 0;
  jobDurationData.forEach((timeValue) => {
    if (timeValue) {
      const [hours, minutes, seconds] = timeValue.split(':').map(Number);
      totalHours += hours;
      totalMinutes += minutes;
      totalSeconds += seconds;
    }
  });

  totalMinutes += Math.floor(totalSeconds / 60);
  totalSeconds %= 60;
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes %= 60;
  const totalSum = `${String(totalHours).padStart(2, '0')}:${String(
    totalMinutes
  ).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

  return totalSum;
};
const timeToDecimal = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours + minutes / 60 + seconds / 3600;
};

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.hasOwn(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
const applyStyleToExcel = (worksheet) => {
  worksheet.eachRow(function (row, rowNumber) {
    row.eachCell(function (cell, colNumber) {
      if (rowNumber === 1) {
        if (cell.value) {
          // eslint-disable-next-line no-param-reassign
          row.getCell(colNumber).font = {
            color: { argb: EXTENSIONS.FONTCOLOR },
            size: 13,
            bold: true,
          };
          // eslint-disable-next-line no-param-reassign
          row.getCell(colNumber).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: EXTENSIONS.BGCOLOR },
          };
        }
      }
    });
  });
};
const exportTableData = (result) => {
  const { headers, records } = result;
  const updatedRecord = records.map((val) => {
    const newRecord = { ...val }; // Create a new object to avoid modifying the original object
    if (newRecord.averagePercentage !== undefined) {
      newRecord.averagePercentage = parseFloat(
        newRecord.averagePercentage.toFixed(2)
      );
    }
    return newRecord;
  });

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet(result.sheetName);
  const customHeaders = headers.map((header) => ({
    header: header.charAt(0).toUpperCase() + header.slice(1),
    key: header,
    width: 32,
  }));

  worksheet.columns = customHeaders;
  worksheet.addRows(updatedRecord);
  applyStyleToExcel(worksheet);
  return workbook;
};
const setHeadersInResponse = (res, fileName) => {
  res.statusCode = 200;
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}_${new Date().getTime()}.xlsx"`
  );
  res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
};
const convertDateToTimeRange = (date) => {
  const dateToFind = date.toISOString().split('T')[0];
  const startTime = new Date(`${dateToFind}T00:00:00.000Z`).toISOString();
  const endTime = new Date(`${dateToFind}T23:59:59.999Z`).toISOString();
  const timeRange = { startTime, endTime };
  return timeRange;
};
const formatDateAndTime = (dateTimes, jobDetails) => {
  return {
    ...jobDetails,
    ImportedTime: dayjs(dateTimes._doc.ImportedTime).format(
      'MM/DD/YYYY HH:mm:ss'
    ),
    CreatedTime: dayjs(dateTimes._doc.CreatedTime).format(
      'MM/DD/YYYY HH:mm:ss'
    ),
    CompletedTime: dayjs(dateTimes._doc.CompletedTime).format(
      'MM/DD/YYYY HH:mm:ss'
    ),
    CreatedAt: dayjs(dateTimes._doc.CreatedAt).format('MM/DD/YYYY HH:mm:ss'),
    date: dayjs(dateTimes._doc.date).format('MM/DD/YYYY HH:mm:ss'),
  };
};

const getDefaultUpTimePayload = (currentMachineEventDetails) => ({
  machine_id: currentMachineEventDetails.machine_id,
  uptime: DEFAULT_UPTIME,
  totalUptime: DEFAULT_TOTAL_UPTIME,
  uptime_date: new Date().toISOString(),
  total_uptime_date: new Date().toISOString(),
  recording: MACHINE_CYCLE_TIME.RECORDING_STARTED,
  isStopped: false,
});

const calculateTotalHours = (clockIn, clockOut) => {
  const startTime = new Date(clockIn);
  const endTime = new Date(clockOut);

  const timeDifference = endTime - startTime;

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  const result = `${hours}:${minutes}:${seconds}`;

  return result;
};

function computeDateRange(startDate, endDate, steps = 1) {
  const dateArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate).toUTCString());
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

function computeShiftHours(clockIn, clockOut) {
  const inTime = new Date(clockIn);
  const outTime = new Date(clockOut);

  // Calculate duration in milliseconds
  const duration = outTime - inTime;

  // Initialize shift hours
  let morning = 0;
  let evening = 0;
  let night = 0;

  // If duration is less than 0, adjust for cases where clock-out is before clock-in
  if (duration < 0) {
    throw new Error(
      `clockIn time cannot be greater than clockOut. clockIn: ${clockIn}, clockOut: ${clockOut}`
    );
  }

  // If duration is greater than 8 hours, divide it into shifts
  if (duration > 8 * 3600 * 1000) {
    // Full shifts
    throw new Error(
      `Shift hours duration cannot be more than 8 hours. clockIn: ${clockIn}, clockOut: ${clockOut}`
    );
  } else {
    // Determine which shift(s) the duration falls into
    if (inTime.getUTCHours() >= 8 && inTime.getUTCHours() < 16) {
      morning = Math.min(16 - inTime.getUTCHours(), duration / (3600 * 1000));
    }
    if (inTime.getUTCHours() >= 16 && inTime.getUTCHours() < 24) {
      evening = Math.min(24 - inTime.getUTCHours(), duration / (3600 * 1000));
    }
    if (inTime.getUTCHours() >= 0 && inTime.getUTCHours() < 8) {
      night = Math.min(8 - inTime.getUTCHours(), duration / (3600 * 1000));
    }
  }

  // Return shift hours
  return { morning, evening, night };
}

function computeShiftBoundaries(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  // Initialize array to store shift boundaries
  const shiftBoundaries = [];

  // Add shift boundaries for the current day
  shiftBoundaries.push(new Date(Date.UTC(year, month, day, 0, 0, 0, 0)));
  shiftBoundaries.push(new Date(Date.UTC(year, month, day, 8, 0, 0, 0)));
  shiftBoundaries.push(new Date(Date.UTC(year, month, day, 16, 0, 0, 0)));

  // Add shift boundary for the next day
  const nextDay = new Date(Date.UTC(year, month, day + 1, 0, 0, 0, 0));
  shiftBoundaries.push(nextDay);

  return shiftBoundaries.map((dateVal) => dateVal.toUTCString());
}

function computeIntermediateShiftBoundaries(cIn, cOut) {
  const computedDateRange = computeDateRange(cIn, cOut);
  let combined = [];
  computedDateRange.forEach((dateString) => {
    const tempShiftBoundaries = computeShiftBoundaries(dateString);
    combined = [...combined, ...tempShiftBoundaries];
  });

  combined = [...new Set([...combined])];

  const cInDate = new Date(cIn);
  const cOutDate = new Date(cOut);

  const result = [];
  combined.forEach((dateString) => {
    const date = new Date(dateString);
    if (date >= cInDate && date <= cOutDate) {
      result.push(dateString);
    }
  });

  return result;
}

function computeIntermediateShiftActivityData(
  intermediateShiftBoundaries,
  machineGroupId
) {
  const intermediateShiftActivityData = [];

  // eslint-disable-next-line
  for (let i = 1; i < intermediateShiftBoundaries.length; i++) {
    const dateString = intermediateShiftBoundaries[i];
    const prevDateString = intermediateShiftBoundaries[i - 1];
    const newShiftActivityObject = {
      machineGroup: machineGroupId,
      clockIn: new Date(prevDateString),
      clockOut: new Date(dateString),
      ...computeShiftHours(prevDateString, dateString),
    };

    intermediateShiftActivityData.push(newShiftActivityObject);
  }
  return intermediateShiftActivityData;
}

function groupByClockInDate(userShiftActivityData) {
  const result = {};

  userShiftActivityData.forEach((item) => {
    const clockInDate = item.clockIn.toISOString().split('T')[0]; // Extract date part

    if (!result[clockInDate]) {
      result[clockInDate] = [];
    }

    result[clockInDate].push(item);
  });

  return result;
}

const computeNearestShiftBoundary = (dateString) => {
  const shiftBoundaries = computeShiftBoundaries(dateString);
  let nearestShiftBoundary;
  let minDiff = Infinity;
  shiftBoundaries.forEach((shiftBoundary) => {
    const diff = new Date(dateString) - new Date(shiftBoundary);
    if (diff >= 0 && diff < minDiff) {
      minDiff = diff;
      nearestShiftBoundary = shiftBoundary;
    }
  });
  return nearestShiftBoundary;
};

const clockOutPreviousShift = (userShiftData, clockOut) => {
  userShiftData.shiftActivity.forEach((activity) => {
    if (!activity.clockOut) {
      // previous shift is one without clockout value
      const { morning, evening, night } = computeShiftHours(
        activity.clockIn,
        clockOut
      );

      activity.clockOut = new Date(clockOut); // eslint-disable-line
      activity.morning = morning; // eslint-disable-line
      activity.evening = evening; // eslint-disable-line
      activity.night = night; // eslint-disable-line
    }
  });
};

function timeStringToMilliseconds(timeString) {
  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);
  // Calculate total milliseconds
  const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;

  return totalMilliseconds;
}

function calculateDuration(currentDataTime, startTime) {
  const updatedDuration =
    new Date(currentDataTime).getTime() - new Date(startTime).getTime();

  const hoursDifference = Math.floor(
    (updatedDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesDifference = Math.floor(
    (updatedDuration % (1000 * 60 * 60)) / (1000 * 60)
  );
  const secondsDifference = Math.floor((updatedDuration % (1000 * 60)) / 1000);

  const result = `${hoursDifference}:${minutesDifference}:${secondsDifference}`;

  return result;
}

function sumTimes(times = []) {
  const z = (n) => (n < 10 ? '0' : '') + n;

  let hour = 0;
  let minute = 0;
  let second = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const time of times) {
    const splited = time.split(':');
    hour += parseInt(splited[0], 10);
    minute += parseInt(splited[1], 10);
    second += parseInt(splited[2], 10);
  }
  const seconds = second % 60;
  const minutes = parseInt(minute % 60, 10) + parseInt(second / 60, 10);
  const hours = hour + parseInt(minute / 60, 10);

  return `${z(hours)}:${z(minutes)}:${z(seconds)}`;
}

const computeShiftDurations = (clockIn, clockOut) => ({
  $let: {
    vars: {
      start: clockIn,
      end: clockOut,
      startTime: {
        hh: { $hour: clockIn },
        mm: { $minute: clockIn },
        ss: { $second: clockIn },
      },
      endTime: {
        hh: { $hour: clockOut },
        mm: { $minute: clockOut },
        ss: { $second: clockOut },
      },
      nightStart: {
        $dateFromParts: {
          year: { $year: clockIn },
          month: { $month: clockIn },
          day: { $dayOfMonth: clockIn },
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
      },
      nightEnd: {
        $dateFromParts: {
          year: { $year: clockIn },
          month: { $month: clockIn },
          day: { $dayOfMonth: clockIn },
          hour: 8,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
      },
      morningStart: {
        $dateFromParts: {
          year: { $year: clockIn },
          month: { $month: clockIn },
          day: { $dayOfMonth: clockIn },
          hour: 8,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
      },
      morningEnd: {
        $dateFromParts: {
          year: { $year: clockIn },
          month: { $month: clockIn },
          day: { $dayOfMonth: clockIn },
          hour: 16,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
      },
      eveningStart: {
        $dateFromParts: {
          year: { $year: clockIn },
          month: { $month: clockIn },
          day: { $dayOfMonth: clockIn },
          hour: 16,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
      },
      eveningEnd: {
        $dateFromParts: {
          year: { $year: clockIn },
          month: { $month: clockIn },
          day: { $dayOfMonth: clockIn },
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 0,
        },
      },
    },
    in: {
      night: {
        $cond: {
          if: { $ne: ['$$end', null] },
          then: {
            $max: [
              0,
              {
                $subtract: [
                  {
                    $min: ['$$morningStart', '$$end'],
                  },
                  {
                    $max: ['$$nightStart', '$$start'],
                  },
                ],
              },
            ],
          },
          else: null,
        },
      },
      morning: {
        $cond: {
          if: { $ne: ['$$end', null] },
          then: {
            $max: [
              0,
              {
                $subtract: [
                  {
                    $min: ['$$morningEnd', '$$end'],
                  },
                  {
                    $max: ['$$morningStart', '$$start'],
                  },
                ],
              },
            ],
          },
          else: null,
        },
      },
      evening: {
        $cond: {
          if: { $ne: ['$$end', null] },
          then: {
            $max: [
              0,
              {
                $subtract: [
                  {
                    $min: ['$$eveningEnd', '$$end'],
                  },
                  {
                    $max: ['$$eveningStart', '$$start'],
                  },
                ],
              },
            ],
          },
          else: null,
        },
      },
    },
  },
});

const convertMillisecondsToHHMMSS = (field) => ({
  $let: {
    vars: {
      totalSeconds: { $divide: [field, 1000] },
      hh: {
        $max: [
          0,
          {
            $floor: {
              $mod: [{ $divide: [{ $divide: [field, 1000] }, 3600] }, 60],
            },
          },
        ],
      },
      mm: {
        $max: [
          0,
          {
            $floor: {
              $mod: [{ $divide: [{ $divide: [field, 1000] }, 60] }, 60],
            },
          },
        ],
      },
      ss: { $max: [0, { $mod: [{ $divide: [field, 1000] }, 60] }] },
    },
    in: {
      $concat: [
        {
          $cond: {
            if: { $lt: ['$$hh', 10] },
            then: { $concat: ['0', { $toString: '$$hh' }] },
            else: { $toString: '$$hh' },
          },
        },
        ':',
        {
          $cond: {
            if: { $lt: ['$$mm', 10] },
            then: { $concat: ['0', { $toString: '$$mm' }] },
            else: { $toString: '$$mm' },
          },
        },
        ':',
        {
          $cond: {
            if: { $lt: ['$$ss', 10] },
            then: { $concat: ['0', { $toString: '$$ss' }] },
            else: { $toString: '$$ss' },
          },
        },
      ],
    },
  },
});

/**
 * Converts days to seconds.
 *
 * @param {number} days - The number of days to convert.
 * @returns {number} The equivalent number of seconds.
 */
function convertDaysToSeconds(days) {
  return days * 24 * 60 * 60;
}

function convertMeasurementUnit(type, value, fromUnit, toUnit) {
  if (Number(value) === 0) return 0;
  if (fromUnit.toLowerCase() === toUnit.toLowerCase()) {
    return Number(value);
  }
  const conversionType = COVERSION_TYPE[type];
  if (conversionType) {
    const conversionUnit = conversionType[fromUnit][toUnit];
    if (conversionUnit) {
      return Number(value) * conversionUnit;
    }
    logger.error(`Conversion from ${fromUnit} to ${toUnit} is not supported.`);
    return Number(value);
  }
  logger.error(
    `Supported conversion type as follow : ${Object.values(COVERSION_TYPE)}`
  );
  return Number(value);
}

function checkFieldCategory(field) {
  // eslint-disable-next-line no-restricted-syntax
  for (const category in LIST_OF_MEASUREMENT_FIELD) {
    if (field in LIST_OF_MEASUREMENT_FIELD[category]) {
      return category;
    }
  }
  return false;
}

function getConversionFactor(conversionFactor, conversionType) {
  const conversionFactorMap = {
    dimension: {
      import: conversionFactor.importDimension,
      export: conversionFactor.exportDimension,
    },
    volume: {
      import: conversionFactor.importVolume,
      export: conversionFactor.exportVolume,
    },
    weight: {
      import: conversionFactor.importWeight,
      export: conversionFactor.exportWeight,
    },
  };

  return conversionFactorMap[conversionType];
}

function applyConversion(value, conversionType, conversionFactor) {
  if (Number(value)) {
    return {
      value: convertMeasurementUnit(
        conversionType,
        value,
        conversionFactor.import,
        conversionFactor.export
      ),
      displayUnit: conversionFactor.export,
    };
  }
  return Number(value);
}

async function modifyReferenceDependencies(deleteDependencies) {
  if (deleteDependencies.length === 0) {
    return false;
  }

  await Promise.all(
    deleteDependencies.map(
      async ({ collectionName, operation, filter, update, options }) => {
        if (operation === 'deleteOne' || operation === 'deleteMany') {
          return collectionName[operation](filter, options);
        }
        if (operation === 'updateOne' || operation === 'updateMany') {
          return collectionName[operation](filter, update, options);
        }
        throw new Error(`Unsupported operation: ${operation}`);
      }
    )
  );

  return true;
}

/**
 * Wrapper function for running Mongoose operations within a transaction.
 * @param {Function} callback - A function containing the operations to be executed within the transaction.
 * @returns {Promise<any>} - The result of the operations in the transaction.
 * @throws {Error} - If any operation within the transaction fails.
 */
const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await callback(session); // Execute the passed callback with the session

    await session.commitTransaction(); // Commit the transaction on success
    return result;
  } catch (error) {
    await session.abortTransaction(); // Rollback on error
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  pick,
  exportTableData,
  setHeadersInResponse,
  formatDateAndTime,
  convertDateToTimeRange,
  covertStringToDate,
  timeToDecimal,
  applyStyleToExcel,
  getDefaultUpTimePayload,
  calculateTotalHours,
  computeShiftBoundaries,
  computeNearestShiftBoundary,
  computeIntermediateShiftBoundaries,
  computeIntermediateShiftActivityData,
  groupByClockInDate,
  computeShiftHours,
  clockOutPreviousShift,
  timeStringToMilliseconds,
  calculateDuration,
  sumTimes,
  computeShiftDurations,
  convertMillisecondsToHHMMSS,
  convertDaysToSeconds,
  convertMeasurementUnit,
  checkFieldCategory,
  getConversionFactor,
  applyConversion,
  modifyReferenceDependencies,
  withTransaction,
};
