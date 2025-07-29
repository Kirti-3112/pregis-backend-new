const httpStatus = require('http-status');
const { configWorkGroupController } = require('../../../src/controllers');
const { ConfigWorkGroup } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');

describe('Config Work Group Controller', () => {
  it('Get All work groups Data Where status === Active : Controller', async () => {
    ConfigWorkGroup.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  workGroupsData: [
                    {
                      name: 'work group 3',
                      machineGroups: [
                        {
                          name: 'Group 2',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:21:07.037Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82a30fcb315ba42caa39',
                        },
                      ],
                      status: 'Inactive',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T10:47:59.640Z',
                      id: '6641efdf4e26801937618578',
                    },
                    {
                      name: 'work group 2',
                      machineGroups: [
                        {
                          name: 'Group 1',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:20:38.850Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82860fcb315ba42caa2e',
                        },
                      ],
                      status: 'Active',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T10:47:17.452Z',
                      id: '6641efb54e26801937618576',
                    },
                    {
                      name: 'work group 1',
                      machineGroups: [
                        {
                          name: 'Group 1',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:20:38.850Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82860fcb315ba42caa2e',
                        },
                        {
                          name: 'Group 2',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:21:07.037Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82a30fcb315ba42caa39',
                        },
                      ],
                      status: 'Active',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T09:54:03.152Z',
                      id: '6641e33b32d5742557ce3255',
                    },
                  ],
                  rowsPerPage: 1000,
                  totalPages: 1,
                  currentPage: 1,
                  totalRecords: 3,
                },
              ],
            }),
          }),
        }),
      }),
    }));

    ConfigWorkGroup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });

    const getConfigWorkGroupReq = {
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
    const getConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.getWorkGroups(
      getConfigWorkGroupReq,
      getConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.find).toHaveBeenCalled();
  });

  it('Get All work groups Data Where status === Inactive : Controller', async () => {
    ConfigWorkGroup.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  workGroupsData: [
                    {
                      name: 'work group 3',
                      machineGroups: [
                        {
                          name: 'Group 2',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:21:07.037Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82a30fcb315ba42caa39',
                        },
                      ],
                      status: 'Inactive',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T10:47:59.640Z',
                      id: '6641efdf4e26801937618578',
                    },
                    {
                      name: 'work group 2',
                      machineGroups: [
                        {
                          name: 'Group 1',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:20:38.850Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82860fcb315ba42caa2e',
                        },
                      ],
                      status: 'Active',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T10:47:17.452Z',
                      id: '6641efb54e26801937618576',
                    },
                    {
                      name: 'work group 1',
                      machineGroups: [
                        {
                          name: 'Group 1',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:20:38.850Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82860fcb315ba42caa2e',
                        },
                        {
                          name: 'Group 2',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:21:07.037Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82a30fcb315ba42caa39',
                        },
                      ],
                      status: 'Active',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T09:54:03.152Z',
                      id: '6641e33b32d5742557ce3255',
                    },
                  ],
                  rowsPerPage: 1000,
                  totalPages: 1,
                  currentPage: 1,
                  totalRecords: 3,
                },
              ],
            }),
          }),
        }),
      }),
    }));

    ConfigWorkGroup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getConfigWorkGroupReq = {
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
    const getConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.getWorkGroups(
      getConfigWorkGroupReq,
      getConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.find).toHaveBeenCalled();
  });

  it('Get All work groups Data: Controller', async () => {
    ConfigWorkGroup.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  workGroupsData: [
                    {
                      name: 'work group 3',
                      machineGroups: [
                        {
                          name: 'Group 2',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:21:07.037Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82a30fcb315ba42caa39',
                        },
                      ],
                      status: 'Inactive',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T10:47:59.640Z',
                      id: '6641efdf4e26801937618578',
                    },
                    {
                      name: 'work group 2',
                      machineGroups: [
                        {
                          name: 'Group 1',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:20:38.850Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82860fcb315ba42caa2e',
                        },
                      ],
                      status: 'Active',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T10:47:17.452Z',
                      id: '6641efb54e26801937618576',
                    },
                    {
                      name: 'work group 1',
                      machineGroups: [
                        {
                          name: 'Group 1',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:20:38.850Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82860fcb315ba42caa2e',
                        },
                        {
                          name: 'Group 2',
                          description: '',
                          machines: [
                            '662b4d7f731e812862f7ad68',
                            '662b3ac020d35e565451949a',
                            '662b3ad120d35e56545194a8',
                            '662b3ae120d35e56545194b6',
                            '662b3afa20d35e56545194c4',
                          ],
                          status: 'Active',
                          createdBy: '660b85ae0346c06926a80be5',
                          createdAt: '2024-04-29T11:21:07.037Z',
                          updatedBy: '660b85ae0346c06926a80be5',
                          id: '662f82a30fcb315ba42caa39',
                        },
                      ],
                      status: 'Active',
                      createdBy: '660b85ae0346c06926a80be5',
                      createdAt: '2024-05-13T09:54:03.152Z',
                      id: '6641e33b32d5742557ce3255',
                    },
                  ],
                  rowsPerPage: 1000,
                  totalPages: 1,
                  currentPage: 1,
                  totalRecords: 3,
                },
              ],
            }),
          }),
        }),
      }),
    }));

    ConfigWorkGroup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(3);
    });

    const getConfigWorkGroupReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {},
      },
    };
    const getConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.getWorkGroups(
      getConfigWorkGroupReq,
      getConfigWorkGroupRes,
      authNext
    );

    expect(ConfigWorkGroup.find).toHaveBeenCalled();
  });

  it('Error 500 - Get All work groups Data: Controller', async () => {
    ConfigWorkGroup.find = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    ConfigWorkGroup.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(3);
    });

    const getConfigWorkGroupReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {},
      },
    };
    const getConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.getWorkGroups(
      getConfigWorkGroupReq,
      getConfigWorkGroupRes,
      authNext
    );

    expect(ConfigWorkGroup.find).toHaveBeenCalled();
  });

  it('Create work group Data Where status : Controller', async () => {
    ConfigWorkGroup.create = jest.fn().mockImplementation(() => ({
      message: 'work group created successfully',
    }));

    const createConfigWorkGroupReq = {
      body: {
        name: 'Work Group 3',
        machineGroups: ['662f82a30fcb315ba42caa39'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
      },
    };
    const createConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.createWorkGroup(
      createConfigWorkGroupReq,
      createConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.create).toHaveBeenCalled();
  });

  it('Error-409 Create work group Already Exists : Controller', async () => {
    ConfigWorkGroup.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    const createConfigWorkGroupReq = {
      body: {
        name: 'Work Group 3',
        machineGroups: ['662f82a30fcb315ba42caa39'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
      },
    };
    const createConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.createWorkGroup(
      createConfigWorkGroupReq,
      createConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.create).toHaveBeenCalled();
  });

  it('Error-500 Create work group Internal Server Error : Controller', async () => {
    ConfigWorkGroup.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const createConfigWorkGroupReq = {
      body: {
        name: 'Work Group 3',
        machineGroups: ['662f82a30fcb315ba42caa39'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
      },
    };
    const createConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.createWorkGroup(
      createConfigWorkGroupReq,
      createConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.create).toHaveBeenCalled();
  });

  it('Update work group Data Where status : Controller', async () => {
    ConfigWorkGroup.findById = jest.fn().mockImplementation(() => ({
      name: 'work group 3',
      machineGroups: [
        {
          name: 'Group 2',
          description: '',
          machines: [
            '662b4d7f731e812862f7ad68',
            '662b3ac020d35e565451949a',
            '662b3ad120d35e56545194a8',
            '662b3ae120d35e56545194b6',
            '662b3afa20d35e56545194c4',
          ],
          status: 'Active',
          createdBy: '660b85ae0346c06926a80be5',
          createdAt: '2024-04-29T11:21:07.037Z',
          updatedBy: '660b85ae0346c06926a80be5',
          id: '662f82a30fcb315ba42caa39',
        },
      ],
      status: 'Inactive',
      createdBy: '660b85ae0346c06926a80be5',
      createdAt: '2024-05-13T10:47:59.640Z',
      id: '6641efdf4e26801937618578',
    }));

    const updateConfigWorkGroupReq = {
      params: { workGroupId: '6641efdf4e26801937618578' },
      body: {
        name: 'work group _1',
        machineGroups: ['662f82860fcb315ba42caa2e'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
        save: jest.fn().mockImplementation(() => ({
          message: 'work group updated successfully',
        })),
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const uodateConfigWorkGroupRes = { status: mockStatus };

    await configWorkGroupController.updateWorkGroup(
      updateConfigWorkGroupReq,
      uodateConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.findById).toHaveBeenCalled();
  });

  it('Error-409 Update work group Already Exists : Controller', async () => {
    ConfigWorkGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    const updateConfigWorkGroupReq = {
      params: { machineGroupId: '6641e5f39fae98f61b6d9308' },
      body: {
        name: 'work group _1',
        machineGroups: ['662f82860fcb315ba42caa2e'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
        save: jest.fn().mockImplementation(() => ({
          message: 'work group updated successfully',
        })),
      },
    };
    const updateConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.updateWorkGroup(
      updateConfigWorkGroupReq,
      updateConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.findById).toHaveBeenCalled();
  });
  it('Error-404 Update work group Not Found : Controller', async () => {
    ConfigWorkGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.NOT_FOUND);
    });

    const updateConfigWorkGroupReq = {
      params: { workGroupId: '6641e5f39fae98f61b6d9308' },
      body: {
        name: 'work group _1',
        machineGroups: ['662f82860fcb315ba42caa2e'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };
    const updateConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.updateWorkGroup(
      updateConfigWorkGroupReq,
      updateConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.findById).toHaveBeenCalled();
  });

  it('Error-500 Update work group Internal Server Error : Controller', async () => {
    ConfigWorkGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const updateConfigWorkGroupReq = {
      params: { workGroupId: '6641e5f39fae98f61b6d9308' },
      body: {
        name: 'work group _1',
        machineGroups: ['662f82860fcb315ba42caa2e'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group updated successfully',
        })),
      },
    };
    const updateConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.updateWorkGroup(
      updateConfigWorkGroupReq,
      updateConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.findById).toHaveBeenCalled();
  });

  it('Delete work group Data Where status : Controller', async () => {
    ConfigWorkGroup.findById = jest.fn().mockImplementation(() => ({
      name: 'work group 3',
      machineGroups: [
        {
          name: 'Group 2',
          description: '',
          machines: [
            '662b4d7f731e812862f7ad68',
            '662b3ac020d35e565451949a',
            '662b3ad120d35e56545194a8',
            '662b3ae120d35e56545194b6',
            '662b3afa20d35e56545194c4',
          ],
          status: 'Active',
          createdBy: '660b85ae0346c06926a80be5',
          createdAt: '2024-04-29T11:21:07.037Z',
          updatedBy: '660b85ae0346c06926a80be5',
          id: '662f82a30fcb315ba42caa39',
        },
      ],
      status: 'Inactive',
      createdBy: '660b85ae0346c06926a80be5',
      createdAt: '2024-05-13T10:47:59.640Z',
      id: '6641efdf4e26801937618578',
    }));

    ConfigWorkGroup.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'Work Group deleted successfuly',
    }));

    const deleteConfigWorkGroupReq = {
      params: { workGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'work group _1',
        machineGroups: ['662f82860fcb315ba42caa2e'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
        save: jest.fn().mockImplementation(() => ({
          message: 'machine group deleted successfully',
        })),
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const deleteConfigWorkGroupRes = { status: mockStatus };

    await configWorkGroupController.deleteWorkGroup(
      deleteConfigWorkGroupReq,
      deleteConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.findById).toHaveBeenCalled();
  });
  it('Error-409 Delete work group Already Exists : Controller', async () => {
    ConfigWorkGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    ConfigWorkGroup.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'Work Group deleted successfuly',
    }));

    const deleteConfigWorkGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'work group _1',
        machineGroups: ['662f82860fcb315ba42caa2e'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
        save: jest.fn().mockImplementation(() => ({
          message: 'work group updated successfully',
        })),
      },
    };
    const deleteConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.deleteWorkGroup(
      deleteConfigWorkGroupReq,
      deleteConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.findById).toHaveBeenCalled();
  });
  it('Error-404 Delete work group Not Found : Controller', async () => {
    ConfigWorkGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.NOT_FOUND);
    });

    const deleteConfigWorkGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'work group _1',
        machineGroups: ['662f82860fcb315ba42caa2e'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
        save: jest.fn().mockImplementation(() => ({
          message: 'work group updated successfully',
        })),
      },
    };
    const deleteConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.deleteWorkGroup(
      deleteConfigWorkGroupReq,
      deleteConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.findById).toHaveBeenCalled();
  });
  it('Error-500 Delete work group Internal Server Error : Controller', async () => {
    ConfigWorkGroup.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const deleteConfigWorkGroupReq = {
      params: { machineGroupId: '661b7ba2dd877d139bb6380d' },
      body: {
        name: 'work group _1',
        machineGroups: ['662f82860fcb315ba42caa2e'],
        userId: '660b85ae0346c06926a80be5',
        status: 'Inactive',
        save: jest.fn().mockImplementation(() => ({
          message: 'work group updated successfully',
        })),
      },
    };
    const deleteConfigWorkGroupRes = {};
    const authNext = jest.fn();

    await configWorkGroupController.deleteWorkGroup(
      deleteConfigWorkGroupReq,
      deleteConfigWorkGroupRes,
      authNext
    );
    expect(ConfigWorkGroup.findById).toHaveBeenCalled();
  });
});
