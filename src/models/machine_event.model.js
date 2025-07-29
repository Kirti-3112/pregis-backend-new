const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const machineEventSchema = mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true,
      trim: true,
    },
    eventCount: {
      type: String,
      required: true,
      trim: true,
      // unique: true, // removed in sprint-16
    },
    errorCode: {
      type: String,
      required: true,
      trim: true,
    },
    reported: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    eventTime: {
      type: Date,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
machineEventSchema.plugin(toJSON);
machineEventSchema.plugin(paginate);

/**
 * @typedef MachineEvent
 */
const MachineEvent = mongoose.model(
  'machineEvent',
  machineEventSchema,
  'machineEvents'
);

module.exports = MachineEvent;
