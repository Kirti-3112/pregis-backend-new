const dayjs = require('dayjs');
const catchAsync = require('../../../utils/catchAsync');
const { historyService } = require('../../../services');
const {
  sendJSONResponse,
  sendXLSXResponse,
  handleError,
} = require('../../../utils/historyUtils');

const getPaperLengthDispensedByTimerange = catchAsync(async (req, res) => {
  try {
    if (req.body.extension === 'JSON') {
      const paperDispensedByDay =
        await historyService.getPaperLengthDispensedByTimerange(req.body);

      const responseData = {
        name: 'Paper Dispensed by Day',
        dates: paperDispensedByDay.map((job) => job.date),
        totalPaperLengthDispensed: paperDispensedByDay.map(
          (job) => job.totalPaperLengthDispensed
        ),
      };

      sendJSONResponse(res, responseData);
    } else if (req.body.extension === 'XLSX') {
      const records = await historyService.getPaperLengthDispensedByTimerange(
        req.body
      );
      const formattedRecords = records.map((record) => ({
        date:
          req.body.timeRange === 'hourly'
            ? record.date
            : dayjs(record.date).format('MM-DD-YYYY'),
        totalPaperLengthDispensed: record.totalPaperLengthDispensed,
      }));

      sendXLSXResponse(
        res,
        formattedRecords,
        'Paper Dispensed by Day',
        'Paper_Dispensed_By_Day'
      );
    }
  } catch (error) {
    handleError(
      res,
      error,
      'Error while fetching Paper Dispensed by Day chart details.'
    );
  }
});

module.exports = {
  getPaperLengthDispensedByTimerange,
};
