const { MachineCycleTime, MachineEvent } = require('../models');
const logger = require('../config/logger');
const { calculateDuration, sumTimes } = require('../utils/common');
const {
  DEFAULT_DOWNTIME,
  DOWNTIME_LIST,
  MACHINE_AND_STATUS_UPTIME_LIST,
  MACHINE_AND_STATUS_DEFAULT_UPTIME,
  MACHINE_CYCLE_TIME,
  DEFAULT_UPTIME,
  DEFAULT_TOTAL_UPTIME,
} = require('../config/constants');

const getLatestMachineEventByFilter = async (machineId, statusCriteria) => {
  const currentDate = new Date().toISOString().slice(0, 10);

  const result = await MachineEvent.findOne({
    machineId,
    eventTime: {
      $gte: new Date(currentDate).setHours(0, 0, 0, 0),
      $lt: new Date(currentDate).setHours(23, 59, 59, 999),
    },
    status: { $in: statusCriteria },
  })
    .sort({ eventTime: -1 }) // TODO: if eventTime get wrong value then we will use createdAt field
    .lean();

  return result;
};

const getMachineCycleTimeByFilter = async (machineId, parameter) => {
  const currentDate = `${new Date().toISOString().slice(0, 10)}`;

  const result = await MachineCycleTime.find({
    machineId,
    parameter,
    date: currentDate,
  })
    .select({ _id: 0, duration: 1, startTime: 1 })
    .lean();

  return result;
};

// Here we calculate the upTime for dashboard which is cummulative upTime
const getMachineUptime = async (data) => {
  /**
   * UpTime is calculated from status: AUTO, MANUAL -> Event is handled from MQTT Side
   * TMUT -> Total Machine UpTime
   * MUT  -> Machine UpTime
   * - We fetch the event from the the machine cycle time with machineId, parameters(MUT), currentDate as filter
   */

  const { machineId } = data;

  const result = await getMachineCycleTimeByFilter(
    machineId,
    MACHINE_CYCLE_TIME.MUT
  );

  if (!result) {
    logger.info(
      'To calculate upTime, no relevant events found for the specified criteria.'
    );
    return DEFAULT_UPTIME;
  }

  const computedDuration = result.reduce((acc, val) => {
    /** if When machine is not stop then we get duration & endTime as null
     *    so, we calculate the duration using @function calculateDuration base upon the currentDateTime and startTime of that event
     * else we will use the duration which is in event
     */

    if (!val.duration) {
      const currentDataTime = new Date().toISOString();

      // we are using start time bec. Date filed does not have time zone
      const updatedDuration = calculateDuration(currentDataTime, val.startTime);
      acc.push(updatedDuration);
    } else {
      acc.push(val.duration);
    }

    return acc;
  }, []);

  const upTime = sumTimes(computedDuration);

  logger.info(`UpTime:  ${upTime}`);

  return upTime;
  // console.error('Error occurred while calculating uptime:', error);
};

// Here we calculate the total upTime for dashboard
const getTotalUpTimeDetails = async (data) => {
  // we will calculate this based on Status: START, AUTO, MANUAL, READY
  // 1. Match by TMUT, date, machineId
  // we filter and sum the duration here and return  that

  /**
   *  Total UpTime is calculated from status: START, AUTO, MANUAL, READY -> Event is handled from MQTT Side
   *  TMUT -> Total Machine UpTime
   *  MUT  -> Machine UpTime
   *  - We fetch the event from the the machine cycle time with machineId, parameters(TMUT), currentDate as filter
   */

  const { machineId } = data;

  const result = await getMachineCycleTimeByFilter(
    machineId,
    MACHINE_CYCLE_TIME.TMUT
  );

  if (!result) {
    logger.info(
      'To calculate total upTime, no relevant events found for the specified criteria.'
    );
    return DEFAULT_TOTAL_UPTIME;
  }

  const computedDuration = result.reduce((acc, val) => {
    /** if When machine is not stop then we get duration & endTime as null
     *    so, we calculate the duration using @function calculateDuration base upon the currentDateTime and startTime of that event
     * else we will use the duration which is in event
     */

    if (!val.duration) {
      const currentDataTime = new Date().toISOString();

      // we are using start time bec. Date field does not have time zone
      const updatedDuration = calculateDuration(currentDataTime, val.startTime);
      acc.push(updatedDuration);
    } else {
      acc.push(val.duration);
    }

    return acc;
  }, []);

  const totalUpTime = sumTimes(computedDuration);

  logger.info(`Total UpTime:  ${totalUpTime}`);

  return totalUpTime;
  // console.error('Error occurred while calculating total uptime:', error);
};

// Here we calculate the upTime for machine & status
const getMachineUpTimeForMachineStatus = async (data) => {
  // when status is AUTO or MANUAL
  // take only latest event and chk the above status

  // we consider MachineEvent to calculate uptime for machine & status

  const { machineId } = data;

  const result = await getLatestMachineEventByFilter(
    machineId,
    MACHINE_AND_STATUS_UPTIME_LIST
  );

  if (!result) {
    logger.info(
      'To calculate upTime for Machine & Status, no relevant events found for the specified criteria.'
    );
    return MACHINE_AND_STATUS_DEFAULT_UPTIME;
  }

  // Calculate uptime for machine & status on-the-fly

  const currentDataTime = new Date().toISOString();

  const updatedDuration = calculateDuration(currentDataTime, result.eventTime);

  logger.info(`Machine & Status UpTime:  ${updatedDuration}`);

  return updatedDuration;
  // console.error('Error occurred while fetching downtime:', error);
};

// Here we calculate the downtime for machine & status
const getMachineDownTime = async (data) => {
  // when status is STOP or READY
  // take only latest event and chk the above status

  // we consider MachineEvent to calculate downtime for machine & status

  const { machineId } = data;

  const result = await getLatestMachineEventByFilter(machineId, DOWNTIME_LIST);

  if (!result) {
    logger.info(
      'To calculate downTime, no relevant events found for the specified criteria.'
    );
    return DEFAULT_DOWNTIME;
  }

  // Calculate downtime on-the-fly

  const currentDataTime = new Date().toISOString();

  const updatedDuration = calculateDuration(currentDataTime, result.eventTime);

  logger.info(`DownTime:  ${updatedDuration}`);

  return updatedDuration;
  // console.error('Error occurred while fetching downtime:', error);
};

module.exports = {
  getMachineUptime,
  getTotalUpTimeDetails,
  getMachineDownTime,
  getMachineUpTimeForMachineStatus,
};
