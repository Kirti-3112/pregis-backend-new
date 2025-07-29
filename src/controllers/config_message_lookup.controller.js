const httpStatus = require('http-status');
const mongoose = require('mongoose');

const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const {
  MESSAGE_LOOKUP,
  MESSAGE_LOOKUP_BULK_INSERTION_TEMPLATE_FILE_PATH,
} = require('../config/constants');
const { messageLookupService } = require('../services');
const {
  reportBufferMap,
} = require('../services/config_message_lookup.service');
const { setHeadersInResponse } = require('../utils/common');

const LOG_LOCATION = '[MessageLookupController]';

const get = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  try {
    const data = await messageLookupService.getAllMessageLookup({
      pagination: { page, limit },
    });
    logger.info(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        MESSAGE_LOOKUP.METHOD_EXECUTED('getAllMessageLookup')
      )
    );

    const responseData = {
      status: 'success',
      message: 'Message Lookup retrieved successfully',
      data,
    };

    return res.status(httpStatus.OK).send(responseData);
  } catch (err) {
    logger.error(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR
      ),
      err
    );
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: 'error', message: MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR });
  }
});

const create = catchAsync(async (req, res) => {
  const { body } = req;
  try {
    const data = await messageLookupService.createMessageLookup(body);
    logger.info(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        MESSAGE_LOOKUP.METHOD_EXECUTED(`${LOG_LOCATION} : create`)
      )
    );

    const responseData = {
      status: 'success',
      message: 'Message Lookup created successfully',
      data,
    };

    return res.status(httpStatus.CREATED).send(responseData);
  } catch (err) {
    if (err.message.includes('duplicate key error')) {
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message:
          'Message with the same Area and MessageBitString already exists.',
      });
    }
    logger.error(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR
      ),
      err
    );
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: 'error', message: MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR });
  }
});

const update = catchAsync(async (req, res) => {
  const { body } = req;
  try {
    if (!mongoose.Types.ObjectId.isValid(body.id)) {
      return res.status(400).send({
        status: 'error',
        message: 'Invalid ID format provided for update',
      });
    }

    const existingMessage = await messageLookupService.findById(body.id);

    if (!existingMessage) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: 'error',
        message: `Message with ID ${body.id} not found`,
      });
    }

    const data = await messageLookupService.updateMessageLookup(body);

    const responseData = {
      status: 'success',
      message: 'Record updated successfully',
      data,
    };

    logger.info(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        MESSAGE_LOOKUP.METHOD_EXECUTED(`${LOG_LOCATION} : update`)
      )
    );

    return res.status(httpStatus.OK).send(responseData);
  } catch (err) {
    if (err.message.includes('duplicate key error')) {
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message:
          'Message with the same Area and MessageBitString already exists.',
      });
    }
    logger.error(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        `${LOG_LOCATION} : ${err.message}`
      ),
      err
    );
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: 'error', message: MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR });
  }
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      status: 'error',
      message: 'Invalid ID format provided for deletion',
    });
  }
  try {
    const existingMessage = await messageLookupService.findById(id);

    if (!existingMessage) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: 'error',
        message: `Message with ID ${id} not found`,
      });
    }

    await messageLookupService.deleteMessageLookup(id);
    logger.info(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        MESSAGE_LOOKUP.METHOD_EXECUTED(`${LOG_LOCATION} : delete`)
      )
    );

    const responseData = {
      status: 'success',
      message: `Message with ID ${id} deleted successfully`,
      data: {},
    };

    return res.status(httpStatus.OK).json(responseData);
  } catch (err) {
    logger.error(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        `${LOG_LOCATION} : ${err.message}`
      ),
      err
    );
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: 'error', message: MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR });
  }
});

const bulkUpload = catchAsync(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    const msg = 'Excel file is required';
    logger.error(MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(msg));
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ status: 'error', message: msg });
  }

  try {
    const { insertedCount, duplicateCount, incompleteCount, reportId } =
      await messageLookupService.uploadExcelMessageLookup(req.file.buffer);

    const summaryMessage = MESSAGE_LOOKUP.SUCCESS_BULK_RESPONSE_MESSAGE_LOOKUP(
      insertedCount,
      duplicateCount,
      incompleteCount
    );
    logger.info(MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(summaryMessage));

    const isPartial = duplicateCount > 0 || incompleteCount > 0;

    return res.status(httpStatus.OK).json({
      status: isPartial ? 'partial_success' : 'success',
      message: summaryMessage,
      reportDownloadUrl: `v1/message-lookup/bulk-create-error-report/${reportId}`,
    });
  } catch (err) {
    const errMsg = MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR;
    logger.error(MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(errMsg), err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: errMsg,
    });
  }
});

const downloadErrorReport = (req, res) => {
  const { reportId } = req.params;

  if (!reportId) {
    const msg = MESSAGE_LOOKUP.REPORT_ID_MISSING;
    logger.warn(MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(msg));
    return res.status(httpStatus.BAD_REQUEST).json({
      status: 'error',
      message: msg,
    });
  }

  const buffer = reportBufferMap.get(reportId);

  if (!buffer) {
    const msg = MESSAGE_LOOKUP.DOWNLOAD_REPORT_NOT_FOUND(reportId);
    logger.warn(MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(msg));
    return res.status(httpStatus.GONE).json({
      status: 'error',
      message: msg,
    });
  }

  try {
    const successMsg = MESSAGE_LOOKUP.DOWNLOAD_REPORT_SUCCESS(reportId);
    logger.info(MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(successMsg));

    setHeadersInResponse(res, 'upload-report', 'xlsx');
    return res.send(Buffer.from(buffer));
  } catch (err) {
    logger.error(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        MESSAGE_LOOKUP.FILE_DOWNLOAD_ERROR
      ),
      err
    );
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: MESSAGE_LOOKUP.FILE_DOWNLOAD_ERROR,
    });
  }
};
const downloadBulkInsertionTemplate = catchAsync(async (req, res) => {
  try {
    res.download(
      MESSAGE_LOOKUP_BULK_INSERTION_TEMPLATE_FILE_PATH,
      'message-lookup.xlsx',
      (error) => {
        if (error) {
          logger.error(
            `${MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
              MESSAGE_LOOKUP.FILE_DOWNLOAD_ERROR
            )}`,
            error
          );
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            message: MESSAGE_LOOKUP.FILE_DOWNLOAD_ERROR,
          });
        }
      }
    );
    logger.info(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        MESSAGE_LOOKUP.METHOD_EXECUTED('downloadBulkInsertionTemplate')
      )
    );
  } catch (error) {
    logger.error(
      MESSAGE_LOOKUP.ATTACH_PREFIX_CODE_TO_MESSAGE(
        `${LOG_LOCATION} : ${error.message}`
      ),
      error
    );
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: 'error', message: MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR });
  }
});

module.exports = {
  get,
  create,
  update,
  remove,
  bulkUpload,
  downloadErrorReport,
  downloadBulkInsertionTemplate,
};
