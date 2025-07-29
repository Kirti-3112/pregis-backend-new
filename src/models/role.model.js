const mongoose = require('mongoose');

const { toJSON } = require('./plugins');

const roleSchema = mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: false,
    },

    policies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],

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

roleSchema.plugin(toJSON);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
