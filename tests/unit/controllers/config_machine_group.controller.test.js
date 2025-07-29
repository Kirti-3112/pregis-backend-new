const httpStatus = require('http-status');
const { configMachineGroupController } = require('../../../src/controllers');
const { ConfigMachineGroup } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');

describe('Config Machine Group Controller', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });
  it('Get All machine groups Data Where status === Active : Controller', async () => {
    ConfigMachineGroup.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  name: 'Group 1',
                  machines: [
                    {
                      machineId: 'M0004',
                      machineName: 'boxsizer_2',
                      machineType: 'Cutter',
                      maxThroughPut: 40,
                      status: 'Active',
                      createdBy: '6593f61758ec983208c4ed05',
                      createdAt: '2024-03-19T11:38:06.619Z',
                      id: '6601c467fb6023588b64d261',
                    },
                  ],
                  status: 'Active',
                  description: 'Group 1 description',
                  id: '660518944a8c5de4923aa61e',
                },
                {
                  name: 'Group 2',
                  machines: [
                    {
                      machineId: 'M0029',
                      machineName: 'machine6',
                      machineType: 'testing machine type',
                      maxThroughPut: 67,
                      status: 'Active',
                      createdBy: '6593f61758ec983208c4ed05',
                      createdAt: '2024-03-25T15:31:52.054Z',
                      description: 'Description',
                      updatedBy: '6593f61758ec983208c4ed05',
                      id: '6601c467fb6023588b64d27a',
                    },
                  ],
                  status: 'Active',
                  description: 'Group 2 description',
                  id: '660518f14a8c5de4923aa61f',
                },
                {
                  name: 'Group 3',
                  machines: [
                    {
                      machineId: 'M0029',
                      machineName: 'machine6',
                      machineType: 'testing machine type',
                      maxThroughPut: 67,
                      status: 'Active',
                      createdBy: '6593f61758ec983208c4ed05',
                      createdAt: '2024-03-25T15:31:52.054Z',
                      description: 'Description',
                      updatedBy: '6593f61758ec983208c4ed05',
                      id: '6601c467fb6023588b64d27a',
                    },
                  ],
                  status: 'InActive',
                  description: 'Group 3 description',
                  id: '660518f14a8c5de4923aa61f',
                },
              ],
            }),
          }),
        }),
      }),
    }));

    ConfigMachineGroup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });

    const getConfigMachineGroupReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {
          status: 'Active',
        },
      },
    };
    const authNext = jest.fn();

    await configMachineGroupController.getMachineGroups(
      getConfigMachineGroupReq,
      res,
      authNext
    );
    expect(ConfigMachineGroup.find).toHaveBeenCalled();
  });

  it('Get All machine groups Data Where status === InActive : Controller', async () => {
    ConfigMachineGroup.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  name: 'Group 1',
                  machines: [
                    {
                      machineId: 'M0004',
                      machineName: 'boxsizer_2',
                      machineType: 'Cutter',
                      maxThroughPut: 40,
                      status: 'Active',
                      createdBy: '6593f61758ec983208c4ed05',
                      createdAt: '2024-03-19T11:38:06.619Z',
                      id: '6601c467fb6023588b64d261',
                    },
                  ],
                  status: 'Active',
                  description: 'Group 1 description',
                  id: '660518944a8c5de4923aa61e',
                },
                {
                  name: 'Group 2',
                  machines: [
                    {
                      machineId: 'M0029',
                      machineName: 'machine6',
                      machineType: 'testing machine type',
                      maxThroughPut: 67,
                      status: 'Active',
                      createdBy: '6593f61758ec983208c4ed05',
                      createdAt: '2024-03-25T15:31:52.054Z',
                      description: 'Description',
                      updatedBy: '6593f61758ec983208c4ed05',
                      id: '6601c467fb6023588b64d27a',
                    },
                  ],
                  status: 'Active',
                  description: 'Group 2 description',
                  id: '660518f14a8c5de4923aa61f',
                },
                {
                  name: 'Group 3',
                  machines: [
                    {
                      machineId: 'M0029',
                      machineName: 'machine6',
                      machineType: 'testing machine type',
                      maxThroughPut: 67,
                      status: 'Active',
                      createdBy: '6593f61758ec983208c4ed05',
                      createdAt: '2024-03-25T15:31:52.054Z',
                      description: 'Description',
                      updatedBy: '6593f61758ec983208c4ed05',
                      id: '6601c467fb6023588b64d27a',
                    },
                  ],
                  status: 'InActive',
                  description: 'Group 3 description',
                  id: '660518f14a8c5de4923aa61f',
                },
              ],
            }),
          }),
        }),
      }),
    }));

    ConfigMachineGroup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getConfigMachineGroupReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {
          status: 'Inactive',
        },
      },
    };
    const authNext = jest.fn();

    await configMachineGroupController.getMachineGroups(
      getConfigMachineGroupReq,
      res,
      authNext
    );
    expect(ConfigMachineGroup.find).toHaveBeenCalled();
  });

  it('Get All machine groups Data: Controller', async () => {
    ConfigMachineGroup.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  machineGroupsData: [
                    {
                      name: 'Group 1',
                      machines: [
                        {
                          machineId: 'M0004',
                          machineName: 'boxsizer_2',
                          machineType: 'Cutter',
                          maxThroughPut: 40,
                          status: 'Active',
                          createdBy: '6593f61758ec983208c4ed05',
                          createdAt: '2024-03-19T11:38:06.619Z',
                          id: '6601c467fb6023588b64d261',
                        },
                      ],
                      status: 'Active',
                      description: 'Group 1 description',
                      id: '660518944a8c5de4923aa61e',
                    },
                    {
                      name: 'Group 2',
                      machines: [
                        {
                          machineId: 'M0029',
                          machineName: 'machine6',
                          machineType: 'testing machine type',
                          maxThroughPut: 67,
                          status: 'Active',
                          createdBy: '6593f61758ec983208c4ed05',
                          createdAt: '2024-03-25T15:31:52.054Z',
                          description: 'Description',
                          updatedBy: '6593f61758ec983208c4ed05',
                          id: '6601c467fb6023588b64d27a',
                        },
                      ],
                      status: 'Active',
                      description: 'Group 2 description',
                      id: '660518f14a8c5de4923aa61f',
                    },
                    {
                      name: 'Group 3',
                      machines: [
                        {
                          machineId: 'M0029',
                          machineName: 'machine6',
                          machineType: 'testing machine type',
                          maxThroughPut: 67,
                          status: 'Active',
                          createdBy: '6593f61758ec983208c4ed05',
                          createdAt: '2024-03-25T15:31:52.054Z',
                          description: 'Description',
                          updatedBy: '6593f61758ec983208c4ed05',
                          id: '6601c467fb6023588b64d27a',
                        },
                      ],
                      status: 'InActive',
                      description: 'Group 3 description',
                      id: '660518f14a8c5de4923aa61f',
                    },
                  ],
                  rowsPerPage: 1000,
                  totalPages: 1,
                  currentPage: 1,
                  totalRecords: 2,
                },
              ],
            }),
          }),
        }),
      }),
    }));

    ConfigMachineGroup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(3);
    });

    const getConfigMachineGroupReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {},
      },
    };
    const getConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.getMachineGroups(
      getConfigMachineGroupReq,
      getConfigMachineGroupRes,
      authNext
    );

    expect(ConfigMachineGroup.find).toHaveBeenCalled();
  });

  it('Error 500 - Get All machine groups Data: Controller', async () => {
    ConfigMachineGroup.find = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    ConfigMachineGroup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(3);
    });

    const getConfigMachineGroupReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {},
      },
    };
    const getConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.getMachineGroups(
      getConfigMachineGroupReq,
      getConfigMachineGroupRes,
      authNext
    );

    expect(ConfigMachineGroup.find).toHaveBeenCalled();
  });

  it('Create machine group Data Where status : Controller', async () => {
    ConfigMachineGroup.create = jest.fn().mockImplementation(() => ({
      message: 'machine group created successfully',
    }));

    const createConfigMachineGroupReq = {
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
      },
    };
    const createConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.createMachineGroup(
      createConfigMachineGroupReq,
      createConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.create).toHaveBeenCalled();
  });

  it('Error-409 Create machine group Already Exists : Controller', async () => {
    ConfigMachineGroup.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    const createConfigMachineGroupReq = {
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
      },
    };
    const createConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.createMachineGroup(
      createConfigMachineGroupReq,
      createConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.create).toHaveBeenCalled();
  });

  it('Error-500 Create machine group Internal Server Error : Controller', async () => {
    ConfigMachineGroup.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const createConfigMachineGroupReq = {
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
      },
    };
    const createConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.createMachineGroup(
      createConfigMachineGroupReq,
      createConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.create).toHaveBeenCalled();
  });

  it('Update machine group Data Where status : Controller', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => ({
      populate: () => ({
        name: 'Group 1',
        machines: [
          {
            machineId: 'M0004',
            machineName: 'boxsizer_2',
            machineType: 'Cutter',
            maxThroughPut: 40,
            status: 'Active',
            createdBy: '6593f61758ec983208c4ed05',
            createdAt: '2024-03-19T11:38:06.619Z',
            id: '6601c467fb6023588b64d261',
          },
        ],
        status: 'Active',
        description: 'Group 1 description',
        id: '660518944a8c5de4923aa61e',
      }),
    }));

    const updateConfigMachineGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const uodateConfigMachineGroupRes = { status: mockStatus };

    await configMachineGroupController.updateMachineGroup(
      updateConfigMachineGroupReq,
      uodateConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });

  it('Error-409 Update machine group Already Exists : Controller', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    const updateConfigMachineGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };
    const updateConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.updateMachineGroup(
      updateConfigMachineGroupReq,
      updateConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });
  it('Error-404 Update machine group Not Found : Controller', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.NOT_FOUND);
    });

    const updateConfigMachineGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };
    const updateConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.updateMachineGroup(
      updateConfigMachineGroupReq,
      updateConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });

  it('Error-500 Update machine group Internal Server Error : Controller', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const updateConfigMachineGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };
    const updateConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.updateMachineGroup(
      updateConfigMachineGroupReq,
      updateConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });

  it('Delete machine group Data Where status : Controller', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => ({
      populate: () => ({
        name: 'Group 1',
        machines: [
          {
            machineId: 'M0004',
            machineName: 'boxsizer_2',
            machineType: 'Cutter',
            maxThroughPut: 40,
            status: 'Active',
            createdBy: '6593f61758ec983208c4ed05',
            createdAt: '2024-03-19T11:38:06.619Z',
            id: '6601c467fb6023588b64d261',
          },
        ],
        status: 'Active',
        description: 'Group 1 description',
        id: '660518944a8c5de4923aa61e',
      }),
    }));

    ConfigMachineGroup.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'Machine Group deleted successfuly',
    }));

    const deleteConfigMachineGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group deleted successfully',
        })),
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const deleteConfigMachineGroupRes = { status: mockStatus };

    await configMachineGroupController.deleteMachineGroup(
      deleteConfigMachineGroupReq,
      deleteConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });

  it('Error-409 Delete machine group Already Exists : Controller', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    ConfigMachineGroup.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'Machine Group deleted successfuly',
    }));

    const deleteConfigMachineGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };
    const deleteConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.deleteMachineGroup(
      deleteConfigMachineGroupReq,
      deleteConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });
  it('Error-404 Delete machine group Not Found : Controller', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => ({
      populate: () => null,
    }));

    const updateConfigMachineGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };
    const updateConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.updateMachineGroup(
      updateConfigMachineGroupReq,
      updateConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });

  it('Error-500 Delete machine group Internal Server Error : Controller', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const updateConfigMachineGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'MG1',
        machines: ['660fba293d8cb2cb74b4705b'],
        userId: '660b85ae0346c06926a80be5',
        status: 'InActive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };
    const updateConfigMachineGroupRes = {};
    const authNext = jest.fn();

    await configMachineGroupController.updateMachineGroup(
      updateConfigMachineGroupReq,
      updateConfigMachineGroupRes,
      authNext
    );
    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });
});
describe('Get Machine Group By Id', () => {
  it('should return machine group data by id', async () => {
    const mockMachineGroup = {
      name: 'Test Group',
      machines: [],
      status: 'Active',
      description: 'Test Description',
      id: '12345',
    };

    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => ({
      populate: () => mockMachineGroup,
    }));

    const req = { params: { machineId: '12345' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await configMachineGroupController.getMachineGroupById(req, res);

    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });

  it('should handle not found error', async () => {
    ConfigMachineGroup.findById = jest.fn().mockImplementation(() => ({
      populate: () => null,
    }));

    const req = { params: { machineId: '12345' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const authNext = jest.fn();

    await configMachineGroupController.getMachineGroupById(req, res, authNext);

    expect(ConfigMachineGroup.findById).toHaveBeenCalled();
  });
});
