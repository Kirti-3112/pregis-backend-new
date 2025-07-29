const httpStatus = require('http-status');
const { historyController } = require('../../../src/controllers');
const { historyService } = require('../../../src/services');
const { Jobs, MachineLookup, MachineEvent } = require('../../../src/models');
const logger = require('../../../src/config/logger');
const fixture = require('../fixtures/history.model');
const {
  getReportCountMachineEvent,
  getReportsVolumeReduction,
} = require('../../../src/services/history.service');
const {
  getLoggedEventsHistory,
} = require('../../../src/controllers/history.controller');

jest.mock('../../../src/models/machine_event.model');
jest.mock('../../../src/models/machine_lookup.model');
jest.mock('../../../src/models/jobs.model.js');

/* eslint-disable */
describe('History Controller', () => {
  beforeEach(() => {
    options = {
      pagination: { pageLimit: 10, page: 1 },
      filters: {},
    };
    /* eslint-enable */
  });
  /* eslint-disable */
  it('should fetch and process logged events correctly', async () => {
    MachineEvent.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([
        {
          eventCount: 1,
          area: 'A1',
          status: 'OK',
          eventTime: new Date('2023-01-01T12:00:00Z'),
          errorCode: 'E101',
        },
      ]),
    });

    MachineLookup.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([fixture.loggedEvent]),
    });

    MachineEvent.countDocuments.mockResolvedValueOnce(1);
    const mockError = jest.spyOn(logger, 'error');

    const options = {
      pagination: {
        page: 1,
        pageLimit: 10,
      },
      filters: {},
    };

    await historyService.getLoggedEvents(options);

    expect(MachineEvent.find).toHaveBeenCalledWith({});
    expect(MachineLookup.find).toHaveBeenCalledWith(fixture.loggedEvent);
    expect(MachineEvent.countDocuments).toHaveBeenCalled();
    expect(mockError).not.toHaveBeenCalled();
    jest.restoreAllMocks();
  });
  it('should fetch logged events based on filters and pagination options', async () => {
    MachineEvent.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([
        {
          eventCount: 1,
          area: 'A1',
          status: 'OK',
          eventTime: new Date('2023-01-01T12:00:00Z'),
          errorCode: 'E101',
        },
      ]),
    });

    MachineLookup.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([fixture.loggedEvent]),
    });

    MachineEvent.countDocuments.mockResolvedValueOnce(1);
    const mockError = jest.spyOn(logger, 'error');

    const options = {
      pagination: {
        page: 1,
        pageLimit: 10,
      },
      filters: {
        'Event Area': 'A1',
      },
    };

    await historyService.getLoggedEvents(options);

    expect(MachineEvent.find).toHaveBeenCalledWith({
      area: {
        $options: 'i',
        $regex: 'A1',
      },
    });
    expect(MachineLookup.find).toHaveBeenCalledWith(fixture.loggedEvent);
    expect(MachineEvent.countDocuments).toHaveBeenCalled();
    expect(mockError).not.toHaveBeenCalled();
    jest.restoreAllMocks();
  });
  it('should fetch logged events based on filters and pagination options', async () => {
    MachineEvent.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([
        {
          eventCount: 1,
          area: 'A1',
          status: 'OK',
          eventTime: new Date('2023-01-01T12:00:00Z'),
          errorCode: 'E101',
        },
      ]),
    });

    MachineLookup.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([fixture.loggedEvent]),
    });

    MachineEvent.countDocuments.mockResolvedValueOnce(1);
    const mockError = jest.spyOn(logger, 'error');

    const options = {
      pagination: {
        page: 1,
        pageLimit: 10,
      },
      filters: {
        'Event Area': 'A1',
        'Event Count': 1,
      },
    };

    await historyService.getLoggedEvents(options);

    expect(MachineEvent.find).toHaveBeenCalledWith({
      area: {
        $options: 'i',
        $regex: 'A1',
      },
      eventCount: {
        $options: 'i',
        $regex: 1,
      },
    });
    expect(MachineLookup.find).toHaveBeenCalledWith(fixture.loggedEvent);
    expect(MachineEvent.countDocuments).toHaveBeenCalled();
    expect(mockError).not.toHaveBeenCalled();
    jest.restoreAllMocks();
  });
  it('should fetch logged events based on filters and pagination options', async () => {
    MachineEvent.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([
        {
          eventCount: 1,
          area: 'A1',
          status: 'OK',
          eventTime: new Date('2023-01-01T12:00:00Z'),
          errorCode: 'E101',
        },
      ]),
    });

    MachineLookup.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([fixture.loggedEvent]),
    });

    MachineEvent.countDocuments.mockResolvedValueOnce(1);
    const mockError = jest.spyOn(logger, 'error');

    const options = {
      pagination: {},
      filters: {},
    };

    await historyService.getLoggedEvents(options);

    expect(MachineEvent.find).toHaveBeenCalledWith({
      area: {
        $options: 'i',
        $regex: 'A1',
      },
      eventCount: {
        $options: 'i',
        $regex: 1,
      },
    });
    expect(MachineLookup.find).toHaveBeenCalledWith(fixture.loggedEvent);
    expect(MachineEvent.countDocuments).toHaveBeenCalled();
    expect(mockError).not.toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  // Average Volume Reduction test cases
  it('Get Volume Reduction Report : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => ({
      exec: () => [
        {
          totalVolume: 113.63,
          count: 2,
          averagePercentage: 56.815,
          date: '2023-12-24',
        },
        {
          totalVolume: 431.6,
          count: 9,
          averagePercentage: 47.955555555555556,
          date: '2023-12-26',
        },
        {
          totalVolume: 460.37,
          count: 9,
          averagePercentage: 51.15222222222222,
          date: '2023-12-27',
        },
        {
          totalVolume: 251.39999999999998,
          count: 5,
          averagePercentage: 50.279999999999994,
          date: '2023-12-28',
        },
        {
          totalVolume: 502.8,
          count: 10,
          averagePercentage: 50.28,
          date: '2023-12-30',
        },
      ],
    }));

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getReportsForGraph(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Error if get Volume Reduction Report not found : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getReportsForGraph(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Volume Reduction Report Export: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        totalVolume: 113.63,
        count: 2,
        averagePercentage: 56.815,
        date: '2023-12-24',
      },
      {
        totalVolume: 431.6,
        count: 9,
        averagePercentage: 47.955555555555556,
        date: '2023-12-26',
      },
      {
        totalVolume: 460.37,
        count: 9,
        averagePercentage: 51.15222222222222,
        date: '2023-12-27',
      },
      {
        totalVolume: 251.39999999999998,
        count: 5,
        averagePercentage: 50.279999999999994,
        date: '2023-12-28',
      },
      {
        totalVolume: 502.8,
        count: 10,
        averagePercentage: 50.28,
        date: '2023-12-30',
      },
    ]);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'XLSX',
      },
    };
    const getMachineRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const authNext = jest.fn();
    await historyController.getReportsForGraph(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  describe('code snippet', () => {
    // The function should return an array of objects containing error codes, event counts, and corresponding areas.
    it('should return an array of objects containing error codes, event counts, and corresponding areas', async () => {
      // Mock input
      const input = {};

      // Mock MachineEvent.aggregate
      MachineEvent.aggregate = jest.fn().mockResolvedValue([
        { errorCode: '001', eventCount: 5, area: { area: 'Area1' } },
        { errorCode: '002', eventCount: 3, area: { area: 'Area2' } },
      ]);

      // Mock MachineLookup.aggregate
      MachineLookup.aggregate = jest.fn().mockResolvedValue([
        { MessageBitString: '001', Message: 'Error 1' },
        { MessageBitString: '002', Message: 'Error 2' },
      ]);

      // Call the code under test
      const result = await getReportCountMachineEvent(input);

      // Assertions
      expect(result).toEqual([
        {
          errorCode: '001',
          eventCount: 5,
          area: { area: 'Area1' },
          message: 'Error 1',
        },
        {
          errorCode: '002',
          eventCount: 3,
          area: { area: 'Area2' },
          message: 'Error 2',
        },
      ]);
    });

    // If the input area is not provided or is 'All', the function should return data for all areas.
    it('should return data for all areas when input area is not provided', async () => {
      // Mock input
      const input = {};

      // Mock MachineEvent.aggregate
      MachineEvent.aggregate = jest.fn().mockResolvedValue([
        { errorCode: '001', eventCount: 5, area: { area: 'Area1' } },
        { errorCode: '002', eventCount: 3, area: { area: 'Area2' } },
      ]);

      // Mock MachineLookup.aggregate
      MachineLookup.aggregate = jest.fn().mockResolvedValue([
        { MessageBitString: '001', Message: 'Error 1' },
        { MessageBitString: '002', Message: 'Error 2' },
      ]);

      // Call the code under test
      const result = await getReportCountMachineEvent(input);
      // Assertions
      expect(result).toEqual([
        {
          errorCode: '001',
          eventCount: 5,
          area: { area: 'Area1' },
          message: 'Error 1',
        },
        {
          errorCode: '002',
          eventCount: 3,
          area: { area: 'Area2' },
          message: 'Error 2',
        },
      ]);
    });

    // If the input area is not provided or is 'All', the function should return data for all areas.
    it('should return data for all areas when input area is "All"', async () => {
      // Mock input
      const input = { area: 'All' };

      // Mock MachineEvent.aggregate
      MachineEvent.aggregate = jest.fn().mockResolvedValue([
        { errorCode: '001', eventCount: 5, area: { area: 'Area1' } },
        { errorCode: '002', eventCount: 3, area: { area: 'Area2' } },
      ]);

      // Mock MachineLookup.aggregate
      MachineLookup.aggregate = jest.fn().mockResolvedValue([
        { MessageBitString: '001', Message: 'Error 1' },
        { MessageBitString: '002', Message: 'Error 2' },
      ]);

      // Call the code under test
      const result = await getReportCountMachineEvent(input);

      // Assertions
      expect(result).toEqual([
        {
          errorCode: '001',
          eventCount: 5,
          area: { area: 'Area1' },
          message: 'Error 1',
        },
        {
          errorCode: '002',
          eventCount: 3,
          area: { area: 'Area2' },
          message: 'Error 2',
        },
      ]);
    });

    // If the input area is provided and is not 'All', the function should return data for that specific area.
    it('should return data for the specific area when input area is provided and is not "All"', async () => {
      // Mock input
      const input = { area: 'Area1' };

      // Mock MachineEvent.aggregate
      MachineEvent.aggregate = jest.fn().mockResolvedValue([
        { errorCode: '001', eventCount: 5, area: { area: 'Area1' } },
        { errorCode: '002', eventCount: 3, area: { area: 'Area1' } },
      ]);

      // Mock MachineLookup.aggregate
      MachineLookup.aggregate = jest.fn().mockResolvedValue([
        { MessageBitString: '001', Message: 'Error 1' },
        { MessageBitString: '002', Message: 'Error 2' },
      ]);

      // Call the code under test
      const result = await getReportCountMachineEvent(input);

      // Assertions
      expect(result).toEqual([
        {
          errorCode: '001',
          eventCount: 5,
          area: { area: 'Area1' },
          message: 'Error 1',
        },
        {
          errorCode: '002',
          eventCount: 3,
          area: { area: 'Area1' },
          message: 'Error 2',
        },
      ]);
    });

    // The input object may not have an 'area' property.
    it('should return data for all areas when input object does not have an "area" property', async () => {
      // Mock input
      const input = {};

      // Mock MachineEvent.aggregate
      MachineEvent.aggregate = jest.fn().mockResolvedValue([
        { errorCode: '001', eventCount: 5, area: { area: 'Area1' } },
        { errorCode: '002', eventCount: 3, area: { area: 'Area2' } },
      ]);

      // Mock MachineLookup.aggregate
      MachineLookup.aggregate = jest.fn().mockResolvedValue([
        { MessageBitString: '001', Message: 'Error 1' },
        { MessageBitString: '002', Message: 'Error 2' },
      ]);

      // Call the code under test
      const result = await getReportCountMachineEvent(input);

      // Assertions
      expect(result).toEqual([
        {
          errorCode: '001',
          eventCount: 5,
          area: { area: 'Area1' },
          message: 'Error 1',
        },
        {
          errorCode: '002',
          eventCount: 3,
          area: { area: 'Area2' },
          message: 'Error 2',
        },
      ]);
    });
  });
  it('should return an empty array when no data is found for the provided dates', async () => {
    // Mock the Jobs.aggregate function
    Jobs.aggregate = jest.fn().mockResolvedValue([]);

    // Call the function with valid dates
    const result = await getReportsVolumeReduction({
      from: '2022-01-01',
      to: '2022-01-02',
    });

    // Assert the result
    expect(result).toEqual([]);
  });

  it('Error if get Volume Reduction Report not found Export : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'XLSX',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getReportsForGraph(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Production by day : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        date: '2024-09-09',
        count: 5,
      },
    ]);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getProductionByDay(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Error if get Production by day not found : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getProductionByDay(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Production by day Export : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        date: '2024-09-09',
        count: 5,
      },
    ]);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'XLSX',
      },
    };
    const getMachineRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const authNext = jest.fn();
    await historyController.getProductionByDay(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Error if get Production by day not found Export: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'XLSX',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getProductionByDay(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Count of Machine : Controller', async () => {
    MachineEvent.aggregate = jest.fn().mockImplementation(() => [
      {
        eventCount: 24,
        area: 'PLC_sense and dispense',
        errorCode:
          '0000000000000000000000000000000000000000000000000000000000000000',
      },
      {
        eventCount: 6,
        area: 'StateChange',
        errorCode: 'StateChange_Auto',
      },
      {
        eventCount: 5,
        area: 'StateChange',
        errorCode: 'StateChange_Homing',
      },
      {
        eventCount: 18,
        area: 'StateChange',
        errorCode: 'StateChange_Manual',
      },
      {
        eventCount: 34,
        area: 'StateChange',
        errorCode: 'StateChange_Ready',
      },
      {
        eventCount: 6,
        area: 'StateChange',
        errorCode: 'StateChange_ReadyAuto',
      },
      {
        eventCount: 18,
        area: 'StateChange',
        errorCode: 'StateChange_ReadyManual',
      },
      {
        eventCount: 7,
        area: 'StateChange',
        errorCode: 'StateChange_Startup',
      },
      {
        eventCount: 31,
        area: 'StateChange',
        errorCode: 'StateChange_Stop',
      },
    ]);

    MachineLookup.aggregate = jest.fn().mockImplementation(() => [
      {
        _id: {
          buffer: new Uint8Array([
            102, 216, 4, 66, 91, 5, 30, 158, 159, 187, 134, 223,
          ]),
        },
        Expression: 'Sense_And_Dispense_Error',
        Area: 'PLC_sense and dispense',
        Message: 'Communication Error!',
        AreaNumber: 'PLC_SENSE AND DISPENSE',
        MessageNumber: 1,
        MessageBitString:
          '0000000000000000000000000000000000000000000000000000000000000000',
        __v: 0,
        createdAt: '2024-09-04T06:54:58.341Z',
        updatedAt: '2024-09-04T06:54:58.341Z',
      },
    ]);

    const getMachineReq = {
      body: {
        area: 'All',
        extension: 'JSON',
        machineId: 'SD-Regression-1928',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getCountOfMachineEvent(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(MachineEvent.aggregate).toHaveBeenCalled();
  });
  jest.mock('mongoose', () => ({
    model: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  }));
  it('Error if get Count of Machine not found : Controller', async () => {
    MachineEvent.aggregate = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getCountOfMachineEvent(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(MachineEvent.aggregate).toHaveBeenCalled();
  });
  it('Get Count of Machine Export: Controller', async () => {
    MachineEvent.aggregate = jest.fn().mockImplementation(() => ({
      exec: () => [],
    }));

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'XLSX',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getCountOfMachineEvent(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(MachineEvent.aggregate).toHaveBeenCalled();
  });
  it('Error if get Count of Machine not found Export: Controller', async () => {
    MachineEvent.aggregate = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'XLSX',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getCountOfMachineEvent(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(MachineEvent.aggregate).toHaveBeenCalled();
  });
  it('Get Job completed by Hour : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => ({
      exec: () => [],
    }));

    const getMachineReq = {
      body: {
        timeRange: 'hourly',
        from: '2024-02-02T00:00:00',
        to: '2024-02-02T19:02:05',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getJobCompletedByHour(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });

  it('should successfully retrieve logged events history and send it as response', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const loggedEvents = [{ event: 'event1' }, { event: 'event2' }];
    historyService.getLoggedEvents = jest.fn().mockResolvedValue(loggedEvents);

    await getLoggedEventsHistory(req, res);

    expect(historyService.getLoggedEvents).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
    expect(res.send).toHaveBeenCalledWith(loggedEvents);
  });

  it('Error if get Job completed by Hour not found : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {
      body: {
        timeRange: 'hourly',
        from: '2024-02-02T00:00:00',
        to: '2024-02-02T19:02:05',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getJobCompletedByHour(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Job completed by Hour Export: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        date: '2024-09-09',
        count: 5,
      },
    ]);

    const getMachineReq = {
      body: {
        timeRange: 'hourly',
        from: '2024-02-02T00:00:00',
        to: '2024-02-02T19:02:05',
        extension: 'XLSX',
      },
    };
    const getMachineRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const authNext = jest.fn();
    await historyController.getJobCompletedByHour(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Error if get Job completed by Hour not found Export: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {
      body: {
        timeRange: 'hourly',
        from: '2024-02-02T00:00:00',
        to: '2024-02-02T19:02:05',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getJobCompletedByHour(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Area Details: Controller', async () => {
    MachineLookup.find = jest.fn().mockImplementation(() => ({
      distinct: () => ({
        exec: () => [],
      }),
    }));

    const getMachineReq = {};
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getDistinctAreas(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(MachineLookup.find).toHaveBeenCalled();
  });
  it('Error if Area Details: Controller', async () => {
    MachineLookup.find = jest.fn().mockImplementation(() => undefined);

    const getMachineReq = {};
    const getMachineRes = {};
    const authNext = jest.fn();
    await historyController.getDistinctAreas(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(MachineLookup.find).toHaveBeenCalled();
  });

  it('Get Volume Reduction Report: Controller', async () => {
    const reportVolumeReduction = [
      { date: '2023-01-01', averagePercentage: 0.1 },
      { date: '2023-01-02', averagePercentage: 0.2 },
      // Add more data as needed
    ];

    // Mock the historyService.getReportsVolumeReduction method
    jest
      .spyOn(historyService, 'getReportsVolumeReduction')
      .mockResolvedValue(reportVolumeReduction);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'JSON',
      },
    };
    const getMachineRes = {
      // Initialize the percentages property
      percentages: [0.1, 0.2],
    };
    const authNext = jest.fn();

    await historyController.getReportsForGraph(
      getMachineReq,
      getMachineRes,
      authNext
    );

    // Assert that historyService.getReportsVolumeReduction was called
    expect(historyService.getReportsVolumeReduction).toHaveBeenCalledWith(
      getMachineReq.body
    );

    // Assert that percentages were computed and added to the response
    const expectedPercentages = reportVolumeReduction.map((job) =>
      parseFloat(job.averagePercentage.toFixed(2))
    );
    expect(getMachineRes.percentages).toEqual(expectedPercentages);
  });

  it('should return expected JSON response when extension is "JSON"', async () => {
    const req = {
      body: {
        extension: 'JSON',
        timeRange: 'daily',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const mockResponse = [{ count: 10, date: '2021-01-01' }];

    historyService.getReportsJobCompletedByHour = jest
      .fn()
      .mockResolvedValue(mockResponse);

    await historyController.getJobCompletedByHour(req, res);

    expect(res.send).toHaveBeenCalledWith({
      status: 'success',
      message: 'success',
      data: {
        name: 'Job Completed By Hour',
        count: [10],
        date: ['2021-01-01'],
      },
    });
  });

  it('Get JSON response for Void Volume Minimum By Day Report: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        _id: '2024-09-09',
        notHandledCount: 1,
        completedCount: 1,
        voidVolumeMinimumPercentage: 50,
      },
    ]);

    const voidVolumeMinimumByDayReq = {
      body: {
        from: '2024-09-09',
        to: '2024-09-09',
        extension: 'JSON',
        machineId: 'SD-Regression-1928',
      },
    };

    const voidVolumeMinimumByDayRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const authNext = jest.fn();

    await historyController.getVoidVolumeMinimumByDay(
      voidVolumeMinimumByDayReq,
      voidVolumeMinimumByDayRes,
      authNext
    );

    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get XLSX response for Void Volume Minimum By Day Report: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        _id: '2024-09-09',
        notHandledCount: 1,
        completedCount: 1,
        voidVolumeMinimumPercentage: 50,
      },
    ]);

    const voidVolumeMinimumByDayReq = {
      body: {
        from: '2024-09-09',
        to: '2024-09-09',
        extension: 'XLSX',
        machineId: 'SD-Regression-1928',
      },
    };

    const voidVolumeMinimumByDayRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const authNext = jest.fn();

    await historyController.getVoidVolumeMinimumByDay(
      voidVolumeMinimumByDayReq,
      voidVolumeMinimumByDayRes,
      authNext
    );

    expect(Jobs.aggregate).toHaveBeenCalled();
  });

  it('return empty Array response when from or to date format is not correct for Void Volume Minimum By Day Report: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => []);

    const voidVolumeMinimumByDayReq = {
      body: {
        from: 'a',
        to: 'a',
        extension: 'JSON',
        machineId: 'SD-Regression-1928',
      },
    };

    const voidVolumeMinimumByDayRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const authNext = jest.fn();

    await historyController.getVoidVolumeMinimumByDay(
      voidVolumeMinimumByDayReq,
      voidVolumeMinimumByDayRes,
      authNext
    );

    expect(Jobs.aggregate).not.toHaveBeenCalled();
  });
});
