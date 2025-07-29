const httpStatus = require('http-status');
const { configMachineLookupController } = require('../../../src/controllers');
const {
  ConfigMachineLookup,
  ConfigMachineGroup,
} = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');

describe('ConfigMachineLookup Lookup Controller', () => {
  it('Get All ConfigMachineLookup Lookup Data : Controller', async () => {
    ConfigMachineLookup.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => ({
                machineData: [
                  {
                    machineId: 'M0002',
                    machineName: 'boxsizer_2',
                    machineType: 'Cutter',
                    description: 'This is box sizer machine _2',
                    maxThroughPut: 40,
                    createdBy: '6593f61758ec983208c4ed05',
                    createdAt: '2024-03-14T14:07:00.073Z',
                    id: '65f3048459e320e0996e7a08',
                  },
                ],
                rowsPerPage: 10,
                totalPages: 0,
                currentPage: 1,
                totalRecords: 1,
              }),
            }),
          }),
        }),
      }),
    }));

    ConfigMachineLookup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getConfigMachineLookupReq = {
      body: {
        pagination: {
          page: 3,
          limit: 2,
        },
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getConfigMachineLookupRes = { status: mockStatus };

    const getConfigMachineLookupNext = jest.fn();

    await configMachineLookupController.getAllConfigMachineLookup(
      getConfigMachineLookupReq,
      getConfigMachineLookupRes,
      getConfigMachineLookupNext
    );
    expect(ConfigMachineLookup.find).toHaveBeenCalled();
  });

  it('Error-500 Get All ConfigMachineLookup Lookup Data : Controller', async () => {
    ConfigMachineLookup.find = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    ConfigMachineLookup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getConfigMachineLookupReq = {
      body: {
        pagination: {
          page: 3,
          limit: 2,
        },
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getConfigMachineLookupRes = { status: mockStatus };

    const getConfigMachineLookupNext = jest.fn();

    await configMachineLookupController.getAllConfigMachineLookup(
      getConfigMachineLookupReq,
      getConfigMachineLookupRes,
      getConfigMachineLookupNext
    );
    expect(ConfigMachineLookup.find).toHaveBeenCalled();
  });

  it('Get ConfigMachineLookup Lookup Data By Id: Controller', async () => {
    ConfigMachineLookup.findById = jest.fn().mockImplementation(() => ({
      machineId: 'M0002',
      machineName: 'boxsizer_2',
      machineType: 'Cutter',
      description: 'This is box sizer machine _2',
      maxThroughPut: 40,
      createdBy: '6593f61758ec983208c4ed05',
      createdAt: '2024-03-14T14:07:00.073Z',
      id: '65f3048459e320e0996e7a08',
    }));

    const getConfigMachineLookupReq = {
      params: { machineId: 'M0002' },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getConfigMachineLookupRes = { status: mockStatus };

    const getConfigMachineLookupNext = jest.fn();

    await configMachineLookupController.getConfigMachineLookupById(
      getConfigMachineLookupReq,
      getConfigMachineLookupRes,
      getConfigMachineLookupNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });

  it('Error-404 Get ConfigMachineLookup Lookup Data By Id: Controller', async () => {
    ConfigMachineLookup.findById = jest.fn().mockImplementation(() => ({
      populate: () => null,
    }));

    const getConfigMachineLookupReq = {
      params: { machineId: 'M0002' },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getConfigMachineLookupRes = { status: mockStatus };

    const getConfigMachineLookupNext = jest.fn();

    await configMachineLookupController.getConfigMachineLookupById(
      getConfigMachineLookupReq,
      getConfigMachineLookupRes,
      getConfigMachineLookupNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });

  it('Error-500 Get ConfigMachineLookup Lookup Data By Id: Controller', async () => {
    ConfigMachineLookup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const getConfigMachineLookupReq = {
      params: { machineId: 'M0002' },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getConfigMachineLookupRes = { status: mockStatus };

    const getConfigMachineLookupNext = jest.fn();

    await configMachineLookupController.getConfigMachineLookupById(
      getConfigMachineLookupReq,
      getConfigMachineLookupRes,
      getConfigMachineLookupNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });

  it('Create config machine lookup data: Controller', async () => {
    ConfigMachineLookup.create = jest.fn().mockImplementation(() => ({
      message: 'machine type created successfully',
    }));

    const getConfigMachineLookupReq = {
      body: {
        machineId: 'M0002',
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getConfigMachineLookupRes = { status: mockStatus };
    const authNext = jest.fn();
    await configMachineLookupController.createConfigMachineLookup(
      getConfigMachineLookupReq,
      getConfigMachineLookupRes,
      authNext
    );
    expect(ConfigMachineLookup.create).toHaveBeenCalled();
  });

  it('Error-409 if config machine lookup is already exists createMachine Controller', async () => {
    ConfigMachineLookup.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const getConfigMachineLookupReq = {
      body: {
        machineId: 'M0002',
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const getConfigMachineLookupRes = {};
    const authNext = jest.fn();
    await configMachineLookupController.createConfigMachineLookup(
      getConfigMachineLookupReq,
      getConfigMachineLookupRes,
      authNext
    );

    expect(ConfigMachineLookup.create).toHaveBeenCalled();
  });

  it('Error-500 if config machine lookup failed to call createMachine Controller', async () => {
    ConfigMachineLookup.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const getConfigMachineLookupReq = {
      body: {
        machineId: 'M0002',
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getConfigMachineLookupRes = { status: mockStatus };
    const authNext = jest.fn();

    await configMachineLookupController.createConfigMachineLookup(
      getConfigMachineLookupReq,
      getConfigMachineLookupRes,
      authNext
    );

    expect(ConfigMachineLookup.create).toHaveBeenCalled();
  });

  it('Update machine lookup data: Controller', async () => {
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

    const getConfigMachineLookupReq = {
      params: { machineId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineName: 'boxsizer_2',
        machineType: '66d953ca3b784a12ad11dea6',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        userId: '6593f61758ec983208c4ed05',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await configMachineLookupController.updateConfigMachineLookup(
      getConfigMachineLookupReq,
      getMachineRes,
      authNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });

  it('Error-404 if machine lookup is not exists for updateMachine Controller', async () => {
    ConfigMachineLookup.findById = jest.fn().mockImplementation(() => ({
      populate: () => null,
    }));

    const getConfigMachineLookupReq = {
      params: { machineId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineId: 'M0002',
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await configMachineLookupController.updateConfigMachineLookup(
      getConfigMachineLookupReq,
      getMachineRes,
      authNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });

  it('Error-500 machine lookup for updateMachine Controller', async () => {
    ConfigMachineLookup.findById = jest.fn().mockImplementation(() => ({
      populate: () => ({
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      }),
    }));
    const getConfigMachineLookupReq = {
      params: { machineId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineId: 'M0002',
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await configMachineLookupController.updateConfigMachineLookup(
      getConfigMachineLookupReq,
      getMachineRes,
      authNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });

  it('Delete machine lookup data: Controller', async () => {
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
    ConfigMachineGroup.findOne = jest.fn().mockImplementation(() => ({}));

    ConfigMachineLookup.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'ConfigMachineLookup lookup deleted successfuly',
    }));

    const getConfigMachineLookupReq = {
      params: { machineId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineId: 'M0002',
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await configMachineLookupController.deleteConfigMachineLookup(
      getConfigMachineLookupReq,
      getMachineRes,
      authNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });

  it('Error if machine lookup is not exists for deleteMachine Controller', async () => {
    ConfigMachineLookup.findById = jest.fn().mockImplementation(() => ({
      populate: () => null,
    }));

    ConfigMachineLookup.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'ConfigMachineLookup lookup deleted successfuly',
    }));

    const getConfigMachineLookupReq = {
      params: { machineId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineId: 'M0002',
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await configMachineLookupController.deleteConfigMachineLookup(
      getConfigMachineLookupReq,
      getMachineRes,
      authNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });
});

describe('ConfigMachineLookup deleteConfigMachineLookup', () => {
  it('should through error if machine group avaialable when delete machine lookup data: Controller', async () => {
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
    ConfigMachineGroup.findOne = jest.fn().mockImplementation(() => ({
      name: 'group2',
    }));

    ConfigMachineLookup.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'ConfigMachineLookup lookup deleted successfuly',
    }));

    const getConfigMachineLookupReq = {
      params: { machineId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineId: 'M0002',
        machineName: 'boxsizer_2',
        machineType: 'Cutter',
        description: 'This is box sizer machine _2',
        maxThroughPut: 40,
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-03-14T14:07:00.073Z',
        id: '65f3048459e320e0996e7a08',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await configMachineLookupController.deleteConfigMachineLookup(
      getConfigMachineLookupReq,
      getMachineRes,
      authNext
    );
    expect(ConfigMachineLookup.findById).toHaveBeenCalled();
  });
});
