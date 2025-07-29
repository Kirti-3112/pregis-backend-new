const { mongoose } = require('mongoose');
const Cryptr = require('cryptr');
const { toJSON } = require('./plugins');
const { WMS_SECRET_TOKEN } = require('../config/constants');
const AduitCollection = require('./mms_audit_trail.model');
const ConfigMachineLookup = require('./config_machine_lookup.model');
const User = require('./user.model');

const cryptr = new Cryptr(WMS_SECRET_TOKEN);

const configMachineSchema = mongoose.Schema(
  {
    communicationType: {
      type: String,
      required: true,
    },
    machineName: {
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
    url: {
      type: String,
      required: false,
    },
    hostName: {
      type: String,
      required: false,
    },
    portNumber: {
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
    jobImportTopic: {
      type: String,
      required: false,
    },
    machineImportTopic: {
      type: String,
      required: false,
    },
    jobExportTopic: {
      type: String,
      required: false,
    },
    feature: {
      type: String,
      required: true,
    },
    // importDimension: { type: String, required: false },
    // importVolume: { type: String, required: false },
    // importWeight: { type: String, required: false },
    // exportDimensions: [{ type: String, required: false }],
    // exportVolumes: [{ type: String, required: false }],
    // exportWeights: [{ type: String, required: false }],
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

configMachineSchema.plugin(toJSON);

configMachineSchema.pre('save', async function (next) {
  const machine = this;
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
        modifiedFields.preSaveOriginalData = this._original;
      }
    }
    this._modifiedFields = modifiedFields;
  }
  this.wasNew = this.isNew;
  if (machine && machine.password) {
    machine.password = cryptr.encrypt(machine.password);
  }
  next();
});

configMachineSchema.pre(
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

configMachineSchema.post('save', async function (doc) {
  if (this.wasNew) {
    // Insert Action
    const userDeatils = await User.findById(doc.createdBy).lean();
    const secondaryDoc = new AduitCollection({
      collectionName: 'configMachine',
      action: 'insert',
      oldValue: null, // No old document for new inserts
      newValue: doc,
      description: 'ConfigMachine doc inserted',
      userName: userDeatils.email,
    });
    await secondaryDoc.save();
  } else {
    // Update Action
    const { oldValue, newValue, preSaveOriginalData } = doc._modifiedFields;

    await ConfigMachineLookup.updateOne(
      {
        machineId: preSaveOriginalData.machineName,
      },
      { $set: { machineType: newValue.machineType } },
      { runValidators: true }
    );

    const userDeatils = await User.findById(doc.updatedBy).lean();
    const secondaryDoc = new AduitCollection({
      collectionName: 'configMachine',
      action: 'update',
      oldValue, // old value
      newValue, // new value
      description: 'ConfigMachine doc updated',
      userName: userDeatils.email,
    });

    await secondaryDoc.save();
  }
});

configMachineSchema.post('deleteOne', async function () {
  const userDeatils = await User.findById(
    this._docToDelete.updatedBy || this._docToDelete.createdBy
  ).lean();
  // Delete Action
  const secondaryDoc = new AduitCollection({
    collectionName: 'configMachine',
    action: 'delete',
    oldValue: this._docToDelete,
    newValue: null, // No new document for deletes
    description: 'ConfigMachine doc deleted',
    userName: userDeatils.email,
  });

  await secondaryDoc.save();
});

configMachineSchema.methods.encryptPassword = async function (password) {
  return cryptr.encrypt(password);
};

configMachineSchema.methods.decryptPassword = async function (password) {
  return cryptr.decrypt(password);
};

configMachineSchema.index(
  { hostName: 1, portNumber: 1 },
  { unique: true, sparse: true }
);
configMachineSchema.index(
  { url: 1, webserviceType: 1 },
  { unique: true, sparse: true }
);

const configMachine = mongoose.model(
  'configMachine',
  configMachineSchema,
  'configMachines'
);

module.exports = configMachine;
