const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { DEFAULT_PREFERENCES_VALUES } = require('../config/constants');

const machineWishListSchema = new mongoose.Schema({
  machineGroup: {
    type: String,
    required: false,
  },
  machineId: {
    type: String,
    required: false,
  },
});

const preferenceDateAndTimeSchema = new mongoose.Schema(
  {
    dateFormat: {
      type: String,
      required: false,
      trim: true,
    },
    timeFormat: {
      type: String,
      required: false,
      trim: true,
    },
    timeZone: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: false }
);

const preferencesSchema = new mongoose.Schema(
  {
    dateAndTime: {
      type: preferenceDateAndTimeSchema,
      required: false,
    },
    authSession: {
      accessTokenTTL: {
        type: Number,
        required: false,
        description: 'Time to live for access tokens in minutes',
      },
    },
  },
  { _id: false }
);

const userSchema = mongoose.Schema(
  {
    displayName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          );
        }
      },
      private: true, // used by the toJSON plugin
    },

    role: {
      type: String,
      enum: roles,
      default: 'user',
    },

    roles: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },

    policies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],

    machineGroups: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ConfigMachineGroup' },
    ],

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

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    machineWishList: {
      type: machineWishListSchema,
      required: false,
    },
    preferences: {
      type: preferencesSchema,
      required: false,
      default: () => ({
        dateAndTime: {
          dateFormat:
            DEFAULT_PREFERENCES_VALUES.DATE_AND_TIME.DEFAULT_DATE_FORMAT,
          timeFormat:
            DEFAULT_PREFERENCES_VALUES.DATE_AND_TIME.DEFAULT_TIME_FORMAT,
          timeZone: DEFAULT_PREFERENCES_VALUES.DATE_AND_TIME.DEFAULT_TIME_ZONE,
        },
        authSession: {
          accessTokenTTL:
            DEFAULT_PREFERENCES_VALUES.AUTH_SESSION.ACCESS_TOKEN_TTL,
        },
      }),
    },
    machineLevelUnitConversion: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (!user.displayName) {
    const [userName] = user.email.split('@');
    user.displayName = userName;
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
