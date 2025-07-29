const { AccessConfigurationConstants } = require('../models');

const getAccessConfigurationConstantsByCategory = async (body) => {
  // const modifiedFilter = category;
  const modifiedFilter = {
    category: { $regex: body.category, $options: 'i' },
  };
  modifiedFilter.isActive = true;
  const accessConfigurationConstantData =
    await AccessConfigurationConstants.find(modifiedFilter)
      .select({
        name: 1,
        _id: 0,
      })
      .exec();

  return accessConfigurationConstantData;
};

module.exports = {
  getAccessConfigurationConstantsByCategory,
};
