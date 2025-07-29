const mongoose = require('mongoose');

const { toJSON } = require('./plugins');

const policySchema = mongoose.Schema(
  {
    policyName: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: false,
    },

    isActive: {
      type: Boolean,
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

policySchema.plugin(toJSON);

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
