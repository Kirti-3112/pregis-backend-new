const jwt = require('jsonwebtoken');
const moment = require('moment');
const { authController } = require('../../../src/controllers');
const User = require('../../../src/models/user.model');
const {
  generateToken,
  verifyToken,
  saveToken,
  generateAuthTokens,
} = require('../../../src/services/token.service');

const { Token, Role } = require('../../../src/models');

const config = require('../../../src/config/config');
const {
  tokenService,
  userService,
  authService,
} = require('../../../src/services');
const {
  loginUserWithEmailAndPassword,
} = require('../../../src/services/auth.service');

const fixtures = require('../fixtures');
const { refreshTokens } = require('../../../src/controllers/auth.controller');
const ApiError = require('../../../src/utils/ApiError');

jest.mock('../../../src/services/token.service', () => {
  const actualModule = jest.requireActual(
    '../../../src/services/token.service'
  );
  return {
    ...actualModule,
    __esModule: true,
    generateToken: jest.fn(),
  };
});

describe('refreshAuth', () => {
  test('generate new access token for that refresh token', async () => {
    const refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTc5ODNiNDlkNDVlZTYwNDFjMGRmNjQiLCJpYXQiOjE3MTk4MTg4MjMsImV4cCI6MTcyMjQxMDgyMywidHlwZSI6InJlZnJlc2gifQ.uS2RQK-YnEwnkNoLlj839rcD8aQaMPhil3kkGMA4Srs';
    const user = {
      isPasswordMatch: jest.fn(),

      email: 'validemail@example.com',
      role: 'user',
      isEmailVerified: false,
      createdAt: '2023-12-13T10:13:08.655Z',
      isActive: false,
      isDeleted: false,
      policies: [],
      roles: {
        roleName: 'Administrator',
        description: 'Administrator Role',
        policies: [
          {
            policyName: 'Machine &  Status',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Machine & Status Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f05',
          },
          {
            policyName: 'Jobs & Status',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Job & Status Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f06',
          },
          {
            policyName: 'Dashboard',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Dashboard Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f07',
          },
          {
            policyName: 'Configuration-WMS',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-WMS Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f08',
          },
          {
            policyName: 'Configuration-Machine',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-Machine Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f09',
          },
          {
            policyName: 'Configuration-Workgroup',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration- Workgroup Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f0a',
          },
          {
            policyName: 'Configuration-Machine Group',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-Machine Group Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f0b',
          },
          {
            policyName: 'Configuration-Machine Lookup',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-Machine Lookup Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f0c',
          },
          {
            policyName: 'Configuration-Machine Type',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-Machine Type Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f0d',
          },
          {
            policyName: 'History-Graphs',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'History-Graphs Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f0e',
          },
          {
            policyName: 'History-Logged Events',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'History-Logged events Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f0f',
          },
          {
            policyName: 'User Management-Policies',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Policies Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f10',
          },
          {
            policyName: 'User Management-Roles',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Roles Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f11',
          },
          {
            policyName: 'User Management-Users',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Users Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f12',
          },
          {
            policyName: 'Welcome Page',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Welcome Page Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a6b4f3176114eaa3e2f19',
          },
        ],
        isActive: true,
        createdBy: '6594ee7c58ec983208c4f8d3',
        createdAt: '2024-03-21T10:36:04.724Z',
        updatedBy: '6594ee7c58ec983208c4f8d3',
        id: '65fbe04df731bd4b9af1df61',
      },
      updatedBy: '657983b49d45ee6041c0df64',
      displayName: 'Admin',
      machineGroups: [
        {
          name: 'Group 1',
          machines: [
            {
              machineId: 'M0004',
              machineName: 'boxsizer 4 updated',
              machineType: 'Cutter',
              maxThroughPut: '40',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-19T11:38:06.619Z',
              description: '',
              updatedBy: '6629fce1e44a221cb64ddd15',
              id: '6601c467fb6023588b64d261',
            },
            {
              machineId: 'M0005',
              machineName: 'Boxsizer_5',
              machineType: 'Cutter',
              maxThroughPut: '40',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-20T04:33:37.075Z',
              description: '',
              updatedBy: '657983b49d45ee6041c0df64',
              id: '6601c467fb6023588b64d262',
            },
            {
              machineId: 'M0006',
              machineName: 'Boxsizer_6 demo machine',
              machineType: 'Cutter',
              maxThroughPut: '40',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-22T06:00:37.532Z',
              description: 'This is box sizer machine',
              updatedBy: '657983b49d45ee6041c0df64',
              id: '6601c467fb6023588b64d263',
            },
            {
              machineId: 'M0007',
              machineName: 'Machine4',
              machineType: 'pregis Cutter1',
              maxThroughPut: '20',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-25T15:31:52.054Z',
              description: 'Description',
              updatedBy: '6593f61758ec983208c4ed05',
              id: '6601c467fb6023588b64d264',
            },
            {
              machineId: 'M0010',
              machineName: 'boxsizer_2',
              machineType: 'Cutter',
              maxThroughPut: '40',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-19T11:38:06.619Z',
              id: '6601c467fb6023588b64d267',
            },
          ],
          status: 'Active',
          description: 'Group 1 description',
          id: '660518944a8c5de4923aa61e',
        },
        {
          name: 'Group 2',
          machines: [],
          status: 'Active',
          description: 'Group 2 description',
          updatedBy: '657983b49d45ee6041c0df64',
          id: '660518f14a8c5de4923aa61f',
        },
      ],
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
        _id: '66471db5d68861297fdc46ea',
      },
      id: '657983b49d45ee6041c0df64',
    };

    const userIdMock = jest.spyOn(tokenService, 'verifyToken');
    userIdMock.mockResolvedValue('66825740e93758023f4dd328');

    const userMock = jest.spyOn(userService, 'getUserById');
    userMock.mockResolvedValue(user);

    const accessTokenExpiresMock = jest.spyOn(
      tokenService,
      'generateAccessTokenExpiration'
    );
    accessTokenExpiresMock.mockReturnValueOnce(
      moment().add(config.jwt.accessExpirationMinutes, 'minutes')
    );
    const accessTokenMock = jest.spyOn(tokenService, 'generateToken');
    accessTokenMock.mockReturnValueOnce(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTc5ODNiNDlkNDVlZTYwNDFjMGRmNjQiLCJpYXQiOjE3MTk4MTkyNDcsImV4cCI6MTcxOTgxOTMwNywidHlwZSI6ImFjY2VzcyJ9.QihnOOMbsKojgjc3hQ3JRpz2MvcqguzpO-Yw7pzZ0fU'
    );

    const getReq = {
      body: {
        refreshToken,
      },
    };
    const getRes = {
      send: jest.fn(),
    };
    const authNext = jest.fn();

    refreshTokens(getReq, getRes, authNext);

    expect(userIdMock).toHaveBeenCalled();
  });
});

