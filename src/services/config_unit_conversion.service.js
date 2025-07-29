const httpStatus = require('http-status');
const {
  ConfigUnitConversion,
  AccessConfigurationConstants,
} = require('../models');
const ApiError = require('../utils/ApiError');
const { NATIVE_UOM } = require('../config/constants');

const getUnitConversionByFilter = async (object) => {
  const { dbMathodName = 'find', filter } = object;

  const unitConversion = await ConfigUnitConversion[dbMathodName](
    filter
  ).populate('machineId');

  // const filteredUnitConversion = unitConversion
  // ? unitConversion.filter((data) => data.machineId)
  // : [];

  return unitConversion;
};

const createUnitConversion = async (unitConversionData) => {
  // CHECK FOR RECORD EXIST FOR machienId: unitConversionData.machineId

  const filteredUnitConversionData = await getUnitConversionByFilter({
    dbMathodName: 'findOne',
    filter: {
      machineId: unitConversionData.machineId,
    },
  });

  if (filteredUnitConversionData) {
    throw new ApiError(httpStatus.CONFLICT);
  }

  const newUnitConversionToCreate = {
    ...unitConversionData,
    createdBy: unitConversionData.userId,
  };

  return ConfigUnitConversion.create(newUnitConversionToCreate);
};

const getUnitConversions = async (body) => {
  const { page, limit } = body.pagination;

  const count = await ConfigUnitConversion.countDocuments(body.filters);

  const unitConversionData = await ConfigUnitConversion.find(body.filters)
    .populate({
      path: 'machineId',
      select: { _id: 1, machineName: 1 },
    })
    .select()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    unitConversionData,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const deleteUnitConversion = async (unitConversionId) => {
  const unitConversionData = await getUnitConversionByFilter({
    dbMathodName: 'findById',
    filter: unitConversionId,
  });

  if (!unitConversionData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Unit Conversion not found for id: ${unitConversionId}`
    );
  }

  const deletedUnitConversion = await ConfigUnitConversion.deleteOne({
    _id: unitConversionId,
  });

  return deletedUnitConversion;
};

const updateUnitConversion = async (unitConversionId, updatedData) => {
  const unitConversionData = await getUnitConversionByFilter({
    dbMathodName: 'findById',
    filter: unitConversionId,
  });

  if (!unitConversionData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Unit Conversion not found for id: ${unitConversionId}`
    );
  }

  const newUpdatedUnitConversion = {
    ...updatedData,
    updatedBy: updatedData.userId,
  };

  Object.assign(unitConversionData, newUpdatedUnitConversion);

  await unitConversionData.save();

  return unitConversionData;
};

const getUnitConversionOptions = async (req) => {
  const { measurementCategory } = req.body;

  const pipeline = [
    {
      $match: { category: { $in: measurementCategory }, isActive: true },
    },
    {
      $group: {
        _id: '$category',
        records: { $push: '$name' },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        records: 1,
      },
    },
  ];

  const unitConversionsOptionsData =
    await AccessConfigurationConstants.aggregate(pipeline);
  const measurementToUnitConversionsMap = unitConversionsOptionsData.reduce(
    (acc, cur) => {
      acc[`${cur.category}`] = cur.records;
      return acc;
    },
    {}
  );

  const nativeUnitConverionValue = await AccessConfigurationConstants.findOne({
    name: 'native_UOM',
  }).select({ _id: 0, category: 1 });

  const { category } = nativeUnitConverionValue;
  const parsedCategory = JSON.parse(category);
  const { Volume, Dimension, Weight } = parsedCategory[0];

  const nativeValueForImportUOM = {
    importVolume: NATIVE_UOM[Volume],
    importDimension: NATIVE_UOM[Dimension],
    importWeight: NATIVE_UOM[Weight],
  };

  return {
    unitConversionOptions: measurementToUnitConversionsMap,
    nativeValueForImportUOM,
  };
};

module.exports = {
  createUnitConversion,
  getUnitConversions,
  deleteUnitConversion,
  updateUnitConversion,
  getUnitConversionByFilter,
  getUnitConversionOptions,
};
