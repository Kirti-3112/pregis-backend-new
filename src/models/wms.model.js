const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const { toJSON } = require('./plugins');
const { WMS_SECRET_TOKEN } = require('../config/constants');

const cryptr = new Cryptr(WMS_SECRET_TOKEN);
const AduitCollection = require('./mms_audit_trail.model');
const User = require('./user.model');

const wmsSchema = mongoose.Schema(
  {
    communicationType: {
      type: String,
      required: true,
    },

    wmsName: {
      type: String,
      required: true,
    },

    webserviceType: {
      type: String,
      required: false,
    },

    communicationVia: {
      type: String,
      required: false,
    },
    feature: {
      type: String,
      required: true,
    },

    hostName: {
      type: String,
      required: false,
    },

    portNumber: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },

    userName: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: false,
    },

    jobImport: {
      type: String,
      required: false,
    },

    jobExport: {
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
    machineType: {
      type: mongoose.Types.ObjectId,
      ref: 'machineTypeLookup',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

wmsSchema.plugin(toJSON);

wmsSchema.pre('save', async function (next) {
  const wms = this;
  if (!this.isNew) {
    this._original = await this.constructor.findById(this._id).lean();
    const modifiedFields = {
      oldValue: {},
      newValue: {},
    };
    // Compare the original document with the current document

    // eslint-disable-next-line no-restricted-syntax
    for (const key in this._original) {
      // eslint-disable-next-line no-prototype-builtins
      if (this._original.hasOwnProperty(key) && this.isModified(key)) {
        modifiedFields.oldValue[key] = this._original[key];
        modifiedFields.newValue[key] = this[key];
      }
    }
    this._modifiedFields = modifiedFields;
  }
  this.wasNew = this.isNew;
  if (wms && wms.password) {
    wms.password = cryptr.encrypt(wms.password);
  }
  next();
});

wmsSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function (next) {
    const doc = await this.model.findOne(this.getQuery()).lean();

    if (doc) {
      this._docToDelete = doc;
    }
    next();
  }
);

wmsSchema.post('save', async function (doc) {
  if (this.wasNew) {
    // Insert Action
    const userDeatils = await User.findById(doc.createdBy).lean();
    const secondaryDoc = new AduitCollection({
      collectionName: 'configWMS',
      action: 'insert',
      oldValue: null, // No old document for new inserts
      newValue: doc,
      description: 'configWMS doc inserted',
      userName: userDeatils.email,
    });
    await secondaryDoc.save();
  } else {
    // Update Action
    const userDeatils = await User.findById(doc.updatedBy).lean();
    const { oldValue, newValue } = doc._modifiedFields;
    const secondaryDoc = new AduitCollection({
      collectionName: 'configWMS',
      action: 'update',
      oldValue, // old value
      newValue, // new value
      description: 'configWMS doc updated',
      userName: userDeatils.email,
    });

    await secondaryDoc.save();
  }
});

wmsSchema.post('deleteOne', async function () {
  const userDeatils = await User.findById(
    this._docToDelete.updatedBy || this._docToDelete.createdBy
  ).lean();
  // Delete Action
  const secondaryDoc = new AduitCollection({
    collectionName: 'configWMS',
    action: 'delete',
    oldValue: this._docToDelete,
    newValue: null, // No new document for deletes
    description: 'configWMS doc deleted',
    userName: userDeatils.email,
  });

  await secondaryDoc.save();
});

wmsSchema.methods.encryptPassword = async function (password) {
  return cryptr.encrypt(password);
};

wmsSchema.methods.decryptPassword = async function (password) {
  return cryptr.decrypt(password);
};

const WMS = mongoose.model('configWms', wmsSchema, 'configWms');

module.exports = WMS;
