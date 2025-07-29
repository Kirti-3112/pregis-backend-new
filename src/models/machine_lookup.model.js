const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const machineLookupSchema = mongoose.Schema(
  {
    Expression: {
      type: String,
      trim: true,
    },
    Area: {
      type: String,
      required: true,
      trim: true,
    },
    Message: {
      type: String,
      required: true,
      trim: true,
    },
    AreaNumber: {
      type: String,
      trim: true,
    },
    MessageNumber: {
      type: Number,
      trim: true,
    },
    MessageBitString: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound unique index
machineLookupSchema.index({ Area: 1, MessageBitString: 1 }, { unique: true });

// add plugin that converts mongoose to json
machineLookupSchema.plugin(toJSON);
machineLookupSchema.plugin(paginate);

/**
 * @typedef MachineLookup
 */
const MachineLookup = mongoose.model('machine_lookup', machineLookupSchema);

module.exports = MachineLookup;
