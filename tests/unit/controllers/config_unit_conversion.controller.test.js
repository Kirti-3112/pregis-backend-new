const httpStatus = require('http-status');
const {
  createUnitConversion,
  updateUnitConversion,
  getUnitConversions,
  getUnitConversionOptions,
} = require('../../../src/controllers/config_unit_conversion.controller');
const { configUnitConversionService } = require('../../../src/services');
const { UNIT_CONVERSION_MESSAGES } = require('../../../src/config/constants');

// Mock dependencies
jest.mock('../../../src/services/config_unit_conversion.service');
jest.mock('../../../src/config/logger');

describe('Unit Conversion Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: { machineId: 'M123', data: 'someData' },
      params: { unitConversionId: 'UC001' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createUnitConversion', () => {
    it('should create unit conversion and return 201', async () => {
      configUnitConversionService.createUnitConversion.mockResolvedValue();

      await createUnitConversion(req, res);

      expect(
        configUnitConversionService.createUnitConversion
      ).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        message:
          UNIT_CONVERSION_MESSAGES.CREATED_SUCCESS_RESPONSE_UNIT_CONVERSION,
      });
    });

    it('should return 409 if duplicate entry (E11000)', async () => {
      const error = new Error('E11000 duplicate key');
      configUnitConversionService.createUnitConversion.mockRejectedValue(error);

      await createUnitConversion(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.CONFLICT);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: UNIT_CONVERSION_MESSAGES.RECORD_ALREADY_EXISTS(
          req.body.machineId
        ),
      });
    });

    it('should return 500 on unknown error', async () => {
      const error = new Error('Unexpected error');
      configUnitConversionService.createUnitConversion.mockRejectedValue(error);

      await createUnitConversion(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: UNIT_CONVERSION_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('updateUnitConversion', () => {
    it('should update unit conversion and return 200', async () => {
      configUnitConversionService.updateUnitConversion.mockResolvedValue();

      await updateUnitConversion(req, res);

      expect(
        configUnitConversionService.updateUnitConversion
      ).toHaveBeenCalledWith(req.params.unitConversionId, req.body);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message:
          UNIT_CONVERSION_MESSAGES.UPDATED_SUCCESS_RESPONSE_UNIT_CONVERSION(
            req.params.unitConversionId
          ),
      });
    });

    it('should return 409 if duplicate entry (E11000)', async () => {
      const error = new Error('E11000 duplicate key');
      configUnitConversionService.updateUnitConversion.mockRejectedValue(error);

      await updateUnitConversion(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.CONFLICT);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: UNIT_CONVERSION_MESSAGES.RECORD_ALREADY_EXISTS(
          req.body.machineId
        ),
      });
    });

    it('should return 500 on unknown error', async () => {
      const error = new Error('Something went wrong');
      configUnitConversionService.updateUnitConversion.mockRejectedValue(error);

      await updateUnitConversion(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: UNIT_CONVERSION_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    });
  });
  describe('getUnitConverion', () => {
    beforeEach(() => {
      req = {
        body: {
          pagination: {
            page: 1,
            limit: 15,
          },
          filters: {},
        },
      };
    });
    it('should get unit conversion value', async () => {
      const mockData = {
        unitConversionData: [{ id: 1 }],
        rowsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
        totalRecords: 1,
      };
      configUnitConversionService.getUnitConversions.mockResolvedValue(
        mockData
      );

      await getUnitConversions(req, res);

      expect(
        configUnitConversionService.getUnitConversions
      ).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockData);
    });

    it('should return 500 on unknown error', async () => {
      const error = new Error('Unexpected error');
      configUnitConversionService.getUnitConversions.mockRejectedValue(error);

      await getUnitConversions(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: UNIT_CONVERSION_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    });
  });
  describe('getUnitConverionOption', () => {
    beforeEach(() => {
      req = {
        body: {
          measurementCategory: ['volume', 'dimension', 'weight'],
        },
      };
    });
    it('should get unit conversion option', async () => {
      const mockData = {
        unitConversionOptions: {
          weight: ['pound', 'gram', 'kilogram'],
          volume: [
            'cubic_centimeter',
            'cubic_inch',
            'cubic_feet',
            'cubic_meter',
          ],
          dimension: ['centimeter', 'millimeter', 'inch', 'foot'],
        },
        nativeValueForImportUOM: {
          importVolume: 'cubic_centimeter',
          importDimension: 'milimeter',
          importWeight: 'kilogram',
        },
      };
      configUnitConversionService.getUnitConversionOptions.mockResolvedValue(
        mockData
      );

      await getUnitConversionOptions(req, res);

      expect(
        configUnitConversionService.getUnitConversionOptions
      ).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockData);
    });

    it('should return 500 on unknown error', async () => {
      const error = new Error('Unexpected error');
      configUnitConversionService.getUnitConversionOptions.mockRejectedValue(
        error
      );

      await getUnitConversionOptions(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: UNIT_CONVERSION_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
