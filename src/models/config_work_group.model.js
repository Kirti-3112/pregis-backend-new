const mongoose = require('mongoose');

const { toJSON } = require('./plugins');

const configWorkGroupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: false,
    },

    machineGroups: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ConfigMachineGroup' },
    ],

    status: {
      type: String,
      required: false,
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

configWorkGroupSchema.plugin(toJSON);

configWorkGroupSchema.pre('save', async function (next) {
  this.name = this.name.toLowerCase();
  next();
});

const ConfigWorkGroup = mongoose.model(
  'ConfigWorkGroup',
  configWorkGroupSchema,
  'configWorkGroup'
);

module.exports = ConfigWorkGroup;
