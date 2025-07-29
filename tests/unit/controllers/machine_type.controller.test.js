const httpStatus = require('http-status');
const { machineTypeLookupController } = require('../../../src/controllers');
const { MachineType, ConfigMachine, WMS } = require('../../../src/models');
const { machineTypeLookupService } = require('../../../src/services');
const { MACHINE_TYPE } = require('../../../src/config/constants');
const ApiError = require('../../../src/utils/ApiError');
const service = require('../../../src/services');
const { deleteMachineType, getMachineTypesById } = service;

describe('Machine Type Controller', () => {
  it('Get All Machine Type Data : Controller', async () => {
    MachineType.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        limit: () => ({
          skip: () => ({
            exec: () => ({
              machineTypeData: [
                {
                  machineType: 'pregis box sizer',
                  description: 'this machine is autmatically cut the box',
                  createdBy: '6593f61758ec983208c4ed05',
                  id: '65c4bbc9f0a7205a88499060',
                },
              ],
              rowsPerPage: 10,
              totalPages: 0,
              currentPage: 1,
              totalRecords: 0,
            }),
          }),
        }),
      }),
    }));

    MachineType.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });

    const getMachineTypeReq = {
      body: {
        pagination: {
          page: 3,
          limit: 2,
        },
      },
    };
    const getMachineTypeRes = {};
    const authNext = jest.fn();
    await machineTypeLookupController.getAllMachineTypes(
      getMachineTypeReq,
      getMachineTypeRes,
      authNext
    );
    expect(MachineType.find).toHaveBeenCalled();
  });

  it('Get Machine Type Data By Id: Controller', async () => {
    MachineType.findById = jest.fn().mockImplementation(() => ({
      machineType: 'pregis box sizer',
      description: 'this machine is autmatically cut the box',
      createdBy: '6593f61758ec983208c4ed05',
      id: '65c4bbc9f0a7205a88499060',
    }));

    const getMachineTypeReq = {
      params: { machineTypeId: '12345' },
    };
    const getMachineTypeRes = {};
    const authNext = jest.fn();
    await machineTypeLookupController.getMachineTypesById(
      getMachineTypeReq,
      getMachineTypeRes,
      authNext
    );
    expect(MachineType.findById).toHaveBeenCalled();
  });

  it('Create machine type data: Controller', async () => {
    MachineType.create = jest.fn().mockImplementation(() => ({
      message: 'machine type created successfully',
    }));

    const getMachineTypeReq = {
      body: {
        machineType: 'pregis box sizer',
        description: 'this machine is autmatically cut the box',
        createdBy: '6593f61758ec983208c4ed05',
        id: '65c4bbc9f0a7205a88499060',
      },
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getUserRes = { status: mockStatus };
    const authNext = jest.fn();
    await machineTypeLookupController.createMachineType(
      getMachineTypeReq,
      getUserRes,
      authNext
    );
    expect(MachineType.create).toHaveBeenCalled();
  });

  it('Error if machine type is not exists createMachineType Controller', async () => {
    MachineType.create = jest.fn().mockImplementation(() => undefined);

    const getUserReq = {
      body: {
        machineType: 'pregis box sizer',
        description: 'this machine is autmatically cut the box',
        createdBy: '6593f61758ec983208c4ed05',
        id: '65c4bbc9f0a7205a88499060',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await machineTypeLookupController.createMachineType(
      getUserReq,
      getUserRes,
      authNext
    );

    expect(MachineType.create).toHaveBeenCalled();
  });

  it('Update machine type data: Controller', async () => {
    MachineType.findById = jest.fn().mockImplementation(() => ({
      machineType: 'pregis box sizer',
      description: 'this machine is autmatically cut the box',
      createdBy: '6593f61758ec983208c4ed05',
      id: '65c4bbc9f0a7205a88499060',
      save: jest.fn().mockImplementation(() => ({
        message: 'machine type updated successfully',
      })),
    }));

    const getMachineTypeReq = {
      params: { machineTypeId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineType: 'pregis box sizer',
        description: 'this machine is autmatically cut the box',
        createdBy: '6593f61758ec983208c4ed05',
        id: '65c4bbc9f0a7205a88499060',
      },
    };
    const getMachineTypeRes = {};
    const authNext = jest.fn();
    await machineTypeLookupController.updateMachineType(
      getMachineTypeReq,
      getMachineTypeRes,
      authNext
    );
    expect(MachineType.findById).toHaveBeenCalled();
  });

  it('Error if machine type is not exists for updateMachineType Controller', async () => {
    MachineType.findById = jest.fn().mockImplementation(() => undefined);

    const getMachineTypeReq = {
      params: { machineTypeId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineType: 'pregis box sizer',
        description: 'this machine is autmatically cut the box',
        createdBy: '6593f61758ec983208c4ed05',
        id: '65c4bbc9f0a7205a88499060',
      },
    };
    const getMachineTypeRes = {};
    const authNext = jest.fn();
    await machineTypeLookupController.updateMachineType(
      getMachineTypeReq,
      getMachineTypeRes,
      authNext
    );
    expect(MachineType.findById).toHaveBeenCalled();
  });

  it('Delete machine type data: Controller', async () => {
    MachineType.findById = jest.fn().mockImplementation(() => ({
      machineType: 'pregis box sizer',
      description: 'this machine is autmatically cut the box',
      createdBy: '6593f61758ec983208c4ed05',
      id: '65c4bbc9f0a7205a88499060',
    }));

    MachineType.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'Machine type deleted successfuly',
    }));

    const getMachineTypeReq = {
      params: { machineTypeId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineType: 'pregis box sizer',
        description: 'this machine is autmatically cut the box',
        createdBy: '6593f61758ec983208c4ed05',
        id: '65c4bbc9f0a7205a88499060',
      },
    };
    const getMachineTypeRes = {};
    const authNext = jest.fn();
    await machineTypeLookupController.deleteMachineType(
      getMachineTypeReq,
      getMachineTypeRes,
      authNext
    );
    expect(MachineType.findById).toHaveBeenCalled();
  });

  it('Error if machine type is not exists for deleteMachineType Controller', async () => {
    MachineType.findById = jest.fn().mockImplementation(() => undefined);

    MachineType.deleteOne = jest.fn().mockImplementation(() => ({
      message: 'Machine type deleted successfuly',
    }));

    const getMachineTypeReq = {
      params: { machineTypeId: '65c4bbc9f0a7205a88499060' },
      body: {
        machineType: 'pregis box sizer',
        description: 'this machine is autmatically cut the box',
        createdBy: '6593f61758ec983208c4ed05',
        id: '65c4bbc9f0a7205a88499060',
      },
    };
    const getMachineTypeRes = {};
    const authNext = jest.fn();
    await machineTypeLookupController.deleteMachineType(
      getMachineTypeReq,
      getMachineTypeRes,
      authNext
    );
    expect(MachineType.findById).toHaveBeenCalled();
  });

  describe('DELETE /v1/config-machine-type/:id', () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        params: { machineTypeId: 'abc123' },
        body: { machineType: 'Foo' },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      jest.clearAllMocks();
    });
    const svc = machineTypeLookupService.deleteMachineType;

    it('200 → calls service, returns MT_DELETE', async () => {
      machineTypeLookupService.deleteMachineType = jest
        .fn()
        .mockResolvedValue({});
      await machineTypeLookupController.deleteMachineType(req, res);
      expect(machineTypeLookupService.deleteMachineType).toHaveBeenCalledWith(
        'abc123'
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({
        message: MACHINE_TYPE.MT_DELETE('abc123'),
      });
    });

    it('400 → service throws ApiError(400) → echoes error.message', async () => {
      const err = new ApiError(httpStatus.BAD_REQUEST, 'can’t delete');
      machineTypeLookupService.deleteMachineType = jest
        .fn()
        .mockRejectedValue(err);

      await machineTypeLookupController.deleteMachineType(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'can’t delete',
      });
    });

    it('404 → service throws ApiError(404) → returns MT_NOT_FOUND', async () => {
      const err = new ApiError(httpStatus.NOT_FOUND, 'nope');
      machineTypeLookupService.deleteMachineType = jest
        .fn()
        .mockRejectedValue(err);

      await machineTypeLookupController.deleteMachineType(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: MACHINE_TYPE.MT_NOT_FOUND('abc123'),
      });
    });

    it('500 → unexpected error → returns MT_INTERNAL_SERVER_ERROR', async () => {
      machineTypeLookupService.deleteMachineType = jest
        .fn()
        .mockRejectedValue(new Error('boom'));

      await machineTypeLookupController.deleteMachineType(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR,
      });
    });

    it('200 and calls deleteOne when no machines exist', async () => {
      MachineType.findById = jest.fn().mockReturnValue({
        lean: () => Promise.resolve({ machineType: 'FooType' }),
      });

      ConfigMachine.find = jest.fn().mockReturnValue({
        lean: () => Promise.resolve([]),
      });

      WMS.find = jest.fn().mockReturnValue({
        lean: () => Promise.resolve([]),
      });
      MachineType.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
      await expect(svc('abc123')).resolves.toEqual({ deletedCount: 1 });
      expect(MachineType.deleteOne).toHaveBeenCalledWith({ _id: 'abc123' });
    });

    it('turns any non-ApiError into a 500 + MT_INTERNAL_SERVER_ERROR', async () => {
      // service throws a plain Error (no statusCode)
      machineTypeLookupService.deleteMachineType = jest
        .fn()
        .mockRejectedValue(new Error('unexpected'));

      await machineTypeLookupController.deleteMachineType(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR,
      });
    });

    it('GET ALL → 500 on service error', async () => {
      svc.getAllMachineTypes = jest.fn().mockRejectedValue(new Error('err'));

      await machineTypeLookupController.getAllMachineTypes(req, res);
      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        status: 'error',
        message: MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR,
      });
    });

    describe('deleteMachineType service', () => {
      const svc = machineTypeLookupService.deleteMachineType;
      const id = 'abc123';
      const typeName = 'FooType';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should delete when no dependencies exist', async () => {
        jest
          .spyOn(MachineType, 'findById')
          .mockResolvedValue({ _id: id, machineType: typeName });
        jest
          .spyOn(ConfigMachine, 'find')
          .mockReturnValue({ lean: () => Promise.resolve([]) });
        jest
          .spyOn(WMS, 'find')
          .mockReturnValue({ lean: () => Promise.resolve([]) });
        jest
          .spyOn(MachineType, 'deleteOne')
          .mockResolvedValue({ deletedCount: 1 });

        await expect(svc(id)).resolves.toEqual({ deletedCount: 1 });
        expect(MachineType.deleteOne).toHaveBeenCalledWith({ _id: id });
      });

      it('throws BAD_REQUEST when only machines exist', async () => {
        jest
          .spyOn(MachineType, 'findById')
          .mockResolvedValue({ _id: id, machineType: typeName });
        jest
          .spyOn(ConfigMachine, 'find')
          .mockReturnValue({
            lean: () =>
              Promise.resolve([{ machineName: 'M1' }, { machineName: 'M2' }]),
          });
        jest
          .spyOn(WMS, 'find')
          .mockReturnValue({ lean: () => Promise.resolve([]) });

        const expectedMsg = MACHINE_TYPE.MT_DETACH_DEPENDENCIES(
          typeName,
          'Machine: M1, M2'
        );
        await expect(svc(id)).rejects.toMatchObject({
          statusCode: httpStatus.BAD_REQUEST,
          message: expectedMsg,
        });
      });

      it('throws BAD_REQUEST when only WMS exist', async () => {
        jest
          .spyOn(MachineType, 'findById')
          .mockResolvedValue({ _id: id, machineType: typeName });
        jest
          .spyOn(ConfigMachine, 'find')
          .mockReturnValue({ lean: () => Promise.resolve([]) });
        jest
          .spyOn(WMS, 'find')
          .mockReturnValue({
            lean: () => Promise.resolve([{ wmsName: 'W1' }, { wmsName: 'W2' }]),
          });

        const expectedMsg = MACHINE_TYPE.MT_DETACH_DEPENDENCIES(
          typeName,
          'WMS: W1, W2'
        );
        await expect(svc(id)).rejects.toMatchObject({
          statusCode: httpStatus.BAD_REQUEST,
          message: expectedMsg,
        });
      });

      it('throws BAD_REQUEST when both machines and WMS exist', async () => {
        jest
          .spyOn(MachineType, 'findById')
          .mockResolvedValue({ _id: id, machineType: typeName });
        jest
          .spyOn(ConfigMachine, 'find')
          .mockReturnValue({
            lean: () => Promise.resolve([{ machineName: 'M1' }]),
          });
        jest
          .spyOn(WMS, 'find')
          .mockReturnValue({
            lean: () => Promise.resolve([{ wmsName: 'W1' }]),
          });

        const expectedMsg = MACHINE_TYPE.MT_DETACH_DEPENDENCIES(
          typeName,
          'Machine: M1 & WMS: W1'
        );
        await expect(svc(id)).rejects.toMatchObject({
          statusCode: httpStatus.BAD_REQUEST,
          message: expectedMsg,
        });
      });

      it('throws NOT_FOUND when the machine type does not exist', async () => {
        jest.spyOn(MachineType, 'findById').mockResolvedValue(null);
        await expect(svc(id)).rejects.toMatchObject({
          statusCode: httpStatus.NOT_FOUND,
          message: 'Machine type configuration not found',
        });
      });

      it('propagates unexpected errors', async () => {
        jest
          .spyOn(MachineType, 'findById')
          .mockRejectedValue(new Error('boom'));
        await expect(svc(id)).rejects.toThrow('boom');
      });
    });
  });
});
