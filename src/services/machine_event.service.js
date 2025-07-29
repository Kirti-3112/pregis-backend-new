const { MachineEvent } = require('../models');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const getMachineEventDetails = async (data) => {
  const { machineId } = data;
  const machineDetails = await MachineEvent.findOne({ machineId })
    .select({
      eventCount: 1,
      status: 1,
      area: 1,
      eventTime: 1,
      errorCode: 1,
      machineId: 1,
    })
    .sort({ eventTime: -1 })
    .exec();

  return machineDetails;
};

module.exports = {
  getMachineEventDetails,
};
