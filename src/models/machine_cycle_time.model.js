const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const machineCycleTimeSchema = mongoose.Schema(
  {
    machine_id: {
      type: String,
      required: false,
      trim: true,
    },
    uptime: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(value) {
          // Basic regex for validating the "hh:mm:ss" format
          return /^\d{2}:\d{2}:\d{2}$/.test(value);
        },
        message: 'Invalid time format. Please use "hh:mm:ss".',
      },
    },
    totalUptime: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(value) {
          // Basic regex for validating the "hh:mm:ss" format
          return /^\d{2}:\d{2}:\d{2}$/.test(value);
        },
        message: 'Invalid time format. Please use "hh:mm:ss".',
      },
    },
    uptime_date: {
      type: String,
      required: true,
      trim: true,
    },
    total_uptime_date: {
      type: String,
      required: true,
      trim: true,
    },
    recording: {
      type: String,
      required: true,
      trim: true,
    },
    isStopped: {
      type: Boolean,
      required: true,
      trim: true,
    },
    created_at: {
      type: String,
      required: false,
      default: Date.now,
    },
    updated_at: {
      type: String,
      required: false,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
machineCycleTimeSchema.plugin(toJSON);
machineCycleTimeSchema.plugin(paginate);

/**
 * @typedef MachineEvent
 */
const MachineEvent = mongoose.model(
  'machineCycleTime',
  machineCycleTimeSchema,
  'machineCycleTimes'
);

module.exports = MachineEvent;
