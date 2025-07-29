const {
  airPillowSenseAndDispenseHistoryController,
} = require('../../../../../src/controllers');
const { Jobs } = require('../../../../../src/models');

jest.mock('../../../../../src/models/machine_event.model');
jest.mock('../../../../../src/models/machine_lookup.model');
jest.mock('../../../../../src/models/jobs.model.js');

/* eslint-disable */

describe('History Controller - Sense And Dispense - Air Pillow', () => {
  beforeEach(() => {
    options = {
      pagination: { pageLimit: 10, page: 1 },
      filters: {},
    };
  });
  it('Get Air Pillows Dispensed By Timerange Report : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        totalAirPillowsDispensed: 55,
        date: '2024-08-14T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 45,
        date: '2024-08-15T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 5,
        date: '2024-08-16T10:17:24.745Z',
      },
    ]);

    const getMachineReq = {
      body: {
        from: '2020-08-13',
        to: '2030-08-16',
        extension: 'JSON',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Error if Get Air Pillows Dispensed By Timerange Report  not found : Controller', async () => {
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
    await airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Air Pillows Dispensed By Timerange Report Export: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        totalAirPillowsDispensed: 55,
        date: '2024-08-14T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 45,
        date: '2024-08-15T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 5,
        date: '2024-08-16T10:17:24.745Z',
      },
    ]);

    const getMachineReq = {
      body: {
        from: '2020-11-20',
        to: '2030-11-30',
        extension: 'XLSX',
      },
    };
    const getMachineRes = {};
    const authNext = jest.fn();
    await airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Error if Get Air Pillows Dispensed By Timerange Report not found Export : Controller', async () => {
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
    await airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Air Pillows Dispensed By Timerange Report - by Hour : Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        totalAirPillowsDispensed: 55,
        date: '2024-08-14T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 45,
        date: '2024-08-15T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 5,
        date: '2024-08-16T10:17:24.745Z',
      },
    ]);

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
    await airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Air Pillows Dispensed By Timerange Report - by Hour for XLSX: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        totalAirPillowsDispensed: 55,
        date: '2024-08-14T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 45,
        date: '2024-08-15T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 5,
        date: '2024-08-16T10:17:24.745Z',
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
    const getMachineRes = {};
    const authNext = jest.fn();
    await airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Error if Get Air Pillows Dispensed By Timerange Report - by Hour not found : Controller', async () => {
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
    await airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
  it('Get Air Pillows Dispensed By Timerange Report - by Hour Export: Controller', async () => {
    Jobs.aggregate = jest.fn().mockImplementation(() => [
      {
        totalAirPillowsDispensed: 55,
        date: '2024-08-14T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 45,
        date: '2024-08-15T10:17:24.745Z',
      },
      {
        totalAirPillowsDispensed: 5,
        date: '2024-08-16T10:17:24.745Z',
      },
    ]);

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
    await airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(Jobs.aggregate).toHaveBeenCalled();
  });
});
