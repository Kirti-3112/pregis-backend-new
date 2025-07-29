const mongoose = require('mongoose');

const accessConfigurationConstantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AccessConfigurationConstantSchema = mongoose.model(
  'accessConfigurationConstant',
  accessConfigurationConstantSchema,
  'accessConfigurationConstants'
);

module.exports = AccessConfigurationConstantSchema;
