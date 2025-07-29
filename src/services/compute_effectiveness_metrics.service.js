const { timeStringToMilliseconds } = require('../utils/common');
const {
  getConfigMachineLookupByMachineId,
} = require('./config_machine_lookup');
const { getJobCountByFilter } = require('./jobs.service');
const {
  getMachineUptime,
  getTotalUpTimeDetails,
} = require('./machine_cycle_time.service');

const calculateOEEThroughput = async (options) => {
  const totalJobsHandled = await getJobCountByFilter(
    ['Completed', 'Removed'],
    options.machineId
  );

  const { maxThroughPut } = await getConfigMachineLookupByMachineId(
    options.machineId
  );

  const oeeThroughputResult =
    totalJobsHandled / (maxThroughPut === 0 ? 1 : Number(maxThroughPut));

  return parseFloat(oeeThroughputResult.toFixed(2)); // withOut percentage value
};

const calculateOEEAvailability = async (options) => {
  const { machineId } = options;

  const upTime = await getMachineUptime({ machineId });
  const totalUpTime = await getTotalUpTimeDetails({ machineId });

  // here we are converting "HH:MM:SS" value to milliseconds
  const totalUptimeInMilliseconds = timeStringToMilliseconds(totalUpTime);
  const uptimeInMilliseconds = timeStringToMilliseconds(upTime);

  const calculatedTime = uptimeInMilliseconds / totalUptimeInMilliseconds;

  return calculatedTime > 1 ? 1 : parseFloat(calculatedTime.toFixed(2)); // withOut percentage value
};

const calculateOEEQuality = async (options) => {
  const totalJobsCompleted = await getJobCountByFilter(
    ['Completed'],
    options.machineId
  );
  const totalJobsHandled = await getJobCountByFilter(
    ['Completed', 'Removed'],
    options.machineId
  );

  const oeeQualityResult = totalJobsCompleted / totalJobsHandled;

  return parseFloat(oeeQualityResult.toFixed(2)); // withOut percentage value
};

const calculateOEE = async (options) => {
  const throughputResult = await calculateOEEThroughput(options);
  const availabilityResult = await calculateOEEAvailability(options);
  const qualityResult = await calculateOEEQuality(options);

  const oeeMasterResult =
    qualityResult * availabilityResult * throughputResult * 100; // percentage value

  return {
    oeeMasterResult: parseFloat(oeeMasterResult.toFixed(2)),
    throughputResult: throughputResult * 100,
    availabilityResult: availabilityResult * 100,
    qualityResult: qualityResult * 100,
  };
};

module.exports = {
  calculateOEE,
};