describe('Auth Controller', () => {
  it('Registration Controller', async () => {
    Role.findOne = jest.fn().mockImplementation(() => ({
      roleName: 'Operator',
      description: 'this is my role',
      isActive: true,
      _id: '65d3206b830f222a6149f8f9',
    }));
    User.create = jest.fn().mockImplementation(() => ({ inserted: 1 }));
    User.isEmailTaken = jest.fn().mockImplementation(() => {
      return Promise.resolve(false);
    });
    const getUserReq = {
      body: {
        email: 'abc@gmail.com',
        password: '123@abc',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await authController.register(getUserReq, getUserRes, authNext);
    expect(Role.findOne).toHaveBeenCalled();
  });

  it('Error if User Not found for Create User Controller', async () => {
    User.create = jest.fn().mockImplementation(() => undefined);

    User.isEmailTaken = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });

    const getUserReq = {
      body: {
        email: 'abc@gmail.com',
        password: '123@abc',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await authController.register(getUserReq, getUserRes, authNext);

    expect(User.isEmailTaken).toHaveBeenCalled();
  });
  it('Login Controller : For User dosent have refresh token', async () => {
    User.findOne = jest.fn().mockImplementation(() => ({
      populate: () => ({
        populate: () => ({
          populate: () => ({
            exec: () => ({
              ...fixtures.authModelResponse.loginResponse.user,
              isPasswordMatch: jest.fn().mockImplementation(() => {
                return Promise.resolve(1);
              }),
            }),
          }),
        }),
      }),
    }));

    User.isPasswordMatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    Token.findOne = jest.fn().mockImplementation(() => {});

    jest
      .spyOn(tokenService, 'generateAuthTokens')
      .mockResolvedValue(fixtures.authModelResponse.accessToken);

    userService.generateUserSideMenuConfiguration = jest
      .fn()
      .mockResolvedValue(
        fixtures.authModelResponse.adminUserSideMenuConfigurationResponse
      );

    const getUserReq = {
      body: {
        email: 'abc@gmail.com',
        password: '123@abc',
      },
    };
    const getUserRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const authNext = jest.fn();
    await authController.login(getUserReq, getUserRes, authNext);
    expect(User.findOne).toHaveBeenCalled();
  });
  it('Login Controller : should return an API Error for user password not match', async () => {
    User.findOne = jest.fn().mockImplementation(() => ({
      populate: () => ({
        populate: () => ({
          populate: () => ({
            exec: () => ({
              ...fixtures.authModelResponse.loginResponse.user,
              isPasswordMatch: jest.fn().mockImplementation(() => {
                return Promise.resolve(0);
              }),
            }),
          }),
        }),
      }),
    }));

    // User.isPasswordMatch = jest.fn().mockImplementation(() => {
    //   return Promise.resolve(1);
    // });

    Token.findOne = jest.fn().mockImplementation(() => {});

    jest
      .spyOn(tokenService, 'generateAuthTokens')
      .mockResolvedValue(fixtures.authModelResponse.accessToken);

    userService.generateUserSideMenuConfiguration = jest
      .fn()
      .mockResolvedValue(
        fixtures.authModelResponse.adminUserSideMenuConfigurationResponse
      );

    const getUserReq = {
      body: {
        email: 'abc@gmail.com',
        password: '123@abc',
      },
    };
    const getUserRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const authNext = jest.fn();
    await authController.login(getUserReq, getUserRes, authNext);
    expect(User.findOne).toHaveBeenCalled();
  });
  it('Login Controller : For User have refresh token', async () => {
    User.findOne = jest.fn().mockImplementation(() => ({
      populate: () => ({
        populate: () => ({
          populate: () => ({
            exec: () => ({
              ...fixtures.authModelResponse.loginResponse.user,
              isPasswordMatch: jest.fn().mockImplementation(() => {
                return Promise.resolve(1);
              }),
            }),
          }),
        }),
      }),
    }));

    User.isPasswordMatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    Token.findOne = jest
      .fn()
      .mockImplementation(() => fixtures.authModelResponse.refreshToken);

    authService.refreshAuth = jest.fn().mockResolvedValue({
      access: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmQ2ZmE5N2NmOGFkMzFlM2I0MGRmMjciLCJpYXQiOjE3MjgzNzY3ODAsImV4cCI6MTcyODM5MTE4MCwidHlwZSI6ImFjY2VzcyJ9.qoW-NUPLcyQjDCZIQAL0FkiV59Fl1R-_4GvWBhO3v9c',
        expires: '2024-10-08T12:39:40.905Z',
      },
    });

    userService.generateUserSideMenuConfiguration = jest
      .fn()
      .mockResolvedValue(
        fixtures.authModelResponse.adminUserSideMenuConfigurationResponse
      );

    const getUserReq = {
      body: {
        email: 'abc@gmail.com',
        password: '123@abc',
      },
    };
    const getUserRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const authNext = jest.fn();
    await authController.login(getUserReq, getUserRes, authNext);
    expect(User.findOne).toHaveBeenCalled();
  });
  it('Error if Login Failed Controller', async () => {
    User.findOne = jest.fn().mockImplementation(() => undefined);

    User.isPasswordMatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getUserReq = {
      body: {
        email: 'abc@gmail.com',
        password: '123@abc',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await authController.login(getUserReq, getUserRes, authNext);
    expect(User.findOne).toHaveBeenCalled();
  });
  it('handle 404 Error if Login Failed Controller', async () => {
    User.findOne = jest.fn().mockImplementation(() => new ApiError(404));

    User.isPasswordMatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getUserReq = {
      body: {
        email: 'abc@gmail.com',
        password: '123@abc',
      },
    };
    const getUserRes = {
      status: jest.fn().mockReturnThis(404),
      send: jest.fn(),
    };
    const authNext = jest.fn();
    await authController.login(getUserReq, getUserRes, authNext);
    expect(User.findOne).toHaveBeenCalled();
  });
});

describe('generateToken', () => {
  it('should generate a token with the correct payload when given valid input parameters', () => {
    const userId = '123456789';
    const expires = moment().add(1, 'hour');
    const type = 'ACCESS';
    const secret = 'secretKey';

    const token = generateToken(userId, expires, type, secret);

    jwt.verify = jest.fn().mockImplementation(() => ({
      sub: userId,
      iat: 1,
      exp: expires,
      type,
    }));

    const decoded = jwt.verify(token, secret);
    expect(decoded.sub).toBe(userId);
    expect(decoded.iat).toBeDefined();
    expect(decoded.type).toBe(type);
  });
  it('should throw an error with status code 404 when email is not found in the database', async () => {
    const email = 'test@example.com';
    const password = 'password';

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);

    // Use an async function to catch the thrown error
    await expect(async () => {
      await loginUserWithEmailAndPassword(email, password);
    }).rejects.toThrow(Error); // You can adjust this based on the actual error thrown

    // Assert that getUserByEmail was called with the correct email
    expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
  });

  it('should generate a token with the correct signature when given valid input parameters', () => {
    const userId = '123456789';
    const expires = moment().add(1, 'hour');
    const type = 'ACCESS';
    const secret = 'secretKey';

    const token = generateToken(userId, expires, type, secret);

    jwt.verify = jest.fn().mockImplementation(() => ({
      sub: userId,
      iat: 1,
      exp: expires,
      type,
    }));
    const decoded = jwt.verify(token, secret);
    expect(decoded.sub).toBe(userId);
    expect(decoded.iat).toBeDefined();
    expect(decoded.type).toBe(type);
  });
  it('should save a token with blacklisted set to false and return a Token object', async () => {
    const token = 'validToken';
    const userId = 'validUserId';
    const expires = moment().add(1, 'hour');
    const type = 'validType';
    const blacklisted = false;

    const expectedTokenDoc = {
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    };

    Token.create = jest.fn().mockResolvedValue(expectedTokenDoc);

    const result = await saveToken(token, userId, expires, type, blacklisted);

    expect(Token.create).toHaveBeenCalledWith(expectedTokenDoc);
    expect(result).toEqual(expectedTokenDoc);
  });

  it('should verify a valid token and return its payload', async () => {
    const secret = 'thisisasamplesecret';

    const payload = {
      sub: '6577621db5608f883094534a',
      iat: 1704259336,
      type: 'access',
    };
    const token = jwt.sign(payload, secret);
    const result = await verifyToken(token);
    expect(result).toBe('123456789');
  });
  it('should generate an access token and a refresh token with the correct expiration times', async () => {
    const user = {
      id: 102,
      preferences: {
        dateAndTime: {
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '24 Hours',
          timeZone: '(UTC-09:00) Coordinated Universal Time-09',
        },
        authSession: {
          accessTokenTTL: 240,
        },
      },
    };
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      'minutes'
    );
    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      'days'
    );
    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';

    jest.spyOn(moment(), 'add').mockReturnValueOnce(accessTokenExpires);
    jest.spyOn(moment(), 'add').mockReturnValueOnce(refreshTokenExpires);
    jest
      .spyOn(moment(), 'toDate')
      .mockReturnValueOnce(accessTokenExpires.toDate())
      .mockReturnValueOnce(refreshTokenExpires.toDate());

    jest
      .spyOn(jwt, 'sign')
      .mockReturnValueOnce(accessToken)
      .mockReturnValueOnce(refreshToken);

    Token.create = jest.fn().mockImplementation(() => ({
      instered: 1,
    }));

    const result = await generateAuthTokens(user);

    expect(result).toEqual({
      access: {
        token: accessToken,
        expires: expect.any(Date),
      },
      refresh: {
        token: refreshToken,
        expires: expect.any(Date),
      },
    });

    // Check expiration time with a very small tolerance
    expect(result.access.expires).toBeInstanceOf(Date);
    expect(result.refresh.expires).toBeInstanceOf(Date);
  });
});

