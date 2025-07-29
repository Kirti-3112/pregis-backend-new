const {
  paperSenseAndDispenseDashboardController,
} = require('../../../../../src/controllers');
const {
  MachineCycleTime,
  Jobs,
  MachineLookup,
  ConfigMachineLookup,
} = require('../../../../../src/models');

describe('Dashboard Controller : Sense and dispense Paper', () => {
  test('Get Sense and dispense Paper Dashboard', async () => {
    MachineCycleTime.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        lean: () => [
          {
            _id: '657acfb37585709ee04f0797',
            machineId: 'SD-Regression-1928',
            date: '2024-04-17',
            startTime: '2024-04-17T14:00:00.580Z',
            endTime: '2024-04-17T18:45:00.538Z',
            duration: '04:45:00',
            status: 'Stop',
            parameter: 'MUT',
            createdAt: '2023-12-14T09:49:39.427Z',
            updatedAt: '2023-12-22T13:21:43.599Z',
          },
          {
            _id: '657acfb37585709ee04f0797',
            machineId: 'SD-Regression-1928',
            date: '2024-04-17',
            startTime: '2024-04-17T14:00:00.580Z',
            endTime: '2024-04-17T18:45:00.538Z',
            duration: '04:45:00',
            status: 'Stop',
            parameter: 'TMUT',
            createdAt: '2023-12-14T09:49:39.427Z',
            updatedAt: '2023-12-22T13:21:43.599Z',
          },
        ],
      }),
    }));

    MachineLookup.findOne = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => ({
          Message: 'General warning 28',
        }),
      }),
    }));

    Jobs.aggregate = jest
      .fn()
      .mockImplementation(() => [{ totalVolume: 10, count: 5 }]);

    Jobs.aggregate = jest
      .fn()
      .mockImplementation(() => [{ totalVolume: 10, averageVolume: 5 }]);

    Jobs.aggregate = jest.fn().mockImplementation(() => [
      { _id: 'Completed', count: 4 },
      { _id: 'InProgress', count: 1 },
      { _id: 'NotHandled', count: 2 },
      { _id: 'Removed', count: 2 },
    ]);

    Jobs.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => [{ Duration: '00:10:55' }, { Duration: '00:11:55' }],
      }),
    }));

    Jobs.aggregate = jest
      .fn()
      .mockImplementation(() => [{ averageSavings: 12 }]);

    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        averageCycleTimeInHHMMSS: '00:10:20',
        totalCycleTimeInHHMMSS: '00:12:00',
      },
    ]);

    Jobs.countDocuments = jest.fn().mockImplementation(() => 20);
    ConfigMachineLookup.findOne = jest.fn().mockImplementation(() => ({
      populate: () => ({ maxThroughPut: 40 }),
    }));

    Jobs.aggregate = jest
      .fn()
      .mockImplementation(() => [{ averageCostSavings: 2.53 }]);

    const getJobReq = {
      body: {
        filters: {
          date: '2024-10-11',
          machineId: 'SD-Regression-1928',
          averageCostSavingsDate: {
            from: '2024-10-05',
            to: '2024-10-11',
          },
        },
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));

    const getJobRes = {
      status: mockStatus,
    };

    const authNext = jest.fn();
    await paperSenseAndDispenseDashboardController.getSenseAndDispenseDashboard(
      getJobReq,
      getJobRes,
      authNext
    );
    expect(MachineCycleTime.find).toHaveBeenCalled();
  });
});
