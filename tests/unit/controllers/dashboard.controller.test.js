const { MachineCycleTime, MachineLookup } = require('../../../src/models');
const { dashboardController } = require('../../../src/controllers');
const Jobs = require('../../../src/models');

describe('Dashboard Controller', () => {
  it('Get Dashboard Data With Updated UpTime  : Controller', async () => {
    // MachineEvent.findOne = jest.fn().mockImplementation(() => ({
    //   select: () => ({
    //     sort: () => ({
    //       exec: () => ({
    //         machine_id: 'AURORA1',
    //         eventCount: '15022',
    //         errorCode:
    //           '0000000000000000000000000000000000000000000000000000000000000000',
    //         Reported: 'False',
    //         area: 'GeneralAlarms1',
    //         eventTime: new Date('2023-12-11T05:29:24.104Z'),
    //         status: 'Auto',
    //       }),
    //     }),
    //   }),
    // }));

    MachineCycleTime.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        lean: () => [
          {
            _id: '657acfb37585709ee04f0797',
            machineId: 'M0004',
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
            machineId: 'M0004',
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

    // MachineCycleTime.findOneAndUpdate = jest.fn().mockImplementation(() => {});

    MachineLookup.findOne = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => ({
          Message: 'General warning 28',
        }),
      }),
    }));

    Jobs.aggregate = jest.fn().mockImplementation(() => ({
      exec: () => [{ totalVolume: 10, count: 5 }],
    }));
    Jobs.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => [{ Duration: '00:10:55' }, { Duration: '00:11:55' }],
      }),
    }));
    const getJobReq = {
      body: {
        filters: {
          date: '2023-12-27T00:00:00.000Z',
          machineId: 'M0004',
          averageCostSavingsDate: {
            from: '2024-06-09',
            to: '2024-07-09',
          },
        },
      },
    };
    const getJobRes = {};
    const authNext = jest.fn();
    await dashboardController.getDashboard(getJobReq, getJobRes, authNext);
    expect(MachineCycleTime.find).toHaveBeenCalled();
  });

  it('Get Dashboard Data With Stoped UpTime : Controller', async () => {
    // MachineEvent.findOne = jest.fn().mockImplementation(() => ({
    //   select: () => ({
    //     sort: () => ({
    //       exec: () => ({
    //         machine_id: 'AURORA1',
    //         eventCount: '15022',
    //         errorCode:
    //           '0000000000000000000000000000000000000000000000000000000000000000',
    //         Reported: 'False',
    //         area: 'GeneralAlarms1',
    //         eventTime: new Date('2023-12-11T05:29:24.104Z'),
    //         status: 'Stop',
    //       }),
    //     }),
    //   }),
    // }));

    MachineCycleTime.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        lean: () => [
          {
            _id: '657acfb37585709ee04f0797',
            machineId: 'M0004',
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
            machineId: 'M0004',
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

    MachineCycleTime.findOneAndUpdate = jest.fn().mockImplementation(() => {});

    MachineLookup.findOne = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => ({
          Message: 'General warning 28',
        }),
      }),
    }));

    Jobs.aggregate = jest.fn().mockImplementation(() => ({
      exec: () => [{ totalVolume: 10, count: 5 }],
    }));
    Jobs.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => [{ Duration: '00:10:55' }, { Duration: '00:11:55' }],
      }),
    }));
    const getJobReq = {
      body: {
        filters: {
          date: '2023-12-27T00:00:00.000Z',
          machineId: 'M0004',
          averageCostSavingsDate: {
            from: '2024-06-09',
            to: '2024-07-09',
          },
        },
      },
    };
    const getJobRes = {};
    const authNext = jest.fn();
    await dashboardController.getDashboard(getJobReq, getJobRes, authNext);
    expect(MachineCycleTime.find).toHaveBeenCalled();
  });
});
