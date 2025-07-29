const httpStatus = require('http-status');
const ConfigMachineLookup = require('../../../src/models/config_machine_lookup.model');
const ConfigMachineGroup = require('../../../src/models/config_machine_group.model');
const {
  deleteConfigMachineLookup,
} = require('../../../src/services/config_machine_lookup');
const ApiError = require('../../../src/utils/ApiError');
const { CONFIG_MACHINE_LOOKUP } = require('../../../src/config/constants');

describe('deleteConfigMachineLookup', () => {
  const machineId = '65c4bbc9f0a7205a88499060';

  it('should delete machine if it exists and is not in a group', async () => {
    // Mock getConfigMachineLookupById to return machineData
    ConfigMachineLookup.findById = jest.fn().mockImplementation(() => ({
      populate: () => ({
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine lookup updated successfully',
        })),
      }),
    }));
    ConfigMachineGroup.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    ConfigMachineLookup.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'ConfigMachineLookup lookup deleted successfuly',
    }));

    const result = await deleteConfigMachineLookup(machineId);

    expect(ConfigMachineLookup.findById).toHaveBeenCalledWith(machineId);
    expect(ConfigMachineGroup.findOne).toHaveBeenCalled();
    expect(ConfigMachineLookup.deleteOne).toHaveBeenCalledWith({
      _id: machineId,
    });
    expect(result).toEqual({
      message: 'ConfigMachineLookup lookup deleted successfuly',
    });
  });

  it('should throw NOT_FOUND error if machine does not exist', async () => {
    ConfigMachineLookup.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await expect(deleteConfigMachineLookup(machineId)).rejects.toThrow(
      ApiError
    );
    await expect(deleteConfigMachineLookup(machineId)).rejects.toMatchObject({
      statusCode: httpStatus.NOT_FOUND,
      message: 'Config machine lookup not found',
    });
  });

  it('should throw BAD_REQUEST error if machine is part of a group', async () => {
    ConfigMachineLookup.findById = jest.fn().mockImplementation(() => ({
      populate: () => ({
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine lookup updated successfully',
        })),
      }),
    }));
    ConfigMachineGroup.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ name: 'TestGroup' }),
    });

    await expect(deleteConfigMachineLookup(machineId)).rejects.toThrow(
      ApiError
    );
    const msg = CONFIG_MACHINE_LOOKUP.MT_DETACH_DEPENDENCIES(
      'boxsizer_2',
      'TestGroup'
    );
    await expect(deleteConfigMachineLookup(machineId)).rejects.toMatchObject({
      statusCode: httpStatus.BAD_REQUEST,
      message: msg,
    });
  });
});
