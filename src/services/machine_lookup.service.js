const { MachineLookup } = require('../models');

const getMachineErrorMessage = async (area, errCode) => {
  const machineLookupData = await MachineLookup.findOne({
    Area: area,
    MessageBitString: errCode,
  })
    .select({
      Message: 1,
    })
    .exec();
  return machineLookupData;
};

module.exports = {
  getMachineErrorMessage,
};
