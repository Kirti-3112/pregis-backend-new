const httpStatus = require('http-status');
const dayjs = require('dayjs');
const catchAsync = require('../utils/catchAsync');
const { historyService } = require('../services');
const {
  sendJSONResponse,
  sendXLSXResponse,
  handleError,
} = require('../utils/historyUtils');

const getLoggedEventsHistory = catchAsync(async (req, res) => {
  const loggedEvents = await historyService.getLoggedEvents(req.body);
  res.status(httpStatus.CREATED).send(loggedEvents);
});

const getReportsForGraph = catchAsync(async (req, res) => {
  try {
    if (req.body.extension === 'JSON') {
      const reportVolumeReduction =
        await historyService.getReportsVolumeReduction(req.body);

      const responseData = {
        name: 'Average Volume Reduction by Day',
        dates: reportVolumeReduction.map((job) => job.date),
        percentages: reportVolumeReduction.map((job) =>
          parseFloat(job.averagePercentage.toFixed(2))
        ),
      };

      sendJSONResponse(res, responseData);
    } else if (req.body.extension === 'XLSX') {
      const records = await historyService.getReportsVolumeReduction(req.body);
      const formattedRecords = records.map((record) => ({
        date: dayjs(record.date).format('MM-DD-YYYY'),
        averagePercentage: record.averagePercentage,
      }));

      sendXLSXResponse(
        res,
        formattedRecords,
        'Average Volume Reduction by Day',
        'Average_vol_reduction'
      );
    }
  } catch (error) {
    handleError(
      res,
      error,
      'Error while fetching average volume reduction chart details.'
    );
  }
});

const getProductionByDay = catchAsync(async (req, res) => {
  try {
    if (req.body.extension === 'JSON') {
      const productionByDay = await historyService.getReportsProductionByDay(
        req.body
      );

      const responseData = {
        name: 'Production by Day',
        dates: productionByDay.map((job) => job.date),
        eventCount: productionByDay.map((job) => job.count),
      };

      sendJSONResponse(res, responseData);
    } else if (req.body.extension === 'XLSX') {
      const records = await historyService.getReportsProductionByDay(req.body);
      const formattedRecords = records.map((record) => ({
        date: dayjs(record.date).format('MM-DD-YYYY'),
        eventCount: record.count,
      }));

      sendXLSXResponse(
        res,
        formattedRecords,
        'Production by Day',
        'Production_By_Day'
      );
    }
  } catch (error) {
    handleError(
      res,
      error,
      'Error while fetching production by Day chart details.'
    );
  }
});

const getCountOfMachineEvent = catchAsync(async (req, res) => {
  try {
    if (req.body.extension === 'JSON') {
      const countMachineEvent = await historyService.getReportCountMachineEvent(
        req.body
      );

      const responseData = countMachineEvent.reduce(
        (acc, event) => {
          acc.eventCount.push(event.eventCount);
          acc.errorCode.push(event.errorCode);
          acc.message.push(event.message);

          return acc;
        },
        {
          name: 'Count of machine Events',
          eventCount: [],
          errorCode: [],
          message: [],
        }
      );

      sendJSONResponse(res, responseData);
    } else if (req.body.extension === 'XLSX') {
      const records = await historyService.getReportCountMachineEvent(req.body);

      const sheetName = 'Count of machine Events';

      sendXLSXResponse(res, records, sheetName, 'Count_Machine_Event');
    }
  } catch (error) {
    handleError(
      res,
      error,
      'Error while fetching count of machine Events chart details.'
    );
  }
});

const getJobCompletedByHour = catchAsync(async (req, res) => {
  try {
    if (req.body.extension === 'JSON') {
      const reportJobCompletedByHour =
        await historyService.getReportsJobCompletedByHour(req.body);

      const responseData = {
        name: 'Job Completed By Hour',
        count: reportJobCompletedByHour.map((job) => job.count),
        date: reportJobCompletedByHour.map((job) => job.date),
      };

      sendJSONResponse(res, responseData);
    } else if (req.body.extension === 'XLSX') {
      const recordsRaw = await historyService.getReportsJobCompletedByHour(
        req.body
      );
      const records = recordsRaw.map((record) => ({
        date: record.date,
        jobcount: record.count,
      }));

      const sheetName = 'Job Completed By Hour';

      sendXLSXResponse(res, records, sheetName, 'Job_Completed_By_Hours');
    }
  } catch (error) {
    handleError(
      res,
      error,
      'Error while fetching job completed by hour chart details.'
    );
  }
});

const getDistinctAreas = catchAsync(async (req, res) => {
  const distinctAreas = await historyService.getDistinctAreas();
  res.status(httpStatus.OK).send({ areas: distinctAreas });
});

/**
 * TODO: Change all VoidVolumeMinimumByDay function name to latest chart function name
 * Chart name change from : "Void Volume below Minimum by Day" to: "Percentage of Boxes with Below Minimum Void Volume"
 */
const getVoidVolumeMinimumByDay = catchAsync(async (req, res) => {
  try {
    if (req.body.extension === 'JSON') {
      const responseData = await historyService.getVoidVolumeMinimumByTimerange(
        req.body
      );

      const voidVolumeMinimumByDay = responseData.reduce(
        (acc, record) => {
          acc.dates.push(record._id);
          acc.voidVolumeMinimumPercentage.push(
            record.voidVolumeMinimumPercentage
          );
          acc.notHandledJobs.push(record.notHandledCount);
          acc.completedJobs.push(record.completedCount);

          return acc;
        },
        {
          name: 'Percentage of Boxes with Below Minimum Void Volume',
          dates: [],
          voidVolumeMinimumPercentage: [],
          notHandledJobs: [],
          completedJobs: [],
        }
      );

      sendJSONResponse(res, voidVolumeMinimumByDay);
    } else if (req.body.extension === 'XLSX') {
      const records = await historyService.getVoidVolumeMinimumByTimerange(
        req.body
      );
      const formattedRecords = records.map((record) => ({
        date: dayjs(record.date).format('MM-DD-YYYY'),
        voidVolumeMinimumByDay: record.voidVolumeMinimumPercentage,
        notHandledJobs: record.notHandledCount,
        completedJobs: record.completedCount,
      }));

      sendXLSXResponse(
        res,
        formattedRecords,
        'Percentage of Boxes with Below Minimum Void Volume',
        'Percentage_of_Boxes_with_Below_Minimum_Void_Volume'
      );
    }
  } catch (error) {
    handleError(
      res,
      error,
      'Error while fetching Percentage of Boxes with Below Minimum Void Volume chart details.'
    );
  }
});

module.exports = {
  getLoggedEventsHistory,
  getJobCompletedByHour,
  getReportsForGraph,
  getProductionByDay,
  getCountOfMachineEvent,
  getDistinctAreas,
  getVoidVolumeMinimumByDay,
};
