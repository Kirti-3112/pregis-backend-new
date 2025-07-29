const { unitConversionController } = require('../../../src/controllers');
const {
  ConfigUnitConversion,
  AccessConfigurationConstants,
} = require('../../../src/models');

describe('getUnitConversionOptions', () => {
  let req;
  let res;
  let authNext;

  beforeEach(() => {
    req = {
      body: {
        measurementCategory: ['volume', 'dimension', 'weight'],
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    authNext = jest.fn();
    jest.clearAllMocks();
  });
  it('should import unitconversion value of  selected machineID', async () => {
    const mockAggregateResult = [
      {
        records: [
          'cubic_centimeter',
          'cubic_inch',
          'cubic_feet',
          'cubic_meter',
        ],
        category: 'volume',
      },
      {
        records: ['centimeter', 'millimeter', 'inch', 'foot'],
        category: 'dimension',
      },
      { records: ['pound', 'gram', 'kilogram'], category: 'weight' },
    ];
    AccessConfigurationConstants.aggregate = jest
      .fn()
      .mockResolvedValue(mockAggregateResult);

    const mockNativeUnitConverionValue = {
      category: '[{"Volume":"L","Dimension":"CM","Weight":"KG"}]',
    };

    AccessConfigurationConstants.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockNativeUnitConverionValue),
    });
    await unitConversionController.getUnitConversionOptions(req, res, authNext);
    expect(AccessConfigurationConstants.aggregate).toHaveBeenCalled();
  });
});

describe('getUnitConversion', () => {
  let req;
  let res;
  let authNext;

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
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    authNext = jest.fn();
    jest.clearAllMocks();
  });
  it('should get unitconversion value of selected machineID', async () => {
    const mockUnitConversionValue = [
      {
        machineId: {
          machineName: 'SDPAPER',
          id: '6852597d7dd6a7eb96a834e6',
        },
        importDimension: 'centimeter',
        importVolume: 'cubic_centimeter',
        importWeight: 'pound',
        exportDimension: 'millimeter',
        exportVolume: 'cubic_inch',
        exportWeight: 'gram',
        status: 'Active',
        createdBy: '684bb006a8c650e08bab618e',
        createdAt: '2025-07-03T04:51:22.468Z',
        updatedAt: '2025-07-03T04:51:22.468Z',
        id: '68660c4a39f6c2dc59d94ae9',
      },
    ];
    ConfigUnitConversion.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });
    ConfigUnitConversion.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockUnitConversionValue),
    }));

    await unitConversionController.getUnitConversions(req, res, authNext);
    expect(ConfigUnitConversion.find).toHaveBeenCalled();
  });
});
