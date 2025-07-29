const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const shiftActivitySchema = new mongoose.Schema({
  machineGroup: {
    type: String,
    ref: 'ConfigMachineGroup',
    required: false,
  },
  machineId: {
    type: String,
    ref: 'configMachine',
    required: false,
  },
  clockIn: {
    type: Date,
    required: false,
  },
  clockOut: {
    type: Date,
    required: false,
  },
  morning: {
    type: String,
    required: false,
  },
  evening: {
    type: String,
    required: false,
  },
  night: {
    type: String,
    required: false,
  },
});

const userMachineShiftSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    currentMachineGroupId: {
      type: String,
      ref: 'ConfigMachineGroup',
      required: false,
    },
    shiftActivity: [{ type: shiftActivitySchema, required: false }],
  },
  {
    timestamps: true,
  }
);

userMachineShiftSchema.plugin(toJSON);

const UserMachineShift = mongoose.model(
  'UserMachineShift',
  userMachineShiftSchema,
  'userMachineShift'
);

module.exports = UserMachineShift;
