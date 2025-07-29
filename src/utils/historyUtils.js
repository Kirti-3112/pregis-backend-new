const httpStatus = require('http-status');
const { exportTableData, setHeadersInResponse } = require('./common');
const logger = require('../config/logger');

const sendJSONResponse = (res, data) => {
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'success',
    data,
  });
};

const sendXLSXResponse = (res, records, sheetName, fileName) => {
  if (!records || records.length === 0) {
    // Handle the case where records is undefined, null, or empty
    res.status(httpStatus.BAD_REQUEST).send('No records found to export.');
    return;
  }
  const headers = Object.keys(records[0]);

  const workbook = exportTableData({
    headers,
    records,
    sheetName,
  });
  setHeadersInResponse(res, fileName);

  return workbook.xlsx.write(res).then(function () {
    res.status(httpStatus.OK).end();
  });
};

const handleError = (res, error, logMessage) => {
  logger.error(logMessage);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: 'Internal Server Error',
  });
};

module.exports = {
  sendJSONResponse,
  sendXLSXResponse,
  handleError,
};
