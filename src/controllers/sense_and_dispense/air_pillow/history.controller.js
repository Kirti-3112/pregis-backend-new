const dayjs = require('dayjs');
const catchAsync = require('../../../utils/catchAsync');
const { historyService } = require('../../../services');
const {
  sendJSONResponse,
  sendXLSXResponse,
  handleError,
} = require('../../../utils/historyUtils');

const getAirPillowsDispensedByTimerange = catchAsync(async (req, res) => {
  try {
    if (req.body.extension === 'JSON') {
      const airPillowsDispensedByDay =
        await historyService.getAirPillowsDispensedByTimerange(req.body);

      const responseData = {
        name: 'Air Pillows Dispensed by Day',
        dates: airPillowsDispensedByDay.map((job) => job.date),
        totalAirPillowsDispensed: airPillowsDispensedByDay.map(
          (job) => job.totalAirPillowsDispensed
        ),
      };

      sendJSONResponse(res, responseData);
    } else if (req.body.extension === 'XLSX') {
      const records = await historyService.getAirPillowsDispensedByTimerange(
        req.body
      );
      const formattedRecords = records.map((record) => ({
        date:
          req.body.timeRange === 'hourly'
            ? record.date
            : dayjs(record.date).format('MM-DD-YYYY'),
        totalAirPillowsDispensed: record.totalAirPillowsDispensed,
      }));

      sendXLSXResponse(
        res,
        formattedRecords,
        'Air-Pillows Dispensed by Day',
        'Air-Pillows_Dispensed_By_Day'
      );
    }
  } catch (error) {
    handleError(
      res,
      error,
      'Error while fetching Air-Pillows Dispensed by Day chart details.'
    );
  }
});

module.exports = {
  getAirPillowsDispensedByTimerange,
};
