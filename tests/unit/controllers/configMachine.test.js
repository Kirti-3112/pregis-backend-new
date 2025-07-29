const httpStatus = require('http-status');
const { configMachineController } = require('../../../src/controllers');
const ConfigMachineModel = require('../../../src/models/config_machine.model');
const ApiError = require('../../../src/utils/ApiError');
const configService = require('../../../src/services/config_machine.service');
const { ConfigMachine, ConfigMachineLookup } = require('../../../src/models');

describe('Config Machine Controller', () => {
  it('Get Config Machine Data : Controller', async () => {
    ConfigMachineModel.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        select: () => ({
          skip: () => ({
            limit: () => ({
              sort: () => ({
                exec: () => [
                  {
                    communicationType: 'MQTT',
                    machineName: 'PLCTEST01',
                    hostName: '127.0.0.1',
                    portNumber: 1883,
                    userName: '',
                    password:
                      '91d4a483cddba621f26621fae131821dfdf0f26dc9af0b9f34855ea93d586b92208710ff24257545f980d72025bc40e49ac9072f73b9f4853cc17646ae576e48e0130543b15518a564997a077a5725c6dbabb06b7c149a6fa9a6c91775e56f832e2fae64',
                    jobImportTopic: 'AAATEST/PLCJobData',
                    eventImportTopic: 'AAATEST/PLCEvents',
                    jobExportTopic: 'AAATEST/PLCOutput',
                    feature: 'Enable',
                    createdBy: '6593f61758ec983208c4ed05',
                    createdAt: '2024-02-29T07:00:18.833Z',
                    id: '65e02b8200611e6933b2de10',
                    machineType: {
                      machineType: 'pregis box sizer5',
                      description: 'this machine is autmatically cut the box',
                      jobImport: true,
                      jobExport: true,
                      wmsImport: true,
                      wmsExport: true,
                      barcode: true,
                      heartBeat: true,
                      createdBy: '6593f61758ec983208c4ed05',
                      createdAt: '2024-07-18T12:22:49.386Z',
                      updatedAt: '2024-07-18T12:22:49.386Z',
                      id: '669909196cd2304e65301862',
                    },
                  },
                ],
              }),
            }),
          }),
        }),
      }),
    }));

    ConfigMachineModel.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });
    const getmachineConfigReq = {
      body: {
        pagination: {
          page: 3,
          limit: 2,
        },
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getmachineConfigRes = { status: mockStatus };

    const getmachineConfigNext = jest.fn();
    await configMachineController.getConfigMachine(
      getmachineConfigReq,
      getmachineConfigRes,
      getmachineConfigNext
    );
    expect(ConfigMachineModel.find).toHaveBeenCalled();
  });

  it('Condition check Get Config Machine Data : Controller', async () => {
    ConfigMachineModel.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        select: () => ({
          skip: () => ({
            limit: () => ({
              sort: () => ({
                exec: () => ({ machineConfigData: [] }),
              }),
            }),
          }),
        }),
      }),
    }));

    ConfigMachineModel.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });
    const getmachineConfigReq = {
      body: {
        pagination: {
          page: 3,
          limit: 2,
        },
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getmachineConfigRes = { status: mockStatus };

    const getmachineConfigNext = jest.fn();
    await configMachineController.getConfigMachine(
      getmachineConfigReq,
      getmachineConfigRes,
      getmachineConfigNext
    );
    expect(ConfigMachineModel.find).toHaveBeenCalled();
  });

  it('Error-500 Get Config Machine Data : Controller', async () => {
    ConfigMachineModel.find = jest.fn().mockImplementation(() => ({
      populate: () => ({
        select: () => ({
          skip: () => ({
            limit: () => ({
              sort: () => ({
                exec: () => {
                  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
                },
              }),
            }),
          }),
        }),
      }),
    }));

    ConfigMachineModel.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(1);
    });
    const getmachineConfigReq = {
      body: {
        pagination: {
          page: 3,
          limit: 2,
        },
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getmachineConfigRes = { status: mockStatus };

    const getmachineConfigNext = jest.fn();
    await configMachineController.getConfigMachine(
      getmachineConfigReq,
      getmachineConfigRes,
      getmachineConfigNext
    );
    expect(ConfigMachineModel.find).toHaveBeenCalled();
  });

  it('Get Config Machine Data By Id: Controller', async () => {
    ConfigMachineModel.findById = jest.fn().mockImplementation(() => ({
      populate: () => ({
        communicationType: 'MQTT',
        machineName: 'PLCTEST01',
        hostName: '127.0.0.1',
        portNumber: 1883,
        userName: '',
        password:
          '91d4a483cddba621f26621fae131821dfdf0f26dc9af0b9f34855ea93d586b92208710ff24257545f980d72025bc40e49ac9072f73b9f4853cc17646ae576e48e0130543b15518a564997a077a5725c6dbabb06b7c149a6fa9a6c91775e56f832e2fae64',
        jobImportTopic: 'AAATEST/PLCJobData',
        eventImportTopic: 'AAATEST/PLCEvents',
        jobExportTopic: 'AAATEST/PLCOutput',
        feature: 'Enable',
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-02-29T07:00:18.833Z',
        id: '65e02b8200611e6933b2de10',
        decryptPassword: jest.fn().mockImplementation(() => {
          return Promise.resolve('pass@12234');
        }),
      }),
    }));

    const getmachineConfigReq = {
      params: {
        configMachineId: '65df211a88d081ba71ef486a',
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getmachineConfigRes = { status: mockStatus };

    const getmachineConfigNext = jest.fn();
    await configMachineController.getConfigMachineById(
      getmachineConfigReq,
      getmachineConfigRes,
      getmachineConfigNext
    );
    expect(ConfigMachineModel.findById).toHaveBeenCalled();
  });

  it('Error-404 Get Config Machine Data By Id: Controller', async () => {
    ConfigMachineModel.findById = jest
      .fn()
      .mockImplementation(() => ({ populate: () => undefined }));

    const getmachineConfigReq = {
      params: {
        configMachineId: '65df211a88d081ba71ef486a',
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getmachineConfigRes = { status: mockStatus };

    const getmachineConfigNext = jest.fn();
    await configMachineController.getConfigMachineById(
      getmachineConfigReq,
      getmachineConfigRes,
      getmachineConfigNext
    );
    expect(ConfigMachineModel.findById).toHaveBeenCalled();
  });

  it('Error-500 Get Config Machine Data By Id: Controller', async () => {
    ConfigMachineModel.findById = jest.fn().mockImplementation(() => ({
      populate: () => {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
      },
    }));

    const getmachineConfigReq = {
      params: {
        configMachineId: '65df211a88d081ba71ef486a',
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getmachineConfigRes = { status: mockStatus };

    const getmachineConfigNext = jest.fn();
    await configMachineController.getConfigMachineById(
      getmachineConfigReq,
      getmachineConfigRes,
      getmachineConfigNext
    );
    expect(ConfigMachineModel.findById).toHaveBeenCalled();
  });

  it('Create Config Machine Controller', async () => {
    ConfigMachineModel.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const getUserReq = {
      body: {
        machine_name: 'TestMachine006',
        machine_type: 'HostName006',
        job_import_topic: 'HostName006',
        machine_import_topic: 'HostName006',
        output_topic: 'HostName006',
        email: 'HostName006',
        machineType: '669909196cd2304e65301862',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await configMachineController.createConfigMachine(
      getUserReq,
      getUserRes,
      authNext
    );

    expect(ConfigMachineModel.create).toHaveBeenCalled();
  });

  it('Error while Create Config Machine Controller', async () => {
    ConfigMachineModel.create = jest.fn().mockImplementation(() => undefined);

    const getUserReq = {
      body: {
        machine_name: 'TestMachine006',
        machine_type: 'HostName006',
        job_import_topic: 'HostName006',
        machine_import_topic: 'HostName006',
        output_topic: 'HostName006',
        email: 'HostName006',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await configMachineController.createConfigMachine(
      getUserReq,
      getUserRes,
      authNext
    );

    expect(ConfigMachineModel.create).toHaveBeenCalled();
  });

  it('Error-409 if Machine config already exists config machine Controller', async () => {
    ConfigMachineModel.create = jest.fn().mockImplementation(() => {
      throw new ApiError(httpStatus.CONFLICT);
    });

    const getUserReq = {
      body: {
        machine_name: 'TestMachine006',
        machine_type: 'HostName006',
        job_import_topic: 'HostName006',
        machine_import_topic: 'HostName006',
        output_topic: 'HostName006',
        email: 'HostName006',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await configMachineController.createConfigMachine(
      getUserReq,
      getUserRes,
      authNext
    );

    expect(ConfigMachineModel.create).toHaveBeenCalled();
  });

  it('Update Config Machine Controller', async () => {
    ConfigMachineModel.findById = jest.fn().mockImplementation(() => ({
      populate: () => ({
        communicationType: 'MQTT',
        machineName: 'PLCTEST01',
        hostName: '127.0.0.1',
        portNumber: 1883,
        userName: '',
        password:
          '91d4a483cddba621f26621fae131821dfdf0f26dc9af0b9f34855ea93d586b92208710ff24257545f980d72025bc40e49ac9072f73b9f4853cc17646ae576e48e0130543b15518a564997a077a5725c6dbabb06b7c149a6fa9a6c91775e56f832e2fae64',
        jobImportTopic: 'AAATEST/PLCJobData',
        eventImportTopic: 'AAATEST/PLCEvents',
        jobExportTopic: 'AAATEST/PLCOutput',
        feature: 'Enable',
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-02-29T07:00:18.833Z',
        id: '65e02b8200611e6933b2de10',
        decryptPassword: jest.fn().mockImplementation(() => {
          return Promise.resolve('pass@12234');
        }),
      }),
      save: () => ({
        updated: 1,
      }),
    }));

    const getUserReq = {
      params: {
        configMachineId: '655f33c93407559b13f0cac9',
      },
      body: {
        machine_name: 'TestMachine006',
        machine_type: 'HostName006',
        job_import_topic: 'HostName006',
        machine_import_topic: 'HostName006',
        output_topic: 'HostName006',
        email: 'abcUPDATED@gm.com',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await configMachineController.updateConfigMachine(
      getUserReq,
      getUserRes,
      authNext
    );

    expect(ConfigMachineModel.findById).toHaveBeenCalled();
  });

  it('Error if User Not found for Update Config Machine Controller', async () => {
    ConfigMachineModel.findById = jest
      .fn()
      .mockImplementation(() => ({ populate: () => undefined }));

    const getUserReq = {
      params: {
        configMachineId: '655f33c93407559b13f0cac9',
      },
      body: {
        machine_name: 'TestMachine006',
        machine_type: 'HostName006',
        job_import_topic: 'HostName006',
        machine_import_topic: 'HostName006',
        output_topic: 'HostName006',
        email: 'abcUPDATED@gm.com',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await configMachineController.updateConfigMachine(
      getUserReq,
      getUserRes,
      authNext
    );

    expect(ConfigMachineModel.findById).toHaveBeenCalled();
  });

  it('Error-409 if machine configuration already exists : Controller', async () => {
    ConfigMachineModel.findById = jest.fn().mockImplementation(() => ({
      populate: () => {
        throw new ApiError(httpStatus.CONFLICT);
      },
    }));

    const getUserReq = {
      params: {
        configMachineId: '655f33c93407559b13f0cac9',
      },
      body: {
        machine_name: 'TestMachine006',
        machine_type: 'HostName006',
        job_import_topic: 'HostName006',
        machine_import_topic: 'HostName006',
        output_topic: 'HostName006',
        email: 'abcUPDATED@gm.com',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await configMachineController.updateConfigMachine(
      getUserReq,
      getUserRes,
      authNext
    );

    expect(ConfigMachineModel.findById).toHaveBeenCalled();
  });

  it('Delete Config Machine Controller', async () => {
    ConfigMachineModel.findById = jest.fn().mockImplementation(() => ({
      populate: () => ({
        communicationType: 'MQTT',
        machineName: 'PLCTEST01',
        hostName: '127.0.0.1',
        portNumber: 1883,
        userName: '',
        password:
          '91d4a483cddba621f26621fae131821dfdf0f26dc9af0b9f34855ea93d586b92208710ff24257545f980d72025bc40e49ac9072f73b9f4853cc17646ae576e48e0130543b15518a564997a077a5725c6dbabb06b7c149a6fa9a6c91775e56f832e2fae64',
        jobImportTopic: 'AAATEST/PLCJobData',
        eventImportTopic: 'AAATEST/PLCEvents',
        jobExportTopic: 'AAATEST/PLCOutput',
        feature: 'Enable',
        createdBy: '6593f61758ec983208c4ed05',
        createdAt: '2024-02-29T07:00:18.833Z',
        id: '65e02b8200611e6933b2de10',
        decryptPassword: jest.fn().mockImplementation(() => {
          return Promise.resolve('pass@12234');
        }),
      }),
    }));

    ConfigMachineModel.deleteOne = jest.fn().mockImplementation(() => ({
      deleted: 1,
    }));

    const getUserReq = {
      params: {
        configMachineId: '655f33c93407559b13f0cac9',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await configMachineController.deleteConfigMachine(
      getUserReq,
      getUserRes,
      authNext
    );
    expect(ConfigMachineModel.findById).toHaveBeenCalled();
  });

  it('Error if User Not found for Delete Config Machine Controller', async () => {
    ConfigMachineModel.findById = jest.fn().mockImplementation(() => ({
      populate: () => undefined,
    }));

    ConfigMachineModel.deleteOne = jest.fn().mockImplementation(() => ({
      deleted: 1,
    }));

    const getUserReq = {
      params: {
        configMachineId: '655f33c93407559b13f0cac9',
      },
    };
    const getUserRes = {};
    const authNext = jest.fn();
    await configMachineController.deleteConfigMachine(
      getUserReq,
      getUserRes,
      authNext
    );
    expect(ConfigMachineModel.findById).toHaveBeenCalled();
  });

  it('return 500  machine event controller internal server error', async () => {
    ConfigMachineModel.find = jest.fn().mockImplementation(() => ({}));

    ConfigMachineModel.create = jest.fn().mockImplementation(() => ({}));

    const getMachineReq = {
      body: {},
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));

    const getMachineRes = { status: mockStatus };

    const authNext = jest.fn();
    await configMachineController.createConfigMachine(
      getMachineReq,
      getMachineRes,
      authNext
    );
    expect(ConfigMachineModel.create).toHaveBeenCalled();
  });

  it('return 404  machine event details not found', async () => {
    ConfigMachineModel.find = jest.fn().mockImplementation(() => ({}));

    const getMachineReq = {
      body: {},
    };
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));

    const getMachineRes = { status: mockStatus };

    const authNext = jest.fn();
    await configMachineController.createConfigMachine(
      getMachineReq,
      getMachineRes,
      authNext
    );

    expect(ConfigMachineModel.create).toHaveBeenCalled();
  });

  it('Get Config Machine By Filter : Controller', async () => {
    ConfigMachineModel.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => [
          {
            machineName: 'PLCTEST01',
            id: '65e02b8200611e6933b2de10',
          },
        ],
      }),
    }));

    const getmachineConfigReq = {
      body: {
        filters: {
          feature: 'Enable',
        },
        selectFields: ['machineName'],
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getmachineConfigRes = { status: mockStatus };

    const getmachineConfigNext = jest.fn();
    await configMachineController.getConfigMachineByFilter(
      getmachineConfigReq,
      getmachineConfigRes,
      getmachineConfigNext
    );
    expect(ConfigMachineModel.find).toHaveBeenCalled();
  });
  it('Error 500 - Get Config Machine By Filter : Controller', async () => {
    ConfigMachineModel.find = jest.fn().mockImplementation(() => ({
      select: () => ({
        exec: () => {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
        },
      }),
    }));

    const getmachineConfigReq = {
      body: {
        filters: {
          feature: 'Enable',
        },
        selectFields: ['machineName'],
      },
    };

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const getmachineConfigRes = { status: mockStatus };

    const getmachineConfigNext = jest.fn();
    await configMachineController.getConfigMachineByFilter(
      getmachineConfigReq,
      getmachineConfigRes,
      getmachineConfigNext
    );
    expect(ConfigMachineModel.find).toHaveBeenCalled();
  });

  describe('ConfigMachine Service', () => {
    it('createConfigMachine: should call create', async () => {
      ConfigMachine.create = jest.fn().mockResolvedValue({ createdBy: 'U1' });
      const result = await configService.createConfigMachine({
        machineName: 'X',
        userId: 'U1',
      });
      expect(ConfigMachine.create).toHaveBeenCalled();
      expect(result.createdBy).toBe('U1');
    });

    it('getConfigMachineById: should handle not found', async () => {
      ConfigMachine.findById = jest
        .fn()
        .mockReturnValue({ populate: () => Promise.resolve(null) });
      const result = await configService.getConfigMachineById('doesnotexist');
      expect(result).toBe(null);
    });

    it('updateConfigMachineById: should throw NOT_FOUND', async () => {
      jest.spyOn(configService, 'getConfigMachineById').mockResolvedValue(null);
      await expect(
        configService.updateConfigMachineById('id', {})
      ).rejects.toThrow('Config Machine not found');
    });

    it('deleteConfigMachineById: should throw NOT_FOUND', async () => {
      jest.spyOn(configService, 'getConfigMachineById').mockResolvedValue(null);
      await expect(configService.deleteConfigMachineById('id')).rejects.toThrow(
        'Config Machine not found'
      );
    });

    it('getConfigMachinesByFilter: should handle error', async () => {
      ConfigMachine.find = jest.fn().mockImplementation(() => {
        throw new Error('db error');
      });
      await expect(
        configService.getConfigMachinesByFilter({
          body: { filters: {}, selectFields: [] },
        })
      ).rejects.toThrow('db error');
    });

    it('should create a new config machine with userId as createdBy', async () => {
      ConfigMachine.create = jest
        .fn()
        .mockResolvedValue({ _id: 'newId', createdBy: 'U1' });
      const data = { machineName: 'Test', userId: 'U1' };
      const result = await configService.createConfigMachine(data);
      expect(ConfigMachine.create).toHaveBeenCalledWith(
        expect.objectContaining({ createdBy: 'U1' })
      );
      expect(result._id).toBe('newId');
    });

    it('should return zero records if none found', async () => {
      ConfigMachine.countDocuments = jest.fn().mockResolvedValue(0);
      ConfigMachine.find = jest.fn().mockReturnValue({
        populate: () => ({
          select: () => ({
            skip: () => ({
              limit: () => ({
                sort: () => ({
                  exec: () => [],
                }),
              }),
            }),
          }),
        }),
      });
      const opts = { pagination: { page: 1, limit: 10 }, filters: {} };
      const result = await configService.getMachineConfigs(opts);
      expect(result.totalRecords).toBe(0);
      expect(result.machineConfigData).toEqual([]);
    });

    it('should throw if countDocuments fails', async () => {
      ConfigMachine.countDocuments = jest
        .fn()
        .mockRejectedValue(new Error('fail'));
      await expect(
        configService.getMachineConfigs({
          pagination: { page: 1, limit: 1 },
          filters: {},
        })
      ).rejects.toThrow('fail');
    });

    it('should return null if not found', async () => {
      ConfigMachine.findById = jest.fn().mockReturnValue({
        populate: () => null,
      });
      const result = await configService.getConfigMachineById('id');
      expect(result).toBeNull();
    });

    it('should throw BAD_REQUEST if machine has lookup dependencies', async () => {
      jest.spyOn(configService, 'getConfigMachineById').mockResolvedValue({
        _id: 'x',
        machineName: 'M1',
      });
      ConfigMachineLookup.find = jest.fn().mockReturnValue({
        lean: () => Promise.resolve([{ machineName: 'M1' }]),
      });
      await expect(
        configService.deleteConfigMachineById('id')
      ).rejects.toThrow();
    });

    it('should return data from getConfigMachinesByFilter', async () => {
      ConfigMachine.find = jest.fn().mockReturnValue({
        lean: () => ({
          populate: () => ({
            select: () => ({
              exec: () => [{ id: 1 }],
            }),
          }),
        }),
      });
      const result = await configService.getConfigMachinesByFilter({
        body: { filters: {}, selectFields: [] },
      });
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should throw if find fails', async () => {
      ConfigMachine.find = jest.fn(() => {
        throw new Error('fail');
      });
      await expect(
        configService.getConfigMachinesByFilter({
          body: { filters: {}, selectFields: [] },
        })
      ).rejects.toThrow('fail');
    });

    it('should propagate error if decryptPassword throws', async () => {
      const fakeDoc = {
        password: 'enc',
        decryptPassword: jest
          .fn()
          .mockRejectedValue(new Error('decryption failed')),
      };

      ConfigMachine.findById = jest.fn().mockReturnValue({
        populate: () => fakeDoc,
      });

      await expect(configService.getConfigMachineById('id')).rejects.toThrow(
        'decryption failed'
      );
    });
    it('should throw and propagate non-Error exceptions on save', async () => {
      const toSave = { save: jest.fn().mockRejectedValue('boom') };
      jest
        .spyOn(configService, 'getConfigMachineById')
        .mockResolvedValue(toSave);

      await expect(
        configService.updateConfigMachineById('id', { foo: 1, userId: 'U' })
      ).rejects.toThrow();
    });
  });
});
