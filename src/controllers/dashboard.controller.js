const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const {
  jobService,
  machineCycleTimeService,
  computeEffectivenessMetricsService,
} = require('../services');
const { DASHBOARD } = require('../config/constants');

const getDashboard = catchAsync(async (req, res) => {
  try {
    const { date, machineId, averageCostSavingsDate } = req.body.filters;

    const [
      machineUpTimeData,
      getVolume,
      throughputData,
      jobCountData,
      averageCostSavingsData,
      computedOEEData,
    ] = await Promise.all([
      machineCycleTimeService.getMachineUptime({ machineId }),
      jobService.getPercentageVolume({ machineId }),
      jobService.getThroughput({ machineId }),
      jobService.getJobCount({ date, machineId }),
      jobService.getAverageCostSavings({
        from: averageCostSavingsDate.from,
        to: averageCostSavingsDate.to,
        machineId,
      }),
      computeEffectivenessMetricsService.calculateOEE({
        machineId,
      }),
    ]);
    logger.info(`${DASHBOARD.DASHBOARD_STATUS_SUCCESS}`);
    res.status(200).send({
      uptime: machineUpTimeData || '00:00:00',
      percentageVolumeReduction: getVolume.toFixed(2),
      throughputRunningAverage: throughputData || 0,
      jobCount: jobCountData,
      averageCostSavings: averageCostSavingsData,
      computedOEEData,
    });
  } catch (error) {
    logger.error(`${DASHBOARD.JOBS_INTERNAL_SERVER_ERROR} - ${error}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(`${DASHBOARD.JOBS_INTERNAL_SERVER_ERROR} - ${error}`);
  }
});

module.exports = {
  getDashboard,
};
