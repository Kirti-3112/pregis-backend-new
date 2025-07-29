const httpStatus = require('http-status');
const { policyController } = require('../../../src/controllers');
const { Policy, Role } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');

describe('Policy Controller', () => {
  it('Get All policies Data Where isActive Status is true  : Controller', async () => {
    Policy.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  policiesData: [
                    {
                      policyName: 'jobs',
                      description: 'this is my policy',
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

    Policy.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });

    const getPolicyReq = {
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
    const getPolicyRes = {};
    const authNext = jest.fn();

    await policyController.getPolicies(getPolicyReq, getPolicyRes, authNext);
    expect(Policy.find).toHaveBeenCalled();
  });
  it('Get All policies Data Where isActive Status is false  : Controller', async () => {
    Policy.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  policiesData: [
                    {
                      policyName: 'jobs',
                      description: 'this is my policy',
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

    Policy.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });

    const getPolicyReq = {
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
    const getPolicyRes = {};
    const authNext = jest.fn();

    await policyController.getPolicies(getPolicyReq, getPolicyRes, authNext);
    expect(Policy.find).toHaveBeenCalled();
  });

  it('Get All policies Data : Controller', async () => {
    Policy.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        skip: () => ({
          limit: () => ({
            sort: () => ({
              exec: () => [
                {
                  policiesData: [
                    {
                      policyName: 'jobs',
                      description: 'this is my policy',
                      isActive: false,
                      id: '65d3206b830f222a6149f8f9',
                    },
                    {
                      policyName: 'machine and status',
                      description: 'this is my policy',
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

    Policy.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });
    const getPolicyReq = {
      body: {
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {},
      },
    };
    const getPolicyRes = {};
    const authNext = jest.fn();

    await policyController.getPolicies(getPolicyReq, getPolicyRes, authNext);
    expect(Policy.find).toHaveBeenCalled();
  });

  it('Get policy data by policyId: Controller', async () => {
    Policy.findById = jest.fn().mockImplementation(() => ({
      policyName: 'dashboard',
      description: ' policy updated just now',
      isActive: true,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65d320487e302296a2a3f605',
    }));

    const getPolicyReq = {
      params: {
        policyId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getPolicyRes = { status: mockStatus };
    const authNext = jest.fn();

    await policyController.getPolicyById(getPolicyReq, getPolicyRes, authNext);
    expect(Policy.findById).toHaveBeenCalled();
  });

  it('Create Policy Controller', async () => {
    Policy.create = jest.fn().mockImplementation(() => ({ inserted: 1 }));

    const createPolicyReq = {
      body: {
        policyName: 'Dashboard',
        description: 'this is my policy',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
    };
    const createPolicyRes = {};
    const authNext = jest.fn();
    await policyController.createPolicy(
      createPolicyReq,
      createPolicyRes,
      authNext
    );

    expect(Policy.create).toHaveBeenCalled();
  });

  it('Error if Policy alreay exist Create Policy Controller', async () => {
    Policy.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    const createPolicyReq = {
      body: {
        policyName: 'Dashboard',
        description: 'this is my policy',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
    };
    const createPolicyRes = {};
    const authNext = jest.fn();
    await policyController.createPolicy(
      createPolicyReq,
      createPolicyRes,
      authNext
    );

    expect(Policy.create).toHaveBeenCalled();
  });

  it('Error While executing Create Policy Controller', async () => {
    Policy.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const createPolicyReq = {
      body: {
        policyName: 'Dashboard',
        description: 'this is my policy',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
    };
    const createPolicyRes = {};
    const authNext = jest.fn();
    await policyController.createPolicy(
      createPolicyReq,
      createPolicyRes,
      authNext
    );

    expect(Policy.create).toHaveBeenCalled();
  });

  it('Update Policy Controller', async () => {
    Policy.findById = jest.fn().mockImplementation(() => ({
      policyName: 'dashboard',
      description: ' policy updated just now',
      isActive: false,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65d320487e302296a2a3f605',
      save: () => ({
        updated: 1,
      }),
    }));

    const updatePolicyReq = {
      body: {
        description: 'this is my policy',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
      params: {
        policyId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updatePolicyRes = { status: mockStatus };
    const authNext = jest.fn();
    await policyController.updatePolicy(
      updatePolicyReq,
      updatePolicyRes,
      authNext
    );

    expect(Policy.findById).toHaveBeenCalled();
  });

  it('Error-404 If Policy not found to Update Policy Controller', async () => {
    Policy.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.NOT_FOUND);
    });

    const updatePolicyReq = {
      body: {
        description: 'this is my policy',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
      params: {
        policyId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updatePolicyRes = { status: mockStatus };
    const authNext = jest.fn();
    await policyController.updatePolicy(
      updatePolicyReq,
      updatePolicyRes,
      authNext
    );

    expect(Policy.findById).toHaveBeenCalled();
  });

  it('Error-500 While Update Policy Controller', async () => {
    Policy.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const updatePolicyReq = {
      body: {
        description: 'this is my policy',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
      params: {
        policyId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updatePolicyRes = { status: mockStatus };
    const authNext = jest.fn();
    await policyController.updatePolicy(
      updatePolicyReq,
      updatePolicyRes,
      authNext
    );

    expect(Policy.findById).toHaveBeenCalled();
  });

  it('Error-403 While Update Policy Controller', async () => {
    Policy.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.FORBIDDEN);
    });

    const updatePolicyReq = {
      body: {
        description: 'this is my policy',
        isActive: true,
        userId: '6593f61758ec983208c4ed05',
      },
      params: {
        policyId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updatePolicyRes = { status: mockStatus };
    const authNext = jest.fn();
    await policyController.updatePolicy(
      updatePolicyReq,
      updatePolicyRes,
      authNext
    );

    expect(Policy.findById).toHaveBeenCalled();
  });

  it('Delete Policy Controller', async () => {
    Policy.findById = jest.fn().mockImplementation(() => ({
      policyName: 'dashboard',
      description: ' policy updated just now',
      isActive: false,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65d320487e302296a2a3f605',
      save: () => ({
        updated: 1,
      }),
    }));

    Role.find = jest.fn().mockImplementation(() => []);

    Policy.deleteOne = jest.fn().mockImplementation(() => ({
      deleted: 1,
    }));

    const deletePolicyReq = {
      params: {
        policyId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const deletePolicyRes = { status: mockStatus };
    const authNext = jest.fn();
    await policyController.deletePolicy(
      deletePolicyReq,
      deletePolicyRes,
      authNext
    );

    expect(Policy.findById).toHaveBeenCalled();
  });

  it('Error-403 While Delete Policy Controller', async () => {
    Policy.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.FORBIDDEN);
    });

    const deletPolicyReq = {
      params: {
        policyId: '65d320487e302296a2a3f605',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const deletePolicyRes = { status: mockStatus };
    const authNext = jest.fn();
    await policyController.deletePolicy(
      deletPolicyReq,
      deletePolicyRes,
      authNext
    );

    expect(Policy.findById).toHaveBeenCalled();
  });
});
