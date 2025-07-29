const httpStatus = require('http-status');
const mongoose = require('mongoose');
const {
  get,
  create,
  update,
  remove,
  bulkUpload,
  downloadErrorReport,
  downloadBulkInsertionTemplate,
} = require('../../../src/controllers/config_message_lookup.controller');
const { messageLookupService } = require('../../../src/services');
const {
  MESSAGE_LOOKUP,
  MESSAGE_LOOKUP_BULK_INSERTION_TEMPLATE_FILE_PATH,
} = require('../../../src/config/constants');
const {
  reportBufferMap,
} = require('../../../src/services/config_message_lookup.service');
const logger = require('../../../src/config/logger');

jest.mock('../../../src/services/config_message_lookup.service');
jest.mock('../../../src/config/logger');

describe('MessageLookupController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      params: {},
      file: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('get', () => {
    it('should return data with status 200', async () => {
      const mockData = { results: [], total: 0 };
      messageLookupService.getAllMessageLookup.mockResolvedValue(mockData);
      req.query = { page: '1', limit: '10' };

      await get(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Message Lookup retrieved successfully',
        data: mockData,
      });
    });

    it('should handle errors and return 500', async () => {
      messageLookupService.getAllMessageLookup.mockRejectedValue(
        new Error('Error')
      );

      await get(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('create', () => {
    it('should create message and return 201', async () => {
      const created = { id: '1', message: 'created' };
      messageLookupService.createMessageLookup.mockResolvedValue(created);
      req.body = { message: 'Test' };

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Message Lookup created successfully',
        data: created,
      });
    });

    it('should return 500 on error', async () => {
      messageLookupService.createMessageLookup.mockRejectedValue(
        new Error('fail')
      );

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: MESSAGE_LOOKUP.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('update', () => {
    it('should return 400 for invalid ID', async () => {
      req.body.id = 'invalid';

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid ID format provided for update',
      });
    });

    it('should return 404 if message not found', async () => {
      req.body.id = new mongoose.Types.ObjectId().toString();
      messageLookupService.findById.mockResolvedValue(null);

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: expect.stringContaining('not found'),
      });
    });
  });

  describe('remove', () => {
    it('should return 400 for invalid ID', async () => {
      req.params.id = 'invalid';

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if not found', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      req.params.id = id;
      messageLookupService.findById.mockResolvedValue(null);

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
    });
  });

  describe('bulkUpload', () => {
    it('should return 400 if file is missing', async () => {
      req.file = {};

      await bulkUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Excel file is required',
      });
    });

    it('should return success response', async () => {
      req.file.buffer = Buffer.from('mock');
      messageLookupService.uploadExcelMessageLookup.mockResolvedValue({
        insertedCount: 2,
        duplicateCount: 0,
        incompleteCount: 0,
        reportId: 'abc123',
      });

      await bulkUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          reportDownloadUrl: expect.any(String),
        })
      );
    });

    it('should return 500 on error', async () => {
      req.file.buffer = Buffer.from('mock');
      messageLookupService.uploadExcelMessageLookup.mockRejectedValue(
        new Error('fail')
      );

      await bulkUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('downloadErrorReport', () => {
    it('should return 400 if reportId is missing', () => {
      req.params = {};

      downloadErrorReport(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    });

    it('should return 410 if report not found', () => {
      req.params.reportId = 'not-found';
      reportBufferMap.get = jest.fn().mockReturnValue(undefined);

      downloadErrorReport(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.GONE);
    });
    jest.mock('../../../src/utils/common', () => ({
      setHeadersInResponse: jest.fn(),
    }));
  });
  describe('downloadBulkInsertionTemplate', () => {
    beforeEach(() => {
      req = {};
      res = {
        download: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      logger.info.mockClear();
      logger.error.mockClear();
    });

    it('should call res.download with correct arguments and log info', async () => {
      res.download.mockImplementation((filePath, filename, cb) => cb && cb());
      await downloadBulkInsertionTemplate(req, res);

      expect(res.download).toHaveBeenCalledWith(
        MESSAGE_LOOKUP_BULK_INSERTION_TEMPLATE_FILE_PATH,
        'message-lookup.xlsx',
        expect.any(Function)
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('downloadBulkInsertionTemplate')
      );
    });

    it('should handle error in res.download callback', async () => {
      const error = new Error('Download failed');
      res.download.mockImplementation(
        (filePath, filename, cb) => cb && cb(error)
      );

      await downloadBulkInsertionTemplate(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(MESSAGE_LOOKUP.FILE_DOWNLOAD_ERROR),
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: MESSAGE_LOOKUP.FILE_DOWNLOAD_ERROR,
      });
    });
  });
});
