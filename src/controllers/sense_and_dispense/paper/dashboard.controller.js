const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');
const {
  jobService,
  machineCycleTimeService,
  computeEffectivenessMetricsService,
} = require('../../../services');
const { DASHBOARD } = require('../../../config/constants');

const getSenseAndDispenseDashboard = catchAsync(async (req, res) => {
  try {
    const { date, machineId, averageCostSavingsDate, conversionFactor } =
      req.body.filters;

    const [
      machineUpTimeData,
      averageVoidVolumePercentage,
      linearMaterialDispensed,
      throughputData,
      jobCountData,
      averageCostSavingsData,
      jobCycleTimeData,
      computedOEEData,
    ] = await Promise.all([
      machineCycleTimeService.getMachineUptime({ machineId }),
      jobService.getAverageVoidVolumePercentage({ machineId }),
      jobService.getLinearMaterialDispensed({ machineId }, conversionFactor),
      jobService.getThroughput({ machineId }),
      jobService.getJobCount({ date, machineId }),
      jobService.getAverageCostSavings({
        from: averageCostSavingsDate.from,
        to: averageCostSavingsDate.to,
        machineId,
      }),
      jobService.getJobCycleTime({ machineId }),
      computeEffectivenessMetricsService.calculateOEE({
        machineId,
      }),
    ]);
    logger.info(`${DASHBOARD.DASHBOARD_STATUS_SUCCESS}`);
    res.status(200).send({
      uptime: machineUpTimeData || '00:00:00',
      averageVoidVolumePercentage: averageVoidVolumePercentage.toFixed(2),
      linearMaterialDispensed,
      throughputRunningAverage: throughputData || 0,
      jobCount: jobCountData,
      averageCostSavings: averageCostSavingsData,
      jobCycleTime: jobCycleTimeData,
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
  getSenseAndDispenseDashboard,
};
