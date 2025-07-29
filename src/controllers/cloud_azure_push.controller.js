const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { jobService } = require('../services');
const { EXTENSIONS } = require('../config/constants');
const {
  exportTableData,
  setHeadersInResponse,
  formatDateAndTime,
} = require('../utils/common');
const logger = require('../config/logger');
const { CLOUD_AZURE } = require('../config/constants');

const pushData = catchAsync(async (req, res) => {
  try {
    if (req.body.extension === EXTENSIONS.JSON) {
      const jobData = await jobService.getJob(req.body);
      const records = [...jobData.job];
      const updatedJobs = records.map((job) => {
        const { _id, ...jobDetails } = job._doc;
        return formatDateAndTime(job, jobDetails);
      });
      logger.info(
        `${CLOUD_AZURE.AZURE_STATUS_JSON} -  Quantity : ${updatedJobs.length}`
      );
      res.status(200).send({
        jobData: updatedJobs,
      });
    }
    if (req.body.extension === EXTENSIONS.XLSX) {
      const jobData = await jobService.getJob(req.body);
      const records = [...jobData.job];
      const updatedJobs = records.map((job) => {
        const { _id, ...jobDetails } = job._doc;
        return formatDateAndTime(job, jobDetails);
      });
      const headers = Object.keys(updatedJobs[0]);
      const result = {
        headers,
        records: updatedJobs,
      };
      const workbook = exportTableData(result);
      setHeadersInResponse(res, req.body.fileName);
      logger.info(
        `${CLOUD_AZURE.AZURE_STATUS_XLSX} -  Quantity : ${updatedJobs.length}`
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    }
  } catch (error) {
    logger.error(`${CLOUD_AZURE.AZURE_INTERNAL_SERVER_ERROR} - ${error}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(`${CLOUD_AZURE.AZURE_INTERNAL_SERVER_ERROR} - ${error}`);
  }
});

module.exports = {
  pushData,
};