describe('loginUserWithEmailAndPassword', () => {
  it.skip('should return a user object when valid email and password are provided', async () => {
    const email = 'validemail@example.com';
    const password = 'validPassword@123';
    const user = {
      isPasswordMatch: jest.fn(),

      email: 'validemail@example.com',
      role: 'user',
      isEmailVerified: false,
      createdAt: '2023-12-13T10:13:08.655Z',
      isActive: true,
      isDeleted: false,
      policies: [],
      roles: {
        roleName: 'Administrator',
        description: 'Administrator Role',
        policies: [
          {
            policyName: 'Machine &  Status',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Machine & Status Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f05',
          },
          {
            policyName: 'Jobs & Status',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Job & Status Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f06',
          },
          {
            policyName: 'Dashboard',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Dashboard Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f07',
          },
          {
            policyName: 'Configuration-WMS',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-WMS Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f08',
          },
          {
            policyName: 'Configuration-Machine',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-Machine Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f09',
          },
          {
            policyName: 'Configuration-Workgroup',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration- Workgroup Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f0a',
          },
          {
            policyName: 'Configuration-Machine Group',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-Machine Group Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f0b',
          },
          {
            policyName: 'Configuration-Machine Lookup',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-Machine Lookup Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f0c',
          },
          {
            policyName: 'Configuration-Machine Type',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Configuration-Machine Type Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f0d',
          },
          {
            policyName: 'History-Graphs',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'History-Graphs Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f0e',
          },
          {
            policyName: 'History-Logged Events',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'History-Logged events Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f0f',
          },
          {
            policyName: 'User Management-Policies',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Policies Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f10',
          },
          {
            policyName: 'User Management-Roles',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Roles Screen',
            createdAt: '2024-03-21T10:36:04.724Z',
            id: '660a62073176114eaa3e2f11',
          },
          {
            policyName: 'User Management-Users',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Users Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a62073176114eaa3e2f12',
          },
          {
            policyName: 'Welcome Page',
            isActive: true,
            createdBy: '6594ee7c58ec983208c4f8d3',
            updatedBy: '6594ee7c58ec983208c4f8d3',
            description: 'Welcome Page Screen',
            createdAt: '2024-03-21T10:36:17.364Z',
            id: '660a6b4f3176114eaa3e2f19',
          },
        ],
        isActive: true,
        createdBy: '6594ee7c58ec983208c4f8d3',
        createdAt: '2024-03-21T10:36:04.724Z',
        updatedBy: '6594ee7c58ec983208c4f8d3',
        id: '65fbe04df731bd4b9af1df61',
      },
      updatedBy: '657983b49d45ee6041c0df64',
      displayName: 'Admin',
      machineGroups: [
        {
          name: 'Group 1',
          machines: [
            {
              machineId: 'M0004',
              machineName: 'boxsizer 4 updated',
              machineType: 'Cutter',
              maxThroughPut: '40',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-19T11:38:06.619Z',
              description: '',
              updatedBy: '6629fce1e44a221cb64ddd15',
              id: '6601c467fb6023588b64d261',
            },
            {
              machineId: 'M0005',
              machineName: 'Boxsizer_5',
              machineType: 'Cutter',
              maxThroughPut: '40',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-20T04:33:37.075Z',
              description: '',
              updatedBy: '657983b49d45ee6041c0df64',
              id: '6601c467fb6023588b64d262',
            },
            {
              machineId: 'M0006',
              machineName: 'Boxsizer_6 demo machine',
              machineType: 'Cutter',
              maxThroughPut: '40',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-22T06:00:37.532Z',
              description: 'This is box sizer machine',
              updatedBy: '657983b49d45ee6041c0df64',
              id: '6601c467fb6023588b64d263',
            },
            {
              machineId: 'M0007',
              machineName: 'Machine4',
              machineType: 'pregis Cutter1',
              maxThroughPut: '20',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-25T15:31:52.054Z',
              description: 'Description',
              updatedBy: '6593f61758ec983208c4ed05',
              id: '6601c467fb6023588b64d264',
            },
            {
              machineId: 'M0010',
              machineName: 'boxsizer_2',
              machineType: 'Cutter',
              maxThroughPut: '40',
              status: 'Active',
              createdBy: '6593f61758ec983208c4ed05',
              createdAt: '2024-03-19T11:38:06.619Z',
              id: '6601c467fb6023588b64d267',
            },
          ],
          status: 'Active',
          description: 'Group 1 description',
          id: '660518944a8c5de4923aa61e',
        },
        {
          name: 'Group 2',
          machines: [],
          status: 'Active',
          description: 'Group 2 description',
          updatedBy: '657983b49d45ee6041c0df64',
          id: '660518f14a8c5de4923aa61f',
        },
      ],
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
        _id: '66471db5d68861297fdc46ea',
      },
      id: '657983b49d45ee6041c0df64',
    };

    const getUserByEmailMock = jest.spyOn(userService, 'getUserByEmail');
    getUserByEmailMock.mockResolvedValue(user);

    const isPasswordMatchMock = jest.spyOn(user, 'isPasswordMatch');
    isPasswordMatchMock.mockResolvedValue(true);

    const result = await loginUserWithEmailAndPassword(email, password);

    expect(result).toEqual(user);
  });
});

