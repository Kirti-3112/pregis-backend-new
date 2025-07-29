const httpStatus = require('http-status');
const {
  getJobData,
  getJobDataById,
} = require('../../../../../src/controllers/sense_and_dispense/air_pillow/jobs.controller');
const JobModel = require('../../../../../src/models/jobs.model');
const ApiError = require('../../../../../src/utils/ApiError');

beforeAll(() => {
  JobModel.find = jest.fn().mockImplementation(() => ({
    select: () => ({
      limit: () => ({
        skip: () => ({
          sort: () => ({
            exec: () =>
              Promise.resolve([
                {
                  job: [
                    {
                      date: '2023-11-02T09:11:28.620Z',
                      createdTime: '06.32.00',
                      completedTime: '06.33.00',
                      barCode: 'LPN01234',
                      receiptId: 'C40',
                      boxLength: 400,
                      boxWidth: 300,
                      boxHeight: 280,
                      cutDownLength: 120,
                      productHeightInBox: 200,
                      cutDownNeeded: true,
                      boxHeightAfterCutDown: 160,
                      machineSpeed: 90,
                      productionStatus: true,
                      duration: '00.01.00',
                      volumeReduction: '60.00%',
                      Date: '2023-11-20T11:24:57.342Z',
                      id: '655b3f586245ebadb7db8f1f',
                    },
                  ],
                  rowsPerPage: 10,
                  totalPages: 1,
                  currentPage: 1,
                  totalRecords: 20,
                },
              ]),
          }),
        }),
      }),
    }),
  }));

  JobModel.countDocuments = jest.fn().mockResolvedValue(1);

  JobModel.findOne = jest.fn().mockImplementation(() => ({
    select: () =>
      // ({
      //   exec: () =>
      Promise.resolve([
        {
          jobData: {
            machineId: 'M001',
            jobId: '25001',
            barcode: 'LPN12345',
            createdTime: '2024-07-06T09:47:07.579Z',
            completedTime: '2024-04-26T09:47:24.745Z',
            unitOfMeasure: 'M',
            productionStatus: 'Completed',

            voidFillTypeUsed: 'Paper',

            id: '662b6813151383859c723e35',
          },
          metadata: {
            fieldToTitleMap: {
              jobId: 'ID',
              createdAt: 'Date',
            },
            fieldOrder: ['jobId', 'createdTime'],
          },
        },
      ]),
    //   }),
  }));
});

afterAll(() => {
  // Clean up any mock data or restore mocks after tests
  jest.restoreAllMocks();
});

describe('Job Controller Sense and Dispense Air pillow', () => {
  const getJobReq = {
    body: {
      filters: {
        Barcode: 'LP',
        productionStatus: 'All',
        machineId: 'M0004',
      },
      pagination: {
        pageSize: '1',
        pageLimit: '10',
      },
    },
  };
  const getJobReqWithSelectionFieldString = {
    body: {
      filters: {
        Barcode: 'LP',
        productionStatus: 'All',
        machineId: 'M0004',
      },
      pagination: {
        pageSize: '1',
        pageLimit: '10',
      },
      selectionFieldString: 'barCode',
    },
  };

  const getJobByIdReq = {
    body: {
      filters: {
        Barcode: 'LP',
        productionStatus: 'All',
        machineId: 'M0004',
      },
    },
    params: {
      id: '662b6813151383859c723e35',
    },
  };

  const mockSend = jest.fn();
  const mockStatus = jest.fn(() => ({ send: mockSend }));
  const getJobRes = { status: mockStatus };
  const authNext = jest.fn();

  it('Get Job Data Sense and Dispense Air pillow: Controller', async () => {
    await getJobData(getJobReq, getJobRes, authNext);
    expect(JobModel.find).toHaveBeenCalled();
    expect(JobModel.countDocuments).toHaveBeenCalled();
  });
  it('Get Job Data Sense and Dispense Air pillow with SelectionFieldString : Controller', async () => {
    await getJobData(getJobReqWithSelectionFieldString, getJobRes, authNext);
    expect(JobModel.find).toHaveBeenCalled();
    expect(JobModel.countDocuments).toHaveBeenCalled();
  });

  it('Should fail while Get Job Data Sense and Dispense Air pillow: Controller', async () => {
    JobModel.find = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    await getJobData(getJobReq, getJobRes, authNext);
    expect(JobModel.find).toHaveBeenCalled();
  });

  it('Get Job Details by job id : Controller', async () => {
    await getJobDataById(getJobByIdReq, getJobRes, authNext);
    expect(JobModel.findOne).toHaveBeenCalled();
  });

  it('Should fail while Get Job Details by job id : Controller', async () => {
    JobModel.findOne = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    });

    await getJobDataById(getJobByIdReq, getJobRes, authNext);
    expect(JobModel.findOne).toHaveBeenCalled();
  });
});
