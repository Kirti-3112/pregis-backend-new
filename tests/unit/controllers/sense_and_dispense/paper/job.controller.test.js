const {
  paperSenseAndDispenseJobsController,
} = require('../../../../../src/controllers');
const JobModel = require('../../../../../src/models/jobs.model');
const fixture = require('../../../fixtures/job.model');

describe('Job Controller - Sense and Dispense', () => {
  it('Get Job Data : Controller', async () => {
    JobModel.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        limit: () => ({
          skip: () => ({
            sort: () => ({
              exec: () => [
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
              ],
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
    const getJobRes = {};
    const authNext = jest.fn();
    await paperSenseAndDispenseJobsController.getJobData(
      getJobReq,
      getJobRes,
      authNext
    );
    expect(JobModel.find).toHaveBeenCalled();
  });
  it('GetJob data with filter', async () => {
    JobModel.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        limit: () => ({
          skip: () => ({
            exec: () => [fixture.jobModelResponse.jobData],
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
          filterKey: 'ID',
          filterText: 1,
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
    const getJobRes = {};
    const authNext = jest.fn();
    await paperSenseAndDispenseJobsController.getJobData(
      getJobReq,
      getJobRes,
      authNext
    );
    expect(JobModel.find).toHaveBeenCalled();
  });
  it('Get Job Data By Id: Controller', async () => {
    JobModel.findOne = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => [
          {
            jobData: {
              machineId: 'M001',
              jobId: '25001',
              barcode: 'LPN12345',
              createdTime: '2024-07-06T09:47:07.579Z',
              completedTime: '2024-04-26T09:47:24.745Z',
              unitOfMeasure: 'M',
              productionStatus: 'Completed',
              additionalData1: 'printdata',
              additionalData2: 'shipping category',
              additionalData3: 'ship notes',
              additionalData4: 'additional print',
              additionalData5: 'additional print',
              voidFillTypeUsed: 'Paper',
              stationRecords: [],
              dispenseEvents: [],
              id: '662b6813151383859c723e35',
            },
            metadata: {
              fieldToTitleMap: {
                jobId: 'ID',
                createdAt: 'Date',
                updatedAt: 'Date',
                createdTime: 'Created Time',
                importedTime: 'Imported Time',
                completedTime: 'Completed Time',
                barcode: 'Barcode',
                recipeID: 'Recipe ID',
                boxLengthMeasured: 'Box Length Measured',
                boxWidthMeasured: 'Box Width Measured',
                boxHeightMeasured: 'Box Height Measured',
                cutDownLength: 'Cut Down Length',
                productHeightInBox: 'Product Height in Box',
                cutDownNeeded: 'Cut Down Needed',
                boxHeightAfterCutDown: 'Box Height After Cut Down',
                machineSpeed: 'Machine Speed',
                productionStatus: 'Production Status',
                duration: 'Duration',
                volumeReductionPercent: 'Volume Reduction',
                customerId: 'Customer ID',
                machineId: 'Machine ID',
                jobStatus: 'Job Status',
                unitOfMeasure: 'Unit Of Measure',
                voidFillTypeUsed: 'Void Fill Type Used',
                measuredLength: 'Measured Length',
                measuredWidth: 'Measured Width',
                measuredHeight: 'Measured Height',
                boxHeightClosed: 'Box Height Closed',
                measuredWeight: 'Measured Weight',
                boxVolume: 'Box Volume',
                productVolume: 'Product Volume',
                voidVolume: 'Void Volume',
                airPillowsDispensed: 'Air Pillows Dispensed',
                airPillowsSize: 'Air Pillows Size',
                paperLengthDispensed: 'Paper Length Dispensed',
                paperWebWidth: 'Paper Web Width',
                paperWeight: 'Paper Weight',
                imageFileLocation: 'Image File Location',
                additionalData1: 'Additional Data 1',
                additionalData2: 'Additional Data 2',
                additionalData3: 'Additional Data 3',
                additionalData4: 'Additional Data 4',
                additionalData5: 'Additional Data 5',
                stationRecords: 'Station Records',
                dispenseEvents: 'Dispense Events',
              },
              fieldOrder: [
                'jobId',
                'createdTime',
                'completedTime',
                'customerId',
                'machineId',
                'barcode',
                'productionStatus',
                'unitOfMeasure',
                'voidFillTypeUsed',
                'measuredLength',
                'measuredWidth',
                'measuredHeight',
                'boxHeight_Closed',
                'measuredWeight',
                'boxVolume',
                'productVolume',
                'voidVolume',
                'airPillowsDispensed',
                'airPillowsSize',
                'paperLengthDispensed',
                'paperWebWidth',
                'paperWeight',
                'imageFileLocation',
                'additionalData1',
                'additionalData2',
                'additionalData3',
                'additionalData4',
                'additionalData5',
                'stationRecords',
                'dispenseEvents',
              ],
            },
          },
        ],
      }),
    }));

    const getJobReq = {
      body: {
        filters: {
          Barcode: 'LP',
          productionStatus: 'All',
          machineId: 'M0001',
        },
      },
      params: {
        id: '662b6813151383859c723e35',
      },
    };
    const getJobRes = {};
    const authNext = jest.fn();
    await paperSenseAndDispenseJobsController.getJobDataById(
      getJobReq,
      getJobRes,
      authNext
    );
    expect(JobModel.findOne).toHaveBeenCalled();
  });
});