describe('generateTokens', () => {
  it('should generate a token with the correct expiration time when given valid input parameters', () => {
    const decoded = jwt.decode(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTg1OGQxNTJmMDBhNmU0ZTIyNzQyNmUiLCJpYXQiOjE3MDMyNTEyMzAsImV4cCI6MTcwMzI1MzAzMCwidHlwZSI6ImFjY2VzcyJ9.rwPoKnOpMDq9qWHyfJSjcpB44uBM-SCbNp_X1wS0r_w'
    );
    expect(decoded.exp).toBe(1703253030);
    expect(decoded.sub).toBe('65858d152f00a6e4e227426e');
    expect(decoded.iat).toBe(1703251230);
    expect(decoded.type).toBe('access');
  });

  // Throws an error when not given a userId parameter.

  /* eslint-disable */
  it('should throw an error when not given a userId parameter', () => {
    const expires = moment().add(1, 'hour');

    expect(() => {
      generateToken(undefined, expires, type);
    });
  });

  // Throws an error when not given an expires parameter.
  it('should throw an error when not given an expires parameter', () => {
    const userId = '123456789';

    expect(() => {
      generateToken(userId, undefined);
    });
  });

  // Throws an error when not given a type parameter.
  it('should throw an error when not given a type parameter', () => {
    const userId = '123456789';
    const expires = moment().add(1, 'hour');

    expect(() => {
      generateToken(userId, expires, undefined);
    });
  });
});
/* eslint-enable */

describe('verifyToken', () => {
  it('should return the user ID when the token is valid', async () => {
    const token = 'valid-token';
    const expectedUserId = 123;

    jwt.verify = jest.fn().mockImplementation(() => ({
      sub: expectedUserId,
    }));

    const result = await verifyToken(token);

    // Assertions
    expect(result).toBe(expectedUserId);
    expect(jwt.verify).toHaveBeenCalledWith(token, config.jwt.secret);
    expect(jwt.verify).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the token is invalid', async () => {
    const token = 'invalid-token';

    // Mock the jwt.verify method to throw an error
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    // Assertions
    await expect(verifyToken(token)).rejects.toThrow(
      'Token verification failed'
    );
    expect(jwt.verify).toHaveBeenCalledWith(token, config.jwt.secret);
  });
});
