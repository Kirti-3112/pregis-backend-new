const {
  createUnitConversion,
  getUnitConversions,
  deleteUnitConversion,
  updateUnitConversion,
  getUnitConversionByFilter,
  getUnitConversionOptions,
} = require('../../../src/services/config_unit_conversion.service');

const {
  ConfigUnitConversion,
  AccessConfigurationConstants,
} = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');

jest.mock('../../../src/models');

describe('Unit Conversion Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUnitConversionByFilter', () => {
    it('should return populated unit conversion data', async () => {
      const mockData = { populate: jest.fn().mockResolvedValue('mockResult') };
      ConfigUnitConversion.find = jest.fn().mockReturnValue(mockData);

      const result = await getUnitConversionByFilter({ filter: {} });
      expect(ConfigUnitConversion.find).toHaveBeenCalled();
      expect(mockData.populate).toHaveBeenCalledWith('machineId');
      expect(result).toBe('mockResult');
    });
  });

  describe('createUnitConversion', () => {
    it('should throw conflict error if unit conversion exists', async () => {
      ConfigUnitConversion.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(true),
      });

      await expect(
        createUnitConversion({ machineId: '1', userId: 'user123' })
      ).rejects.toThrow(ApiError);
    });

    it('should create new unit conversion if not exists', async () => {
      ConfigUnitConversion.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      ConfigUnitConversion.create = jest.fn().mockResolvedValue('created');

      const result = await createUnitConversion({
        machineId: '1',
        userId: 'user123',
        name: 'Speed',
      });

      expect(ConfigUnitConversion.create).toHaveBeenCalledWith(
        expect.objectContaining({ createdBy: 'user123' })
      );
      expect(result).toBe('created');
    });
  });

  describe('getUnitConversions', () => {
    it('should return paginated unit conversion data', async () => {
      const filters = { status: true };
      const pagination = { page: 1, limit: 2 };

      ConfigUnitConversion.countDocuments = jest.fn().mockResolvedValue(10);
      ConfigUnitConversion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(['row1', 'row2']),
      });

      const result = await getUnitConversions({ filters, pagination });

      expect(result.unitConversionData.length).toBe(2);
      expect(result.totalPages).toBe(5);
      expect(result.totalRecords).toBe(10);
    });
  });

  describe('deleteUnitConversion', () => {
    it('should throw not found error if no record exists', async () => {
      ConfigUnitConversion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(deleteUnitConversion('123')).rejects.toThrow(ApiError);
    });

    it('should delete unit conversion if found', async () => {
      ConfigUnitConversion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({ _id: '123' }),
      });
      ConfigUnitConversion.deleteOne = jest.fn().mockResolvedValue('deleted');

      const result = await deleteUnitConversion('123');
      expect(ConfigUnitConversion.deleteOne).toHaveBeenCalledWith({
        _id: '123',
      });
      expect(result).toBe('deleted');
    });
  });

  describe('updateUnitConversion', () => {
    it('should throw error if unit conversion not found', async () => {
      ConfigUnitConversion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(updateUnitConversion('123', {})).rejects.toThrow(ApiError);
    });

    it('should update and return unit conversion', async () => {
      const saveMock = jest.fn().mockResolvedValue(true);
      const data = { save: saveMock };

      ConfigUnitConversion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(data),
      });

      const result = await updateUnitConversion('123', {
        userId: 'u1',
        name: 'Speed',
      });

      expect(saveMock).toHaveBeenCalled();
      expect(result).toBe(data);
    });
  });

  describe('getUnitConversionOptions', () => {
    it('should return formatted unit conversion options', async () => {
      AccessConfigurationConstants.aggregate = jest.fn().mockResolvedValue([
        { category: 'Length', records: ['Meter', 'Kilometer'] },
        { category: 'Mass', records: ['Kilogram'] },
      ]);
      const mockNativeUnitConverionValue = {
        category: '[{"Volume":"L","Dimension":"CM","Weight":"KG"}]',
      };

      AccessConfigurationConstants.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockNativeUnitConverionValue),
      });
      const req = { body: { measurementCategory: ['Length', 'Mass'] } };
      const result = await getUnitConversionOptions(req);

      expect(result.unitConversionOptions).toEqual({
        Length: ['Meter', 'Kilometer'],
        Mass: ['Kilogram'],
      });
    });
  });
});
