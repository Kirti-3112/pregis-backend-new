const httpStatus = require('http-status');
const { roleController } = require('../../../src/controllers');
const { Role, User } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');

describe('Role Controller', () => {
  it('Get All roles Data Where isActive Status is true  : Controller', async () => {
    Role.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  roleDataData: [
                    {
                      roleName: 'Admin',
                      description: 'this is my role',
                      isActive: true,
                      id: '65d3206b830f222a6149f8f9',
                    },
                  ],
                  rowsPerPage: 10,
                  totalPages: 1,
                  currentPage: 1,
                  totalRecords: 1,
                },
              ],
            }),
          }),
        }),
      }),
    }));

    Role.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });

    const getRoleReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {
          isActive: true,
        },
      },
    };
    const getRoleRes = {};
    const authNext = jest.fn();

    await roleController.getRoles(getRoleReq, getRoleRes, authNext);
    expect(Role.find).toHaveBeenCalled();
  });
  it('Get All roles Data Where isActive Status is false  : Controller', async () => {
    Role.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  roleData: [
                    {
                      roleName: 'Admin',
                      description: 'this is my role',
                      isActive: false,
                      id: '65d3206b830f222a6149f8f9',
                    },
                  ],
                  rowsPerPage: 10,
                  totalPages: 1,
                  currentPage: 1,
                  totalRecords: 1,
                },
              ],
            }),
          }),
        }),
      }),
    }));

    Role.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });

    const getRoleReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {
          isActive: false,
        },
      },
    };
    const getRoleRes = {};
    const authNext = jest.fn();

    await roleController.getRoles(getRoleReq, getRoleRes, authNext);
    expect(Role.find).toHaveBeenCalled();
  });

  it('Get All roles Data : Controller', async () => {
    Role.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  roleData: [
                    {
                      roleName: 'Admin',
                      description: 'this is my role',
                      isActive: false,
                      id: '65d3206b830f222a6149f8f9',
                    },
                    {
                      roleName: 'Operator',
                      description: 'this is my role',
                      isActive: false,
                      id: '65d3206b830f222a6149f810',
                    },
                  ],
                  rowsPerPage: 10,
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

    Role.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });
    const getRoleReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {},
      },
    };
    const getRoleRes = {};
    const authNext = jest.fn();

    await roleController.getRoles(getRoleReq, getRoleRes, authNext);
    expect(Role.find).toHaveBeenCalled();
  });

  it('Get role data by policyId: Controller', async () => {
    Role.findById = jest.fn().mockImplementation(() => ({
      roleName: 'Admin',
      description: ' role updated just now',
      isActive: true,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65d320487e302296a2a3f605',
    }));

    const getRoleReq = {
      params: {
        roleId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getRoleRes = { status: mockStatus };
    const authNext = jest.fn();

    await roleController.getRoleById(getRoleReq, getRoleRes, authNext);
    expect(Role.findById).toHaveBeenCalled();
  });

  it('Create Role Controller', async () => {
    Role.create = jest.fn().mockImplementation(() => ({ inserted: 1 }));

    const createRoleReq = {
      body: {
        roleName: 'Admin',
        description: 'this is my role',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
    };
    const createRoleRes = {};
    const authNext = jest.fn();
    await roleController.createRole(createRoleReq, createRoleRes, authNext);

    expect(Role.create).toHaveBeenCalled();
  });

  it('Error if Role alreay exist Create Role Controller', async () => {
    Role.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    const createRoleReq = {
      body: {
        roleName: 'Admin',
        description: 'this is my role',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
    };
    const createRoleRes = {};
    const authNext = jest.fn();
    await roleController.createRole(createRoleReq, createRoleRes, authNext);

    expect(Role.create).toHaveBeenCalled();
  });

  it('Error While executing Create Role Controller', async () => {
    Role.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const createRoleReq = {
      body: {
        roleName: 'Admin',
        description: 'this is my role',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
    };
    const createRoleRes = {};
    const authNext = jest.fn();
    await roleController.createRole(createRoleReq, createRoleRes, authNext);

    expect(Role.create).toHaveBeenCalled();
  });

  it('Update Role Controller', async () => {
    Role.findById = jest.fn().mockImplementation(() => ({
      roleName: 'Admin',
      description: ' role updated just now',
      isActive: false,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65d320487e302296a2a3f605',
      populate: () => [
        {
          policyName: 'jobs',
          description: 'this is my policy',
          isActive: true,
          id: '65d3206b830f222a6149f8f9',
        },
      ],
      save: () => ({
        updated: 1,
      }),
    }));

    const updateRoleReq = {
      body: {
        description: 'this is my role',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
      params: {
        roleId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updateRoleRes = { status: mockStatus };
    const authNext = jest.fn();
    await roleController.updateRole(updateRoleReq, updateRoleRes, authNext);

    expect(Role.findById).toHaveBeenCalled();
  });

  it('Error-404 If Role not found to Update Role Controller', async () => {
    Role.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.NOT_FOUND);
    });

    const updateRoleReq = {
      body: {
        description: 'this is my role',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
      params: {
        roleId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updateRoleRes = { status: mockStatus };
    const authNext = jest.fn();
    await roleController.updateRole(updateRoleReq, updateRoleRes, authNext);

    expect(Role.findById).toHaveBeenCalled();
  });

  it('Error-500 While Update Role Controller', async () => {
    Role.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const updateRoleReq = {
      body: {
        description: 'this is my role',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
      params: {
        roleId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updateRoleRes = { status: mockStatus };
    const authNext = jest.fn();
    await roleController.updateRole(updateRoleReq, updateRoleRes, authNext);

    expect(Role.findById).toHaveBeenCalled();
  });

  it('Error-403 While Update Policy Controller', async () => {
    Role.findById = jest.fn().mockImplementation(() => ({
      roleName: 'Admin',
      description: ' role updated just now',
      isActive: true,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65d320487e302296a2a3f605',
      populate: () => ({
        policyName: 'jobs',
        description: 'this is my policy',
        isActive: true,
        id: '65d3206b830f222a6149f8f9',
      }),

      save: () => ({
        updated: 1,
      }),
    }));

    Role.find = jest.fn().mockImplementation(() => {
      return [
        {
          roleName: 'Admin',
          description: ' role updated just now',
          isActive: true,
          updatedBy: '6593f61758ec983208c4ed05',
          id: '65d320487e302296a2a3f605',
        },
      ];
    });

    const updateRoleReq = {
      body: {
        description: 'this is my policy',
        isActive: false,
        userId: '6593f61758ec983208c4ed05',
      },
      params: {
        roleId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updateRoleRes = { status: mockStatus };
    const authNext = jest.fn();
    await roleController.updateRole(updateRoleReq, updateRoleRes, authNext);

    expect(Role.findById).toHaveBeenCalled();
  });

  it('Delete Role Controller', async () => {
    Role.findById = jest.fn().mockImplementation(() => ({
      roleName: 'Admin',
      description: ' role updated just now',
      isActive: false,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65d320487e302296a2a3f605',
      populate: () => ({
        policyName: 'jobs',
        description: 'this is my policy',
        isActive: true,
        id: '65d3206b830f222a6149f8f9',
      }),

      save: () => ({
        updated: 1,
      }),
    }));

    User.find = jest.fn().mockImplementation(() => []);

    Role.deleteOne = jest.fn().mockImplementation(() => ({
      deleted: 1,
    }));

    const deleteRoleReq = {
      params: {
        roleId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const deleteRoleRes = { status: mockStatus };
    const authNext = jest.fn();
    await roleController.deleteRole(deleteRoleReq, deleteRoleRes, authNext);

    expect(Role.findById).toHaveBeenCalled();
  });

  it('Error-403 While Delete Role Controller', async () => {
    Role.findById = jest.fn().mockImplementation(() => ({
      roleName: 'Admin',
      description: ' role updated just now',
      isActive: false,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65d320487e302296a2a3f605',
      populate: () => ({
        policyName: 'jobs',
        description: 'this is my policy',
        isActive: true,
        id: '65d3206b830f222a6149f8f9',
      }),

      save: () => ({
        updated: 1,
      }),
    }));

    User.find = jest.fn().mockImplementation(() => ['123']);

    const deletRoleReq = {
      params: {
        roleId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const deleteRoleRes = { status: mockStatus };
    const authNext = jest.fn();
    await roleController.deleteRole(deletRoleReq, deleteRoleRes, authNext);

    expect(Role.findById).toHaveBeenCalled();
  });
  it('Error-404 While Delete Role Controller', async () => {
    Role.findById = jest.fn().mockImplementation(() => {});

    const deletRoleReq = {
      params: {
        roleId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const deleteRoleRes = { status: mockStatus };
    const authNext = jest.fn();
    await roleController.deleteRole(deletRoleReq, deleteRoleRes, authNext);

    expect(Role.findById).toHaveBeenCalled();
  });
});
