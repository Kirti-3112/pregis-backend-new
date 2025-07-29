const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const currencySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      default: 'US Dollar',
    },
    symbol: {
      type: String,
      required: false,
      trim: true,
      default: '$',
    },
  },
  { _id: false }
);

const configMachineLookupSchema = mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    machineName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    machineType: {
      type: mongoose.Types.ObjectId,
      ref: 'machineTypeLookup',
      required: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    maxThroughPut: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    dimWeightFactor: {
      type: Number,
      required: false,
      default: 139,
    },
    costMultiplier: {
      type: Number,
      required: false,
      default: 0.5,
    },
    currency: {
      type: currencySchema,
      default: {
        name: 'US Dollar',
        symbol: '$',
      },
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

// add plugin that converts mongoose to json
configMachineLookupSchema.plugin(toJSON);
configMachineLookupSchema.plugin(paginate);

// configMachineLookupSchema.pre('save', async function (next) {
//   this.machineId = this.machineId.toLowerCase();
//   next();
// });

/**
 * @typedef MachineLookup
 */
const ConfigMachineLookup = mongoose.model(
  'Machine',
  configMachineLookupSchema
);

module.exports = ConfigMachineLookup;
