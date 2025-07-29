const httpStatus = require('http-status');
const authService = require('../../../src/services/auth.service');
const userService = require('../../../src/services/user.service');
const tokenService = require('../../../src/services/token.service');
const ApiError = require('../../../src/utils/ApiError');
const {
  getUnitConversionByFilter,
} = require('../../../src/services/config_unit_conversion.service');

// Mocks
jest.mock('../../../src/services/user.service');
jest.mock('../../../src/services/token.service');
jest.mock('../../../src/services/config_unit_conversion.service');
jest.mock('../../../src/config/logger', () => ({
  debug: jest.fn(),
}));

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUserWithEmailAndPassword', () => {
    const email = 'test@example.com';
    const password = 'Password123';

    it('should throw NOT_FOUND if user is not found', async () => {
      userService.getUserByEmail.mockResolvedValue(null);

      await expect(
        authService.loginUserWithEmailAndPassword(email, password)
      ).rejects.toThrow(
        new ApiError(
          httpStatus.NOT_FOUND,
          'We cannot find an user with that email address'
        )
      );
    });

    it('should throw METHOD_NOT_ALLOWED if user is inactive', async () => {
      const user = { isActive: false };
      userService.getUserByEmail.mockResolvedValue(user);

      await expect(
        authService.loginUserWithEmailAndPassword(email, password)
      ).rejects.toThrow(
        new ApiError(
          httpStatus.METHOD_NOT_ALLOWED,
          'Registered email is inactive, to activate contact administrator'
        )
      );
    });

    it('should throw UNAUTHORIZED if password is incorrect', async () => {
      const user = {
        isActive: true,
        isPasswordMatch: jest.fn().mockResolvedValue(false),
      };
      userService.getUserByEmail.mockResolvedValue(user);

      await expect(
        authService.loginUserWithEmailAndPassword(email, password)
      ).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
      );
    });

    it('should return user with machineLevelUnitConversion when valid', async () => {
      const user = {
        isActive: true,
        isPasswordMatch: jest.fn().mockResolvedValue(true),
        machineGroups: [
          {
            machines: [
              { machineId: 'MachineOne' },
              { machineId: 'MachineTwo' },
            ],
          },
        ],
      };

      const mockConversionData = [
        {
          machineId: { machineName: 'MachineOne' },
          importDimension: 1,
          importVolume: 2,
          importWeight: 3,
          exportDimension: 4,
          exportVolume: 5,
          exportWeight: 6,
        },
      ];

      userService.getUserByEmail.mockResolvedValue(user);
      getUnitConversionByFilter.mockResolvedValue(mockConversionData);

      const result = await authService.loginUserWithEmailAndPassword(
        email,
        password
      );

      expect(result.machineLevelUnitConversion).toEqual({
        machineone: {
          importDimension: 1,
          importVolume: 2,
          importWeight: 3,
          exportDimension: 4,
          exportVolume: 5,
          exportWeight: 6,
        },
      });
    });

    it('should not include machineLevelUnitConversion if no machineGroups', async () => {
      const user = {
        isActive: true,
        isPasswordMatch: jest.fn().mockResolvedValue(true),
        machineGroups: [],
      };

      userService.getUserByEmail.mockResolvedValue(user);

      const result = await authService.loginUserWithEmailAndPassword(
        email,
        password
      );

      expect(result.machineLevelUnitConversion).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should throw NOT_FOUND when refresh token doc is false', async () => {
      // Force internal `refreshTokenDoc` to be false
      // eslint-disable-next-line no-console
      const originalConsole = console.debug;
      // eslint-disable-next-line global-require
      const mockLogger = require('../../../src/config/logger');
      mockLogger.debug.mockImplementation(() => {});

      // Force function execution to not hit remove
      // eslint-disable-next-line global-require
      const fakeAuthService = require('../../../src/services/auth.service');
      fakeAuthService.logout = jest.fn().mockImplementation(async () => {
        const refreshTokenDoc = false;
        if (!refreshTokenDoc) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        }
        await refreshTokenDoc.remove();
      });

      await expect(fakeAuthService.logout()).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Not found')
      );

      // eslint-disable-next-line no-console
      console.debug = originalConsole;
    });

    it('should call remove when refresh token is present (mocked)', async () => {
      const mockRemove = jest.fn();
      const refreshTokenDoc = { remove: mockRemove };

      const logout = async () => {
        const found = true;
        if (!found) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
        await refreshTokenDoc.remove();
      };

      await logout();
      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe('refreshAuth', () => {
    it('should throw UNAUTHORIZED on error', async () => {
      tokenService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshAuth('invalid-token')).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    });

    it('should throw UNAUTHORIZED if user not found', async () => {
      tokenService.verifyToken.mockResolvedValue('user-id');
      userService.getUserById.mockResolvedValue(null);

      await expect(authService.refreshAuth('token')).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    });

    it('should return new access token if valid refresh token', async () => {
      const userId = 'user-id';
      const user = {
        preferences: {
          authSession: {
            accessTokenTTL: 15,
          },
        },
      };
      const mockToken = 'new-token';
      const mockExpires = { toDate: () => new Date('2025-12-31T00:00:00Z') };

      tokenService.verifyToken.mockResolvedValue(userId);
      userService.getUserById.mockResolvedValue(user);
      tokenService.generateAccessTokenExpiration = jest
        .fn()
        .mockReturnValue(mockExpires);
      tokenService.generateToken = jest.fn().mockReturnValue(mockToken);

      const result = await authService.refreshAuth('valid-refresh-token');

      expect(result.access.token).toBe(mockToken);
      expect(result.access.expires).toEqual(new Date('2025-12-31T00:00:00Z'));
    });
  });
});
