const httpStatus = require('http-status');
const {
  accessConfigurationConstantsController,
} = require('../../../src/controllers');
const { AccessConfigurationConstants } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');

describe('AccessConfigurationConstants Controller', () => {
  it('Get AccessConfigurationConstants Data : Controller', async () => {
    AccessConfigurationConstants.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => [
          { name: 'Dashboard' },
          { name: 'Job and Status' },
          { name: 'Machine and Status' },
          { name: 'User' },
          { name: 'Histoy' },
        ],
      }),
    }));

    const getAccessConfigurationReq = {
      body: {
        filters: {
          category: 'Policy',
        },
      },
    };
    const getgetAccessConfigurationReqRes = {};
    const authNext = jest.fn();

    await accessConfigurationConstantsController.getAccessConfigurationConstants(
      getAccessConfigurationReq,
      getgetAccessConfigurationReqRes,
      authNext
    );
    expect(AccessConfigurationConstants.find).toHaveBeenCalled();
  });

  it('Error While executing AccessConfigurationConstants  Controller', async () => {
    AccessConfigurationConstants.find = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    const getAccessConfigurationReq = {
      body: {
        filters: {
          category: 'Policy',
        },
      },
    };
    const getgetAccessConfigurationReqRes = {};
    const authNext = jest.fn();

    await accessConfigurationConstantsController.getAccessConfigurationConstants(
      getAccessConfigurationReq,
      getgetAccessConfigurationReqRes,
      authNext
    );
    expect(AccessConfigurationConstants.find).toHaveBeenCalled();
  });
});
