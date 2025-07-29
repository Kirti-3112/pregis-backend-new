const httpStatus = require('http-status');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const { jobService } = require('../services');
const { JOB_STATUS, JOB_DATA__SIZE_MASTER } = require('../config/constants');

const getJobData = catchAsync(async (req, res) => {
  try {
    const { selectionFieldString } = req.body;

    let selectionFields;

    if (selectionFieldString) {
      selectionFields = selectionFieldString;
    } else {
      selectionFields = JOB_DATA__SIZE_MASTER.TABLE_VIEW_FIELDS_ARRAY.map(
        (obj) => obj.field
      ).join(' ');
    }
    const jobData = await jobService.getJob(req.body, selectionFields);
    logger.info(`${JOB_STATUS.JOBS_STATUS} -  Quantity : ${jobData.length}`);
    res.status(200).send({
      jobData,
      metadata: JOB_DATA__SIZE_MASTER.TABLE_VIEW_FIELDS_ARRAY,
    });
  } catch (error) {
    logger.error(`${JOB_STATUS.JOBS_INTERNAL_SERVER_ERROR} - ${error}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(`${JOB_STATUS.JOBS_INTERNAL_SERVER_ERROR} - ${error}`);
  }
});

const getJobDataById = catchAsync(async (req, res) => {
  try {
    const selectionFields =
      JOB_DATA__SIZE_MASTER.DETAILED_VIEW_FIELDS_ARRAY.map(
        (obj) => obj.field
      ).join(' ');
    const jobData = await jobService.getJobById(req, selectionFields);
    logger.info(`${JOB_STATUS.JOBS_STATUS}`);
    res.status(200).send({
      jobData,
      metadata: JOB_DATA__SIZE_MASTER.DETAILED_VIEW_FIELDS_ARRAY,
    });
  } catch (error) {
    logger.error(`${JOB_STATUS.JOBS_INTERNAL_SERVER_ERROR} - ${error}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(`${JOB_STATUS.JOBS_INTERNAL_SERVER_ERROR} - ${error}`);
  }
});

module.exports = {
  getJobData,
  getJobDataById,
};
