const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const machineTypeSchema = mongoose.Schema(
  {
    machineType: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: false,
    },
    jobImportTopic: {
      type: Boolean,
      default: false,
    },
    jobExportTopic: {
      type: Boolean,
      default: false,
    },
    wmsImportTopic: {
      type: Boolean,
      default: false,
    },
    wmsExportTopic: {
      type: Boolean,
      default: false,
    },
    barcode: {
      type: Boolean,
      default: false,
    },
    heartBeat: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    wmsTestConnection: {
      type: Boolean,
      required: true,
    },
    machineTestConnection: {
      type: Boolean,
      required: true,
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

machineTypeSchema.plugin(toJSON);

// machineTypeSchema.pre('save', async function (next) {
//   // this.machineType = this.machineType.toLowerCase();
//   next();
// });

const MachineType = mongoose.model(
  'machineTypeLookup',
  machineTypeSchema,
  'machineTypeLookup'
);

module.exports = MachineType;
