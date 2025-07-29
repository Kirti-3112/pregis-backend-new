const { wmsController } = require('../../../src/controllers');
const WMSModel = require('../../../src/models/wms.model');
const fixture = require('../fixtures/wms.model');

describe('WMS Controller', () => {
  it('Get WMS Data : Controller', async () => {
    WMSModel.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        skip: () => ({
          limit: () => ({
            exec: () => [fixture.WMSModelResponse.wmsData],
          }),
        }),
      }),
    }));

    WMSModel.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });
    const getJobReq = {
      body: {
        pagination: {
          page: 3,
          limit: 2,
        },
      },
    };
    const getJobRes = {};
    const authNext = jest.fn();
    await wmsController.getWMS(getJobReq, getJobRes, authNext);
    expect(WMSModel.find).toHaveBeenCalled();
  });

  it('Get WMS Data By WMS ID: Controller', async () => {
    WMSModel.findById = jest.fn().mockImplementation(() => ({
      wmsName: 'pregis',
      communicationType: 'webService',
      hostName: 'localhost',
      portNumber: 3000,
      userName: 'userName',
      password: 'pass@12234',
      jobImport: 'jobImport',
      jobExport: 'jobExport',
      status: 'enable',
      url: 'http://pregis.com',
      userId: '6593f61758ec983208c4ed05',
      decryptPassword: jest.fn().mockImplementation(() => {
        return Promise.resolve('pass@12234');
      }),
    }));

    const getJobReq = {
      params: {
        wmsId: '65c0c31410dd1f5a83988880',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getUserRes = { status: mockStatus };
    const authNext = jest.fn();

    await wmsController.getWMSById(getJobReq, getUserRes, authNext);
    expect(WMSModel.findById).toHaveBeenCalled();
  });

  it('Create WMS Controller', async () => {
    WMSModel.create = jest.fn().mockImplementation(() => ({ inserted: 1 }));

    const getUserReq = {
      body: {
        user_id: '79725',
        job_import: 'test import',
        job_export: 'test export',
        email: 'aditya@gmail.com',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await wmsController.createWMS(getUserReq, getUserRes, authNext);

    expect(WMSModel.create).toHaveBeenCalled();
  });

  it('Error if User Not found for Create WMS Controller', async () => {
    WMSModel.create = jest.fn().mockImplementation(() => undefined);

    const getUserReq = {
      body: {
        email: 'abc@gmail.com',
        password: '123@abc',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await wmsController.createWMS(getUserReq, getUserRes, authNext);

    expect(WMSModel.create).toHaveBeenCalled();
  });

  it('Update WMS Controller', async () => {
    WMSModel.findById = jest.fn().mockImplementation(() => ({
      save: () => ({
        updated: 1,
      }),
    }));

    const getUserReq = {
      params: {
        wmsId: '655f33c93407559b13f0cac9',
      },
      body: {
        job_import: 'abc export 001',
        job_export: 'abc export 001',
        email: 'abcUPDATED@gm.com',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await wmsController.updateWMS(getUserReq, getUserRes, authNext);

    expect(WMSModel.findById).toHaveBeenCalled();
  });

  it('Error if User Not found for Update WMS Controller', async () => {
    WMSModel.findById = jest.fn().mockImplementation(() => undefined);

    const getUserReq = {
      params: {
        wmsId: '655f33c93407559b13f0cac9',
      },
      body: {
        job_import: 'abc export 001',
        job_export: 'abc export 001',
        email: 'abcUPDATED@gm.com',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await wmsController.updateWMS(getUserReq, getUserRes, authNext);

    expect(WMSModel.findById).toHaveBeenCalled();
  });

  it('Delete WMS Controller', async () => {
    WMSModel.findById = jest.fn().mockImplementation(() => ({
      email: 'abc@gmail.com',
      password: '123@abc',
      decryptPassword: jest.fn().mockImplementation(() => {
        return Promise.resolve('123@abc');
      }),
    }));

    WMSModel.deleteOne = jest.fn().mockImplementation(() => ({
      deleted: 1,
    }));

    const getUserReq = {
      params: {
        wmsId: '655f33c93407559b13f0cac9',
      },
    };
    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));

    const getUserRes = { status: mockStatus };

    await wmsController.deleteWMS(getUserReq, getUserRes, authNext);
    expect(WMSModel.findById).toHaveBeenCalled();
  });

  it('Error if User Not found for Delete WMS Controller', async () => {
    WMSModel.findById = jest.fn().mockImplementation(() => undefined);

    WMSModel.deleteOne = jest.fn().mockImplementation(() => ({
      deleted: 1,
    }));

    const getUserReq = {
      params: {
        wmsId: '655f33c93407559b13f0cac9',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await wmsController.deleteWMS(getUserReq, getUserRes, authNext);
    expect(WMSModel.findById).toHaveBeenCalled();
  });
});
