const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { machineService, machineLookupService } = require('../services');
const { MACHINE_STATUS } = require('../config/constants');
const logger = require('../config/logger');
const {
  getMachineDownTime,
  getMachineUpTimeForMachineStatus,
} = require('../services/machine_cycle_time.service');

const getMachineDetails = catchAsync(async (req, res) => {
  try {
    const { machineId } = req.body;

    const [machineData, machineTimeData, machineDownTimeData] =
      await Promise.all([
        machineService.getMachineEventDetails({ machineId }),
        getMachineUpTimeForMachineStatus({ machineId }),
        getMachineDownTime({ machineId }),
      ]);

    if (!machineData) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: MACHINE_STATUS.MACHINE_NOT_FOUND });
    }
    const machineLookupsData =
      await machineLookupService.getMachineErrorMessage(
        machineData.area,
        machineData.errorCode
      );

    machineData.message =
      machineLookupsData && machineLookupsData.Message
        ? machineLookupsData.Message
        : MACHINE_STATUS.NO_ALARM;
    logger.info(
      `${MACHINE_STATUS.MACHINE_DETAILS} -  Quantity : ${machineData.length}`
    );

    if (machineData.status === 'Stop' || machineData.status === 'Ready') {
      res.status(httpStatus.OK).send({
        machineData,
        machineTimeData: {
          downTime: machineDownTimeData,
        },
      });
    } else {
      res.status(httpStatus.OK).send({
        machineData,
        machineTimeData: {
          upTime: machineTimeData,
        },
      });
    }
  } catch (error) {
    logger.error(`${MACHINE_STATUS.MACHINE_INTERNAL_SERVER_ERROR} - ${error}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(`${MACHINE_STATUS.MACHINE_INTERNAL_SERVER_ERROR} - ${error}`);
  }
});

module.exports = {
  getMachineDetails,
};
