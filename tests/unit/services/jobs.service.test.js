const jobService = require('../../../src/services/jobs.service'); // Adjust the path
const { Jobs } = require('../../../src/models');
const {
  getMachineGroupByName,
} = require('../../../src/services/config_machine_group.service');
const commonUtils = require('../../../src/utils/common');

jest.mock('../../../src/models', () => ({
  Jobs: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
    distinct: jest.fn(),
  },
}));

jest.mock('../../../src/config/logger');
jest.mock('../../../src/services/config_machine_group.service');
jest.mock('../../../src/utils/common');

describe('Job Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getJob', () => {
    it('should return paginated job data', async () => {
      const mockOptions = {
        pagination: {
          pageLimit: 10,
          pageSize: 1,
        },
        filters: {
          Barcode: '12345',
          productionStatus: 'TODO',
        },
      };

      const mockJobs = [{ jobId: 'job1' }, { jobId: 'job2' }];
      Jobs.countDocuments.mockResolvedValue(2);
      Jobs.find.mockReturnValue({
        select: () => ({
          limit: () => ({
            skip: () => ({
              sort: () => ({
                exec: jest.fn().mockResolvedValue(mockJobs),
              }),
            }),
          }),
        }),
      });

      const result = await jobService.getJob(mockOptions, '', '/api/jobs');

      expect(Jobs.countDocuments).toHaveBeenCalled();
      expect(Jobs.find).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          job: mockJobs,
          rowsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
          totalRecords: 2,
        })
      );
    });
  });

  describe('getJobById', () => {
    it('should return job data with conversion applied', async () => {
      const req = {
        params: { id: 'abc123' },
        body: {
          filters: { Barcode: 'XYZ' },
          conversionFactor: {
            dimension: 2,
          },
        },
      };

      const mockJob = {
        _id: 'abc123',
        paperLengthDispensed: 100,
        volumeReductionPercent: 25,
        nested: [{ paperLengthDispensed: 100 }],
      };

      Jobs.findOne.mockReturnValue({
        select: () => ({
          lean: jest.fn().mockResolvedValue(mockJob),
        }),
      });

      commonUtils.checkFieldCategory.mockReturnValue('dimension');
      commonUtils.getConversionFactor.mockReturnValue(2);
      commonUtils.applyConversion.mockImplementation((val) => val * 2);

      const result = await jobService.getJobById(req);

      expect(result.paperLengthDispensed).toBe(200);
    });
  });

  describe('getPercentageVolume', () => {
    it('should calculate average volume reduction percent', async () => {
      Jobs.aggregate.mockResolvedValue([{ totalVolume: 80, count: 4 }]);
      commonUtils.convertDateToTimeRange.mockReturnValue({
        startTime: new Date(),
        endTime: new Date(),
      });

      const result = await jobService.getPercentageVolume({ machineId: 'm1' });

      expect(result).toBe(20); // 80 / 4
    });

    it('should return 0 if no data', async () => {
      Jobs.aggregate.mockResolvedValue([]);

      const result = await jobService.getPercentageVolume({ machineId: 'm1' });

      expect(result).toBe(0);
    });
  });

  describe('getJobCount', () => {
    it('should return aggregated job count', async () => {
      const mockResult = [{ _id: 'TODO', count: 3 }];
      Jobs.aggregate.mockResolvedValue(mockResult);

      const result = await jobService.getJobCount({
        date: new Date(),
        machineId: 'm1',
      });

      expect(result).toEqual(mockResult);
    });

    it('should return zero count array if no results', async () => {
      Jobs.aggregate.mockResolvedValue([]);
      Jobs.distinct.mockResolvedValue(['TODO', 'COMPLETED']);

      const result = await jobService.getJobCount({
        date: new Date(),
        machineId: 'm1',
      });

      expect(result).toEqual([
        { _id: 'TODO', count: 0 },
        { _id: 'COMPLETED', count: 0 },
      ]);
    });
  });

  describe('jobImportCheck', () => {
    it('should return job import count for a machine group', async () => {
      const data = {
        machineGroup: 'GroupA',
        dateFrom: new Date(),
      };

      getMachineGroupByName.mockResolvedValue({
        machines: [{ machineId: 'm1' }, { machineId: 'm2' }],
      });

      Jobs.countDocuments.mockResolvedValue(5);

      const result = await jobService.jobImportCheck(data);

      expect(result).toBe(5);
      expect(getMachineGroupByName).toHaveBeenCalledWith('GroupA');
    });
  });

  describe('getAirPillowDispensed', () => {
    it('should return aggregated air pillow data', async () => {
      Jobs.aggregate.mockResolvedValue([
        {
          averageVolume: 20,
          totalVolume: 100,
        },
      ]);

      const result = await jobService.getAirPillowDispensed({
        machineId: 'm1',
      });

      expect(result).toEqual({ average: 20, total: 100 });
    });

    it('should return zeroes if no data', async () => {
      Jobs.aggregate.mockResolvedValue([]);

      const result = await jobService.getAirPillowDispensed({
        machineId: 'm1',
      });

      expect(result).toEqual({ average: 0, total: 0 });
    });
  });
});
