const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const configUnitConversionSchema = mongoose.Schema(
  {
    // machineId pointing to Configure Machine collection
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'configMachine',
      required: true,
      unique: true,
    },

    machineGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConfigMachineGroup',
      required: false,
    },

    importDimension: { type: String, trim: true },
    importVolume: { type: String, trim: true },
    importWeight: { type: String, trim: true },

    exportDimension: { type: String, trim: true },
    exportVolume: { type: String, trim: true },
    exportWeight: { type: String, trim: true },

    status: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

configUnitConversionSchema.plugin(toJSON);

const ConfigUnitConversion = mongoose.model(
  'configUnitConversion',
  configUnitConversionSchema,
  'configUnitConversion'
);

module.exports = ConfigUnitConversion;
