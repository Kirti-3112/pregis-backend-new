const mongoose = require('mongoose');

const { toJSON } = require('./plugins');

const configMachineGroupSchema = mongoose.Schema(
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

    machines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        unique: [true, 'Machines is already assigned to MachineGroup'],
      },
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

configMachineGroupSchema.plugin(toJSON);

configMachineGroupSchema.pre('save', async function (next) {
  this.name = this.name.toLowerCase();
  next();
});

const ConfigMachineGroup = mongoose.model(
  'ConfigMachineGroup',
  configMachineGroupSchema,
  'configMachineGroup'
);

module.exports = ConfigMachineGroup;
