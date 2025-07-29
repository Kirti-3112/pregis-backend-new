const { machineController } = require('../../../src/controllers');
const {
  MachineEvent,
  MachineCycleTime,
  MachineLookup,
} = require('../../../src/models');

describe('Machine Controller', () => {
  it('should return machine event details and start up time calculation', async () => {
    MachineEvent.findOne = jest.fn().mockImplementation(() => ({
      select: () => ({
        sort: () => ({
          exec: () => ({
            machineId: 'AURORA1',
            eventCount: '15022',
            errorCode:
              '0000000000000000000000000000000000000000000000000000000000000000',
            Reported: 'False',
            area: 'GeneralAlarms1',
            eventTime: '2023-12-11T05:29:24.104Z',
            status: 'Auto',
          }),
        }),
      }),
    }));

    MachineEvent.findOne = jest.fn().mockImplementation(() => ({
      sort: () => ({
        lean: () => [
          {
            _id: '657acfb37585709ee04f0797',
            machineId: 'AURORA1',
            eventCount: '15022',
            errorCode:
              '0000000000000000000000000000000000000000000000000000000000000000',
            Reported: 'False',
            area: 'GeneralAlarms1',
            eventTime: '2023-12-11T05:29:24.104Z',
            status: 'Auto',
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

    // MachineCycleTime.findOneAndUpdate = jest.fn().mockImplementation(() => ({
    //   update: 1,
    // }));

    // MachineCycleTime.create = jest.fn().mockImplementation(() => ({
    //   inserted: 1,
    // }));
    // MachineCycleTime.update = jest.fn().mockImplementation(() => ({
    //   update: 1,
    // }));

    const getMachineReq = {
      body: {
        machineId: 'AURORA1',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));

    const getMachineRes = { status: mockStatus };

    const authNext = jest.fn();
    await machineController.getMachineDetails(
      getMachineReq,
      getMachineRes,
      authNext
    );

    expect(MachineEvent.findOne).toHaveBeenCalled();
  });

  it('should return machine event details and stop up time calculation', async () => {
    MachineEvent.findOne = jest.fn().mockImplementation(() => ({
      select: () => ({
        sort: () => ({
          exec: () => ({
            machineId: 'AURORA1',
            eventCount: '15022',
            errorCode:
              '0000000000000000000000000000000000000000000000000000000000000000',
            Reported: 'False',
            area: 'GeneralAlarms1',
            eventTime: '2023-12-11T05:29:24.104Z',
            status: 'Auto',
          }),
        }),
      }),
    }));

    MachineEvent.findOne = jest.fn().mockImplementation(() => ({
      sort: () => ({
        lean: () => [
          {
            _id: '657acfb37585709ee04f0797',
            machineId: 'AURORA1',
            eventCount: '15022',
            errorCode:
              '0000000000000000000000000000000000000000000000000000000000000000',
            Reported: 'False',
            area: 'GeneralAlarms1',
            eventTime: '2023-12-11T05:29:24.104Z',
            status: 'Auto',
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

    MachineCycleTime.findOneAndUpdate = jest.fn().mockImplementation(() => ({
      update: 1,
    }));

    const getMachineReq = {
      body: { machineId: 'AURORA1' },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));

    const getMachineRes = { status: mockStatus };

    const authNext = jest.fn();
    await machineController.getMachineDetails(
      getMachineReq,
      getMachineRes,
      authNext
    );

    expect(MachineEvent.findOne).toHaveBeenCalled();
  });

  it('return 404  machine event details not found', async () => {
    MachineEvent.findOne = jest.fn().mockImplementation(() => ({
      select: () => ({
        sort: () => ({
          exec: () => undefined,
        }),
      }),
    }));

    MachineEvent.findOne = jest.fn().mockImplementation(() => ({
      sort: () => ({
        lean: () => [
          {
            _id: '657acfb37585709ee04f0797',
            machineId: 'AURORA1',
            eventCount: '15022',
            errorCode:
              '0000000000000000000000000000000000000000000000000000000000000000',
            Reported: 'False',
            area: 'GeneralAlarms1',
            eventTime: '2023-12-11T05:29:24.104Z',
            status: 'Auto',
            createdAt: '2023-12-14T09:49:39.427Z',
            updatedAt: '2023-12-22T13:21:43.599Z',
          },
        ],
      }),
    }));

    const getMachineReq = {
      body: {
        machineId: 'AURORA1',
      },
    };
    // const mockSend = jest.fn();
    // const mockStatus = jest.fn(() => ({ send: mockSend }));

    const getMachineRes = {
      return: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const authNext = jest.fn();
    await machineController.getMachineDetails(
      getMachineReq,
      getMachineRes,
      authNext
    );

    expect(MachineEvent.findOne).toHaveBeenCalled();
  });

  it('return 500  machine event controller internal server error', async () => {
    MachineEvent.findOne = jest.fn().mockImplementation(() => ({
      select: () => ({
        sort: () => ({}),
      }),
    }));

    MachineEvent.findOne = jest.fn().mockImplementation(() => ({
      sort: () => ({
        lean: () => ({}),
      }),
    }));

    const getMachineReq = {
      body: {},
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));

    const getMachineRes = { status: mockStatus };

    const authNext = jest.fn();
    await machineController.getMachineDetails(
      getMachineReq,
      getMachineRes,
      authNext
    );

    expect(MachineEvent.findOne).toHaveBeenCalled();
  });
});
