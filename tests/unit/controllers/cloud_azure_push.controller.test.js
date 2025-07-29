const { EXTENSIONS } = require('../../../src/config/constants');
const { cloudAzurePushController } = require('../../../src/controllers');
const {
  pushData,
} = require('../../../src/controllers/cloud_azure_push.controller');
const JobModel = require('../../../src/models/jobs.model');
const { jobService } = require('../../../src/services');

describe('Cloud Azure Push Controller', () => {
  it('Get Cloud Push Azure Data : Controller', async () => {
    JobModel.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        limit: () => ({
          skip: () => ({
            sort: () => ({
              exec: () => [],
            }),
          }),
        }),
      }),
    }));

    JobModel.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getJobReq = {
      body: {
        filters: {
          ProductionStatus: 'Completed',
        },
        pagination: {
          pageSize: '1',
          pageLimit: '10000',
        },
        extension: 'json',
      },
    };
    const getJobRes = {};
    const authNext = jest.fn();
    await cloudAzurePushController.pushData(getJobReq, getJobRes, authNext);
    expect(JobModel.find).toHaveBeenCalled();
  });

  it('Error if Get Cloud Push Azure Data Failed to load : Controller', async () => {
    JobModel.find = jest.fn().mockImplementation(() => undefined);
    JobModel.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getJobReq = {
      body: {
        filters: {
          ProductionStatus: 'Completed',
        },
        pagination: {
          pageSize: '1',
          pageLimit: '10000',
        },
        extension: 'json',
      },
    };

    const getJobRes = {};
    const authNext = jest.fn();
    await cloudAzurePushController.pushData(getJobReq, getJobRes, authNext);
    expect(JobModel.find).toHaveBeenCalled();
  });
  it('Get Cloud Push Azure Data Export: Controller', async () => {
    JobModel.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        limit: () => ({
          skip: () => ({
            sort: () => ({
              exec: () => [],
            }),
          }),
        }),
      }),
    }));

    JobModel.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getJobReq = {
      body: {
        filters: {
          ProductionStatus: 'Completed',
        },
        pagination: {
          pageSize: '1',
          pageLimit: '10000',
        },
        extension: 'xlsx',
        fileName: 'Cloud_Azure',
      },
    };
    const getJobRes = {};
    const authNext = jest.fn();
    await cloudAzurePushController.pushData(getJobReq, getJobRes, authNext);
    expect(JobModel.find).toHaveBeenCalled();
  });

  it('Error if Get Cloud Push Azure Data Failed to load Export: Controller', async () => {
    JobModel.find = jest.fn().mockImplementation(() => undefined);
    JobModel.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getJobReq = {
      body: {
        filters: {
          ProductionStatus: 'Completed',
        },
        pagination: {
          pageSize: '1',
          pageLimit: '10000',
        },
        extension: 'xlsx',
        fileName: 'Cloud_Azure',
      },
    };

    const getJobRes = {};
    const authNext = jest.fn();
    await cloudAzurePushController.pushData(getJobReq, getJobRes, authNext);
    expect(JobModel.find).toHaveBeenCalled();
  });
});
describe('pushData', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        extension: null, // Add the extension as needed for each test case
        fileName: 'testFileName', // Add the fileName as needed for each test case
      },
    };
    res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle JSON request and send updated jobData', async () => {
    req.body.extension = EXTENSIONS.JSON;
    const mockJobData = {
      job: [{ _id: '1', field1: 'value1', field2: 'value2' }],
    };
    jest.spyOn(jobService, 'getJob').mockResolvedValueOnce(mockJobData);
    await pushData(req, res, next);
    expect(jobService.getJob).toHaveBeenCalled();
  });
});
