const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const stationRecordsSchema = new mongoose.Schema({
  stationName: {
    type: String,
    required: true,
  },
  stationIndex: {
    type: Number,
    required: true,
  },
  stationStartTime: {
    type: Date,
    required: true,
  },
  stationExitTime: {
    type: Date,
    required: true,
  },
});

const dispenseEventsSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  dispenseLength: {
    type: Number,
    required: true,
  },
});

const jobsSchema = mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true,
      trim: true,
    },
    jobId: {
      type: String,
      required: true,
      trim: true,
    },
    barcode: {
      type: String,
      required: true,
      trim: true,
    },
    command: {
      type: String,
      required: true,
      trim: true,
    },
    importedTime: {
      type: Date,
      required: true,
      trim: true,
    },
    createdTime: {
      type: Date,
      required: true,
      trim: true,
    },
    completedTime: {
      type: Date,
      required: true,
      trim: true,
    },
    timeZoneOffset: {
      type: String,
      required: true,
      trim: true,
    },
    recipeID: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    unitofMeasure: {
      type: String,
      required: true,
      trim: true,
    },
    boxLength: {
      type: Number,
      required: true,
      trim: true,
    },
    boxWidth: {
      type: Number,
      required: true,
      trim: true,
    },
    boxHeight: {
      type: Number,
      required: true,
      trim: true,
    },
    boxWeight: {
      type: Number,
      required: true,
      trim: true,
    },
    boxLengthMeasured: {
      type: Number,
      required: true,
      trim: true,
    },
    boxWidthMeasured: {
      type: Number,
      required: true,
      trim: true,
    },
    boxHeightMeasured: {
      type: Number,
      required: true,
      trim: true,
    },
    cutDownLength: {
      type: Number,
      required: true,
      trim: true,
    },
    productHeightInBox: {
      type: Number,
      required: true,
      trim: true,
    },
    cutDownNeeded: {
      type: Boolean,
      required: true,
      trim: true,
    },
    boxHeightAfterCutDown: {
      type: Number,
      required: true,
      trim: true,
    },
    reported: {
      type: Boolean,
      required: true,
      trim: true,
    },
    machineSpeed: {
      type: Number,
      required: true,
      trim: true,
    },
    productionStatus: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    volumeReductionPercent: {
      type: Number,
      required: true,
      trim: true,
    },
    pushedToCloud: {
      type: String,
      required: true,
      trim: true,
    },
    operatorID: {
      type: String,
      required: true,
      trim: true,
    },
    additionalData1: {
      type: String,
      required: true,
      trim: true,
    },
    additionalData2: {
      type: String,
      required: true,
      trim: true,
    },
    additionalData3: {
      type: String,
      required: true,
      trim: true,
    },
    additionalData4: {
      type: String,
      required: true,
      trim: true,
    },
    additionalData5: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reasonCode: {
      type: String,
      required: true,
      trim: true,
    },
    dimWeightCharge: {
      type: Number,
      required: true,
      trim: true,
    },
    originalCost: {
      type: Number,
      required: true,
      trim: true,
    },
    newCost: {
      type: Number,
      required: true,
      trim: true,
    },
    savings: {
      type: Number,
      required: true,
      trim: true,
    },
    measuredWeight: {
      type: Number,
      required: true,
      trim: true,
    },
    customerId: {
      type: String,
      required: true,
      trim: true,
    },
    voidFillTypeUsed: {
      type: String,
      required: true,
      trim: true,
    },
    boxHeight_Closed: {
      type: Number,
      required: true,
      trim: true,
    },
    boxVolume: {
      type: Number,
      required: true,
      trim: true,
    },
    productVolume: {
      type: Number,
      required: true,
      trim: true,
    },
    voidVolume: {
      type: Number,
      required: true,
      trim: true,
    },
    airPillowsDispensed: {
      type: Number,
      required: true,
      trim: true,
    },
    airPillowSize: {
      type: String,
      required: true,
      trim: true,
    },
    paperLengthDispensed: {
      type: Number,
      required: true,
      trim: true,
    },
    paperWebWidth: {
      type: String,
      required: true,
      trim: true,
    },
    paperWeight: {
      type: Number,
      required: true,
      trim: true,
    },
    imageFileLocation: {
      type: String,
      required: true,
      trim: true,
    },
    stationRecords: [
      {
        type: stationRecordsSchema,
        required: true,
      },
    ],
    dispenseEvents: [
      {
        type: dispenseEventsSchema,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
jobsSchema.plugin(toJSON);

/**
 * @typedef Jobs
 */
const Jobs = mongoose.model('Jobs', jobsSchema);

module.exports = Jobs;
