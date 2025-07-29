const httpStatus = require('http-status');
const { userController } = require('../../../src/controllers');
const {
  getUsers,
  updateUser,
  createUser,
  getUserById,
} = require('../../../src/controllers/user.controller');

const User = require('../../../src/models/user.model');
const { userService } = require('../../../src/services');
const ApiError = require('../../../src/utils/ApiError');

describe('User Controller', () => {
  it('Get All users Data Where isActive Status is true  : Controller', async () => {
    User.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        populate: () => ({
          populate: () => ({
            limit: () => ({
              skip: () => ({
                sort: () => ({
                  exec: () => [
                    {
                      users: [
                        {
                          email: 'abc@gmail.com',
                          password: '123@abc',
                          roles: {
                            roleName: 'Administrator',
                            description: 'this is Super Admin role',
                            policies: [
                              {
                                policyName: 'Dashboard',
                                description: 'this is my policy',
                                isActive: true,
                                createdBy: '6593f61758ec983208c4ed05',
                                createdAt: '2024-03-13T12:24:10.339Z',
                                id: '65f19aea9ea77ede063737d2',
                              },
                            ],
                            isActive: true,
                            createdBy: '6593f61758ec983208c4ed05',
                            createdAt: '2024-03-13T12:26:23.224Z',
                            id: '65f19b6f9ea77ede063737d8',
                          },
                          policies: [
                            {
                              policyName: 'Machine & Status',
                              description: 'this is my policy',
                              isActive: true,
                              createdBy: '6593f61758ec983208c4ed05',
                              createdAt: '2024-03-13T12:24:33.756Z',
                              id: '65f19b019ea77ede063737d5',
                            },
                          ],
                          isActive: true,
                          isDeleted: false,
                        },
                      ],
                      rowsPerPage: 10,
                      totalPages: 1,
                      currentPage: 1,
                      totalRecords: 10,
                    },
                  ],
                }),
              }),
            }),
          }),
        }),
      }),
    }));

    User.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getUserReq = {
      body: {
        pagination: {
          page: '1',
          pageLimit: '13',
        },
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await userController.getUsers(getUserReq, getUserRes, authNext);
    expect(User.find).toHaveBeenCalled();
  });
  it('Get All users Data Where isActive Status is false  : Controller', async () => {
    User.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        populate: () => ({
          populate: () => ({
            limit: () => ({
              skip: () => ({
                sort: () => ({
                  exec: () => [
                    {
                      users: [
                        {
                          email: 'abc@gmail.com',
                          password: '123@abc',
                          roles: {
                            roleName: 'Administrator',
                            description: 'this is Super Admin role',
                            policies: [
                              {
                                policyName: 'Dashboard',
                                description: 'this is my policy',
                                isActive: true,
                                createdBy: '6593f61758ec983208c4ed05',
                                createdAt: '2024-03-13T12:24:10.339Z',
                                id: '65f19aea9ea77ede063737d2',
                              },
                            ],
                            isActive: true,
                            createdBy: '6593f61758ec983208c4ed05',
                            createdAt: '2024-03-13T12:26:23.224Z',
                            id: '65f19b6f9ea77ede063737d8',
                          },
                          policies: [
                            {
                              policyName: 'Machine & Status',
                              description: 'this is my policy',
                              isActive: true,
                              createdBy: '6593f61758ec983208c4ed05',
                              createdAt: '2024-03-13T12:24:33.756Z',
                              id: '65f19b019ea77ede063737d5',
                            },
                          ],
                          isActive: false,
                          isDeleted: false,
                        },
                      ],
                      rowsPerPage: 10,
                      totalPages: 1,
                      currentPage: 1,
                      totalRecords: 10,
                    },
                  ],
                }),
              }),
            }),
          }),
        }),
      }),
    }));

    User.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getUserReq = {
      body: {
        pagination: {
          page: '1',
          pageLimit: '13',
        },
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await userController.getUsers(getUserReq, getUserRes, authNext);
    expect(User.find).toHaveBeenCalled();
  });
  it('Get User Controller', async () => {
    User.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        populate: () => ({
          populate: () => ({
            limit: () => ({
              skip: () => ({
                sort: () => ({
                  exec: () => [
                    {
                      users: [
                        {
                          email: 'abc@gmail.com',
                          password: '123@abc',
                          roles: {
                            roleName: 'Administrator',
                            description: 'this is Super Admin role',
                            policies: [
                              {
                                policyName: 'Dashboard',
                                description: 'this is my policy',
                                isActive: true,
                                createdBy: '6593f61758ec983208c4ed05',
                                createdAt: '2024-03-13T12:24:10.339Z',
                                id: '65f19aea9ea77ede063737d2',
                              },
                            ],
                            isActive: true,
                            createdBy: '6593f61758ec983208c4ed05',
                            createdAt: '2024-03-13T12:26:23.224Z',
                            id: '65f19b6f9ea77ede063737d8',
                          },
                          policies: [
                            {
                              policyName: 'Machine & Status',
                              description: 'this is my policy',
                              isActive: true,
                              createdBy: '6593f61758ec983208c4ed05',
                              createdAt: '2024-03-13T12:24:33.756Z',
                              id: '65f19b019ea77ede063737d5',
                            },
                          ],
                          isActive: true,
                          isDeleted: false,
                        },
                      ],
                      rowsPerPage: 10,
                      totalPages: 1,
                      currentPage: 1,
                      totalRecords: 10,
                    },
                  ],
                }),
              }),
            }),
          }),
        }),
      }),
    }));

    User.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });
    const getUserReq = {
      body: {
        pagination: {
          page: '1',
          pageLimit: '13',
        },
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await userController.getUsers(getUserReq, getUserRes, authNext);
    expect(User.find).toHaveBeenCalled();
  });
  it('Update User Controller', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      email: 'test8@demo.com',
      isActive: false,
      updatedBy: '6593f61758ec983208c4ed05',
      id: '65f1a7a3e88230b410021652',
      save: () => ({
        updated: 1,
      }),
    }));

    User.isEmailTaken = jest.fn().mockResolvedValue(false);

    const updateUserReq = {
      params: {
        userId: '65f1a7a3e88230b410021652',
      },
      body: {
        email: 'test8@demo.com',
        password: 'test7@demo',
        roles: '65eea2fa8a751cdc9a0f88ab',
        isActive: true,
        userId: '657983b49d45ee6041c0df64',
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const updateUserRes = { status: mockStatus };
    const authNext = jest.fn();
    await userController.updateUser(updateUserReq, updateUserRes, authNext);

    expect(User.findById).toHaveBeenCalled();
  });

  it('Error if User Not found for Update User Controller', async () => {
    User.findById = jest.fn().mockImplementation(() => undefined);

    const getUserReq = {
      params: {
        userId: '123',
      },
      body: {
        email: 'test8@demo.com',
        password: 'test7@demo',
        roles: '65eea2fa8a751cdc9a0f88ab',
        isActive: true,
        userId: '1234',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await userController.updateUser(getUserReq, getUserRes, authNext);

    expect(User.findById).toHaveBeenCalled();
  });

  it('Error if Email already taken for Update User Controller', async () => {
    User.findById = jest.fn().mockResolvedValue({
      email: 'test7@demo.com',
    });

    User.isEmailTaken = jest.fn().mockResolvedValue(true);

    const getUserReq = {
      params: {
        userId: '123',
      },
      body: {
        email: 'test8@demo.com',
        password: 'test7@demo',
        roles: '65eea2fa8a751cdc9a0f88ab',
        isActive: true,
        userId: '1234',
      },
    };

    const getUserRes = {};
    const authNext = jest.fn();

    await userController.updateUser(getUserReq, getUserRes, authNext);
    expect(authNext).not.toHaveBeenCalled();
  });

  it('Delete User Controller', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      email: 'abc@gmail.com',
      password: '123@abc',
    }));

    User.findById = jest.fn().mockImplementation(() => ({
      deleted: 1,
    }));

    const getUserReq = {
      params: {
        userId: '123',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await userController.deleteUser(getUserReq, getUserRes, authNext);
    expect(User.findById).toHaveBeenCalled();
    expect(User.findById).toHaveBeenCalled();
  });

  it('Error if User Not found for Delete User Controller', async () => {
    User.findById = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.NOT_FOUND);
    });

    const getUserReq = {
      params: {
        userId: '123',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await userController.deleteUser(getUserReq, getUserRes, authNext);
    expect(User.findById).toHaveBeenCalled();
  });

  it('should retrieve user data and return a 200 status code with the data', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    userService.queryUsers = jest
      .fn()
      .mockResolvedValue({ statusCode: 200, users: [] });
    await getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
  });
  it('should handle and return a 500 status code with an error message when an error occurs during user update or delete', async () => {
    const req = { params: { userId: '123' }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const error = { statusCode: 500 };
    userService.updateUserById = jest.fn().mockRejectedValue(error);
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal Server Error',
    });
  });
  it('should handle some test case', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const error = { statusCode: 500 };

    userService.createUser = jest.fn().mockRejectedValue(error);
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal Server Error',
    });
  });
  /* eslint-disable*/
  it('should create user ', async () => {
    const req = {
      body: {
        email: 'test6@demo.com',
        password: 'test6@demo',
        roles: '65eea2fa8a751cdc9a0f88ab',
        policies: ['65ead149fa7c60ab710b63f5'],
        isActive: true,
        userId: '657983b49d45ee6041c0df64',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    userService.createUser = jest.fn().mockResolvedValue();
    await createUser(req, res);
    expect(userService.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
    expect(res.send).toHaveBeenCalledWith({
      status: 201,
      message: 'User created successfully',
    });
  });

  // Returns user data when valid user ID is provided
  it('should return user data when valid user ID is provided', async () => {
    const req = { params: { userId: 'validUserId' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const user = { id: 'validUserId', name: 'John Doe' };
    userService.getUserById = jest.fn().mockResolvedValue(user);
    await getUserById(req, res);
    expect(userService.getUserById).toHaveBeenCalledWith('validUserId');
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.send).toHaveBeenCalledWith(user);
  });
});
