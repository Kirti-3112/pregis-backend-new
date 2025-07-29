const { userMachineShiftController } = require('../../../src/controllers');
const { UserMachineShift, User } = require('../../../src/models');

describe('UserMachineShift Controller', () => {
  it('Create UserMachineShift Controller', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(null);

    UserMachineShift.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const createUserMachineShiftReq = {
      body: {
        machineGroup: 'Group 1',
        machineId: 'Id 1',
        userId: '6593f61758ec983208c4ed06',
        addMachineToWishlist: true,
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const createUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.createUserMachineShift(
      createUserMachineShiftReq,
      createUserMachineShiftRes,
      authNext
    );

    expect(User.findById).toHaveBeenCalled();
  });
  it('handle if userMachineShiftData exist for Create UserMachineShift Controller', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      machineGroup: 'Group 1',
      machineId: 'Id 1',
    }));

    UserMachineShift.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const createUserMachineShiftReq = {
      body: {
        machineGroup: 'Group 1',
        machineId: 'Id 1',
        userId: '6593f61758ec983208c4ed06',
        addMachineToWishlist: true,
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const createUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.createUserMachineShift(
      createUserMachineShiftReq,
      createUserMachineShiftRes,
      authNext
    );

    expect(User.findById).toHaveBeenCalled();
  });
  it('Update UserMachineShift Controller', async () => {
    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift updated',
      })),
    }));

    const createUserMachineShiftReq = {
      params: { userId: '6593f61758ec983208c4ed06' },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const createUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.updateUserMachineShift(
      createUserMachineShiftReq,
      createUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
  it('handle error for Update UserMachineShift Controller', async () => {
    UserMachineShift.findOne = jest.fn().mockImplementation(null);

    const createUserMachineShiftReq = {
      params: { userId: '6593f61758ec983208c4ed06' },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const createUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.updateUserMachineShift(
      createUserMachineShiftReq,
      createUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
});

describe('UserMachineShift Controller: Start shift test cases', () => {
  // Start shift test cases
  it('UserMachineShift Controller - Start Shift - new shift activity created', async () => {
    UserMachineShift.findOne = jest.fn().mockImplementation(() => null);

    UserMachineShift.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '6593f61758ec983208c4ed06',
        currentMachineGroupId: '662f82a30fcb315ba42caa39',
        clockIn: 'Wed, 08 May 2024 01:40:09 GMT',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
  it('UserMachineShift Controller - Start Shift - start new shift when previous day shift is already clockedOut', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: null,
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T09:00:00.000Z'),
          clockOut: new Date('2024-05-14T11:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));
    UserMachineShift.findOne = jest.fn().mockImplementation(() => null);
    UserMachineShift.findOne = jest.fn().mockImplementation(() => null);

    UserMachineShift.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-16T11:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
  it('UserMachineShift Controller - Start Shift - start shift when currentMachineGroupId is null', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: null,
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T09:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    UserMachineShift.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T11:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
});

describe('UserMachineShift Controller: Change Shift test cases', () => {
  // Change shift test cases
  it('UserMachineShift Controller - Start Shift - should throw error if machine group is already taken', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: '2024-05-14T09:00:00.000Z',
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: '2024-05-14T11:21:57.112Z',
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82a30fcb315ba42caa39',
        clockIn: '2024-05-14T19:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
  it('UserMachineShift Controller - Start Shift - clockin date same as lastClockIn but with different shift', async () => {
    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T09:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T19:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
  it('UserMachineShift Controller - Start Shift - clockin date same as lastClockIn within the same shift', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T09:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T11:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
  it('UserMachineShift Controller - Start Shift - Change Machine group in different shift', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T09:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T19:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
  it('UserMachineShift Controller - Start Shift - clockIn date within the same shift as lastClockIn but different from createdAt', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T09:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-13T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T11:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
  it('UserMachineShift Controller - Start Shift - Change Machine group in different shifts in different day', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T19:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    UserMachineShift.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-15T09:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('UserMachineShift Controller - Start Shift - Change Machine group in different shift in different day', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T19:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));
    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T19:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));
    UserMachineShift.updateOne = jest.fn().mockImplementation(() => {});
    UserMachineShift.insertMany = jest.fn().mockImplementation(() => {});

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    UserMachineShift.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T20:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  // clockInDateUserShiftData === null
  it('unClockedOutUserShiftData === null', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest
      .fn()
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: null,
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            clockOut: new Date('2024-05-12T11:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    UserMachineShift.create = jest
      .fn()
      .mockImplementation(() => ({ inserted: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T20:00:00.000Z',
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('unClockedOutUserMachineShiftData.currentMachineGroupId === null', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest
      .fn()
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: null,
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            clockOut: new Date('2024-05-12T11:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: null,
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce(null);

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T20:00:00.000Z',
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('unClockedOutUserMachineShiftData.currentMachineGroupId === currentMachineGroupId', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest
      .fn()
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: null,
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            clockOut: new Date('2024-05-12T11:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce(null);

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T20:00:00.000Z',
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('lastClockIn > new Date(clockIn)', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest
      .fn()
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: null,
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            clockOut: new Date('2024-05-12T11:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82a30fcb315ba42caa39',
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-20T09:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce(null);

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T20:00:00.000Z',
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('lastClockIn.getUTCDate() === new Date(clockIn).getUTCDate() with intermediate shift boundaries', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest
      .fn()
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: null,
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            clockOut: new Date('2024-05-12T11:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82a30fcb315ba42caa39',
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-14T09:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce(null);

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T19:00:00.000Z',
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('lastClockIn.getUTCDate() === new Date(clockIn).getUTCDate() without shift boundaries', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest
      .fn()
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: null,
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            clockOut: new Date('2024-05-12T11:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82a30fcb315ba42caa39',
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-14T09:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce(null);

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-14T11:00:00.000Z',
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('lastClockIn.getUTCDate() !== new Date(clockIn).getUTCDate()', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.findOne = jest
      .fn()
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: null,
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-12T09:00:00.000Z'),
            clockOut: new Date('2024-05-12T11:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce({
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82a30fcb315ba42caa39',
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-14T09:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      })
      .mockResolvedValueOnce(null);

    UserMachineShift.updateOne = jest.fn().mockImplementation(() => {});

    UserMachineShift.insertMany = jest.fn().mockResolvedValueOnce(() => [
      {
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82a30fcb315ba42caa39',
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-15T00:00:00.000Z'),
            clockOut: new Date('2024-05-15T08:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-15T08:00:00.000Z'),
            clockOut: new Date('2024-05-15T16:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d72',
          },
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-15T16:00:00.000Z'),
            clockOut: new Date('2024-05-16T00:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d73',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      },
      {
        _id: '66434955c8ecb10f35b08865',
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82a30fcb315ba42caa39',
        shiftActivity: [
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-16T00:00:00.000Z'),
            clockOut: new Date('2024-05-16T08:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d71',
          },
          {
            machineGroup: '662f82a30fcb315ba42caa39',
            clockIn: new Date('2024-05-16T08:00:00.000Z'),
            clockOut: new Date('2024-05-16T16:00:00.000Z'),
            _id: '66434a80b079c2f8a03b5d72',
          },
        ],
        createdAt: new Date('2024-05-14T11:21:57.112Z'),
        updatedAt: '2024-05-14T12:55:51.480Z',
        save: jest.fn().mockImplementation(() => ({
          message: 'User machine shift started succesfully',
        })),
      },
    ]);

    UserMachineShift.save = jest
      .fn()
      .mockImplementation(() => ({ updated: 1 }));

    const startUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        currentMachineGroupId: '662f82860fcb315ba42caa2e',
        clockIn: '2024-05-16T20:00:00.000Z',
      },
    };

    const authNext = jest.fn();
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const startUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.startUserShift(
      startUserMachineShiftReq,
      startUserMachineShiftRes,
      authNext
    );

    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
    expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
});

describe('UserMachineShift Controller: End Shift test cases', () => {
  // End shift test cases
  it('UserMachineShift Controller - End Shift - should throw an error if user has already clocked out', async () => {
    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      currentMachineGroupId: null,
      shiftActivity: [{ clockOut: undefined }],
    }));

    const endUserMachineShiftReq = {
      body: {
        userId: '6593f61758ec983208c4ed06',
        clockOut: 'Tue, 14 May 2024 23:40:00 GMT',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const endUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.endUserShift(
      endUserMachineShiftReq,
      endUserMachineShiftRes,
      authNext
    );

    await expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('UserMachineShift Controller - End Shift - user not clocked out within same shift', async () => {
    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T19:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: '2024-05-14T11:21:57.112Z',
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift ended succesfully',
      })),
    }));

    const endUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        clockOut: 'Tue, 14 May 2024 23:40:00 GMT',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const endUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.endUserShift(
      endUserMachineShiftReq,
      endUserMachineShiftRes,
      authNext
    );

    await expect(UserMachineShift.findOne).toHaveBeenCalled();
  });

  it('UserMachineShift Controller - End Shift - user not clocked out within different shift', async () => {
    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: '662f82a30fcb315ba42caa39',
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T07:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: '2024-05-14T11:21:57.112Z',
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift ended succesfully',
      })),
    }));

    const endUserMachineShiftReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        clockOut: '2024-05-14T11:00:00.000Z',
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const endUserMachineShiftRes = { status: mockStatus };
    userMachineShiftController.endUserShift(
      endUserMachineShiftReq,
      endUserMachineShiftRes,
      authNext
    );

    await expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
});

describe('GET shifts API test cases', () => {
  it('Get All Shifts Data', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      preferences: {
        dateAndTime: {
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '24 hours - HH:MM:SS',
          timeZone: '(UTC-0400) Atlantic Time (Canada)',
        },
      },
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.aggregate = jest.fn().mockImplementation(() => ({
      exec: () => [
        {
          _id: {
            $oid: '664f1e8193d79d8d7f27f07d',
          },
          user: {
            _id: {
              $oid: '660b85ae0346c06926a80be5',
            },
            email: 'admin@pregis.com',
            password:
              '$2a$08$JBpZyyatwhEw8GZLDD8jF.kfkD5yXrfxrv2cUx6WjkljmmBkyWdIy',
            role: 'user',
            policies: [],
            machineGroups: [
              {
                $oid: '66278ece0350d5c52de9114d',
              },
              {
                $oid: '6628f95a0be448657b7e45d4',
              },
            ],
            isEmailVerified: false,
            isDeleted: false,
            createdAt: {
              $date: '2024-04-02T04:12:30.320Z',
            },
            updatedAt: {
              $date: '2024-06-03T08:47:34.908Z',
            },
            __v: 22,
            displayName: 'Admin',
            roles: {
              $oid: '65fbe04df731bd4b9af1df61',
            },
            updatedBy: {
              $oid: '660b85ae0346c06926a80be5',
            },
            isActive: true,
            machineWishList: {
              machineGroup: 'Group 1',
              machineId: 'AURORA1',
              _id: {
                $oid: '665d8326a9aefe3e287af13c',
              },
            },
          },
          date: {
            $date: '2024-05-23T10:46:25.000Z',
          },
          firstClockIn: {
            $date: '2024-05-23T10:46:25.000Z',
          },
          lastClockOut: {
            $date: '2024-05-23T10:55:35.000Z',
          },
          workDuration: 0.15,
          morning: 0.15,
          evening: 0,
          night: 0,
          shiftActivity: [
            {
              machineGroup: '6628f95a0be448657b7e45d4',
              clockIn: {
                $date: '2024-05-23T10:46:25.000Z',
              },
              _id: {
                $oid: '664f1e8193d79d8d7f27f07e',
              },
              clockOut: {
                $date: '2024-05-23T10:55:35.000Z',
              },
              evening: '0.00',
              morning: '0.15',
              night: '0.00',
              machineGroupObjectId: {
                $oid: '6628f95a0be448657b7e45d4',
              },
            },
          ],
          machineGroups: [],
        },
        {
          _id: {
            $oid: '665d9d14b7208b6df4b0ebfc',
          },
          user: {
            _id: {
              $oid: '6654387926fbe93ae4e7305e',
            },
            email: 'mahidhar2@pregis.com',
            password:
              '$2a$08$CRMqQfBd/ortYfTaG2YE9OXHpb.fpMF9brtiVddMFuSv/TYrbyaRC',
            role: 'user',
            roles: {
              $oid: '65fbe04df731bd4b9af1df5d',
            },
            policies: [],
            machineGroups: [
              {
                $oid: '662f82860fcb315ba42caa2e',
              },
              {
                $oid: '662f82a30fcb315ba42caa39',
              },
            ],
            isEmailVerified: false,
            isActive: true,
            isDeleted: false,
            createdAt: {
              $date: '2024-05-27T07:38:33.684Z',
            },
            updatedAt: {
              $date: '2024-06-03T09:21:36.281Z',
            },
            displayName: 'mahidhar2',
            __v: 2,
            machineWishList: {
              machineGroup: 'Group 1',
              machineId: 'AURORA1',
              _id: {
                $oid: '665d8b2041853b65c6c61ec5',
              },
            },
            updatedBy: {
              $oid: '6654387926fbe93ae4e7305e',
            },
          },
          date: {
            $date: '2024-06-03T09:21:36.000Z',
          },
          firstClockIn: {
            $date: '2024-06-03T09:21:36.000Z',
          },
          lastClockOut: {
            $date: '2024-06-03T09:21:39.000Z',
          },
          workDuration: 0,
          morning: 0,
          evening: 0,
          night: 0,
          shiftActivity: [
            {
              machineGroup: '662f82860fcb315ba42caa2e',
              clockIn: {
                $date: '2024-06-03T09:21:36.000Z',
              },
              _id: {
                $oid: '665d8b2041853b65c6c61ec9',
              },
              clockOut: {
                $date: '2024-06-03T09:21:39.000Z',
              },
              evening: '0.00',
              morning: '0.00',
              night: '0.00',
              machineGroupObjectId: {
                $oid: '662f82860fcb315ba42caa2e',
              },
              machineGroupDetails: {
                _id: {
                  $oid: '662f82860fcb315ba42caa2e',
                },
                name: 'Group 1',
                description: 'Group 1',
                machines: [
                  {
                    $oid: '662b4d7f731e812862f7ad68',
                  },
                  {
                    $oid: '662b3ac020d35e565451949a',
                  },
                  {
                    $oid: '662b3ad120d35e56545194a8',
                  },
                  {
                    $oid: '662b3ae120d35e56545194b6',
                  },
                  {
                    $oid: '662b3afa20d35e56545194c4',
                  },
                ],
                status: 'Active',
                createdBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                createdAt: {
                  $date: '2024-04-24T12:21:46.790Z',
                },
                updatedAt: {
                  $date: '2024-04-26T06:45:35.336Z',
                },
                __v: 2,
                updatedBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
              },
            },
          ],
          machineGroups: ['Group 1'],
        },
        {
          _id: {
            $oid: '664636c79a0fea7ed212ebac',
          },
          user: {
            _id: {
              $oid: '660b85ae0346c06926a80be5',
            },
            email: 'admin@pregis.com',
            password:
              '$2a$08$JBpZyyatwhEw8GZLDD8jF.kfkD5yXrfxrv2cUx6WjkljmmBkyWdIy',
            role: 'user',
            policies: [],
            machineGroups: [
              {
                $oid: '66278ece0350d5c52de9114d',
              },
              {
                $oid: '6628f95a0be448657b7e45d4',
              },
            ],
            isEmailVerified: false,
            isDeleted: false,
            createdAt: {
              $date: '2024-04-02T04:12:30.320Z',
            },
            updatedAt: {
              $date: '2024-06-03T08:47:34.908Z',
            },
            __v: 22,
            displayName: 'Admin',
            roles: {
              $oid: '65fbe04df731bd4b9af1df61',
            },
            updatedBy: {
              $oid: '660b85ae0346c06926a80be5',
            },
            isActive: true,
            machineWishList: {
              machineGroup: 'Group 1',
              machineId: 'AURORA1',
              _id: {
                $oid: '665d8326a9aefe3e287af13c',
              },
            },
          },
          date: {
            $date: '2024-05-17T01:00:00.000Z',
          },
          firstClockIn: {
            $date: '2024-05-17T01:00:00.000Z',
          },
          lastClockOut: {
            $date: '2024-05-18T00:00:00.000Z',
          },
          workDuration: 24.346666666666668,
          morning: 6.33,
          evening: 11.016666666666666,
          night: 7,
          shiftActivity: [
            {
              machineGroup: '662f82860fcb315ba42caa2e',
              clockIn: {
                $date: '2024-05-17T19:40:00.000Z',
              },
              _id: {
                $oid: '664636c79a0fea7ed212ebad',
              },
              clockOut: {
                $date: '2024-05-18T00:00:00.000Z',
              },
              evening: '4.33',
              morning: '0.00',
              night: '0.00',
              machineGroupObjectId: {
                $oid: '662f82860fcb315ba42caa2e',
              },
              machineGroupDetails: {
                _id: {
                  $oid: '662f82860fcb315ba42caa2e',
                },
                name: 'Group 1',
                description: 'Group 1',
                machines: [
                  {
                    $oid: '662b4d7f731e812862f7ad68',
                  },
                  {
                    $oid: '662b3ac020d35e565451949a',
                  },
                  {
                    $oid: '662b3ad120d35e56545194a8',
                  },
                  {
                    $oid: '662b3ae120d35e56545194b6',
                  },
                  {
                    $oid: '662b3afa20d35e56545194c4',
                  },
                ],
                status: 'Active',
                createdBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                createdAt: {
                  $date: '2024-04-24T12:21:46.790Z',
                },
                updatedAt: {
                  $date: '2024-04-26T06:45:35.336Z',
                },
                __v: 2,
                updatedBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
              },
            },
            {
              machineGroup: '662f82860fcb315ba42caa2e',
              clockIn: {
                $date: '2024-05-17T01:00:00.000Z',
              },
              _id: {
                $oid: '664650a8b0716be2461b9592',
              },
              evening: '0.00',
              morning: '0.00',
              night: '7.00',
              clockOut: {
                $date: '2024-05-17T08:00:00.000Z',
              },
              machineGroupObjectId: {
                $oid: '662f82860fcb315ba42caa2e',
              },
              machineGroupDetails: {
                _id: {
                  $oid: '662f82860fcb315ba42caa2e',
                },
                name: 'Group 1',
                description: 'Group 1',
                machines: [
                  {
                    $oid: '662b4d7f731e812862f7ad68',
                  },
                  {
                    $oid: '662b3ac020d35e565451949a',
                  },
                  {
                    $oid: '662b3ad120d35e56545194a8',
                  },
                  {
                    $oid: '662b3ae120d35e56545194b6',
                  },
                  {
                    $oid: '662b3afa20d35e56545194c4',
                  },
                ],
                status: 'Active',
                createdBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                createdAt: {
                  $date: '2024-04-24T12:21:46.790Z',
                },
                updatedAt: {
                  $date: '2024-04-26T06:45:35.336Z',
                },
                __v: 2,
                updatedBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
              },
            },
            {
              machineGroup: '662f82a30fcb315ba42caa39',
              clockIn: {
                $date: '2024-05-17T09:40:00.000Z',
              },
              _id: {
                $oid: '6646cbbe71b3212489889b13',
              },
              clockOut: {
                $date: '2024-05-17T16:00:00.000Z',
              },
              morning: '6.33',
              evening: '0.00',
              night: '0.00',
              machineGroupObjectId: {
                $oid: '662f82a30fcb315ba42caa39',
              },
              machineGroupDetails: {
                _id: {
                  $oid: '662f82a30fcb315ba42caa39',
                },
                name: 'Group 2',
                machines: [
                  {
                    $oid: '660fba293d8cb2cb74b4705b',
                  },
                  {
                    $oid: '661e64469003f2a6323b7efb',
                  },
                ],
                status: 'Active',
                createdBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                createdAt: {
                  $date: '2024-04-17T07:43:33.753Z',
                },
                updatedAt: {
                  $date: '2024-04-25T09:17:00.847Z',
                },
                __v: 0,
                updatedBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                description: 'Group 2',
              },
            },
            {
              machineGroup: '662f82a30fcb315ba42caa39',
              clockIn: {
                $date: '2024-05-17T16:00:00.000Z',
              },
              clockOut: {
                $date: '2024-05-17T19:40:00.000Z',
              },
              morning: '0',
              evening: '3.6666666666666665',
              night: '0',
              _id: {
                $oid: '6646cc1171b3212489889b2f',
              },
              machineGroupObjectId: {
                $oid: '662f82a30fcb315ba42caa39',
              },
              machineGroupDetails: {
                _id: {
                  $oid: '662f82a30fcb315ba42caa39',
                },
                name: 'Group 2',
                machines: [
                  {
                    $oid: '660fba293d8cb2cb74b4705b',
                  },
                  {
                    $oid: '661e64469003f2a6323b7efb',
                  },
                ],
                status: 'Active',
                createdBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                createdAt: {
                  $date: '2024-04-17T07:43:33.753Z',
                },
                updatedAt: {
                  $date: '2024-04-25T09:17:00.847Z',
                },
                __v: 0,
                updatedBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                description: 'Group 2',
              },
            },
            {
              machineGroup: '662f82860fcb315ba42caa2e',
              clockIn: {
                $date: '2024-05-17T19:40:00.000Z',
              },
              _id: {
                $oid: '6646cc1171b3212489889b30',
              },
              clockOut: {
                $date: '2024-05-17T22:41:00.000Z',
              },
              evening: '3.02',
              morning: '0.00',
              night: '0.00',
              machineGroupObjectId: {
                $oid: '662f82860fcb315ba42caa2e',
              },
              machineGroupDetails: {
                _id: {
                  $oid: '662f82860fcb315ba42caa2e',
                },
                name: 'Group 1',
                description: 'Group 1',
                machines: [
                  {
                    $oid: '662b4d7f731e812862f7ad68',
                  },
                  {
                    $oid: '662b3ac020d35e565451949a',
                  },
                  {
                    $oid: '662b3ad120d35e56545194a8',
                  },
                  {
                    $oid: '662b3ae120d35e56545194b6',
                  },
                  {
                    $oid: '662b3afa20d35e56545194c4',
                  },
                ],
                status: 'Active',
                createdBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                createdAt: {
                  $date: '2024-04-24T12:21:46.790Z',
                },
                updatedAt: {
                  $date: '2024-04-26T06:45:35.336Z',
                },
                __v: 2,
                updatedBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
              },
            },
          ],
          machineGroups: ['Group 1', 'Group 2'],
        },
        {
          _id: {
            $oid: '665d8b2041853b65c6c61ec8',
          },
          user: {
            _id: {
              $oid: '6654387926fbe93ae4e7305e',
            },
            email: 'mahidhar2@pregis.com',
            password:
              '$2a$08$CRMqQfBd/ortYfTaG2YE9OXHpb.fpMF9brtiVddMFuSv/TYrbyaRC',
            role: 'user',
            roles: {
              $oid: '65fbe04df731bd4b9af1df5d',
            },
            policies: [],
            machineGroups: [
              {
                $oid: '662f82860fcb315ba42caa2e',
              },
              {
                $oid: '662f82a30fcb315ba42caa39',
              },
            ],
            isEmailVerified: false,
            isActive: true,
            isDeleted: false,
            createdAt: {
              $date: '2024-05-27T07:38:33.684Z',
            },
            updatedAt: {
              $date: '2024-06-03T09:21:36.281Z',
            },
            displayName: 'mahidhar2',
            __v: 2,
            machineWishList: {
              machineGroup: 'Group 1',
              machineId: 'AURORA1',
              _id: {
                $oid: '665d8b2041853b65c6c61ec5',
              },
            },
            updatedBy: {
              $oid: '6654387926fbe93ae4e7305e',
            },
          },
          date: {
            $date: '2024-06-03T09:21:36.000Z',
          },
          firstClockIn: {
            $date: '2024-06-03T09:21:36.000Z',
          },
          lastClockOut: {
            $date: '2024-06-03T09:21:39.000Z',
          },
          workDuration: 0,
          morning: 0,
          evening: 0,
          night: 0,
          shiftActivity: [
            {
              machineGroup: '662f82860fcb315ba42caa2e',
              clockIn: {
                $date: '2024-06-03T09:21:36.000Z',
              },
              _id: {
                $oid: '665d8b2041853b65c6c61ec9',
              },
              clockOut: {
                $date: '2024-06-03T09:21:39.000Z',
              },
              evening: '0.00',
              morning: '0.00',
              night: '0.00',
              machineGroupObjectId: {
                $oid: '662f82860fcb315ba42caa2e',
              },
              machineGroupDetails: {
                _id: {
                  $oid: '662f82860fcb315ba42caa2e',
                },
                name: 'Group 1',
                description: 'Group 1',
                machines: [
                  {
                    $oid: '662b4d7f731e812862f7ad68',
                  },
                  {
                    $oid: '662b3ac020d35e565451949a',
                  },
                  {
                    $oid: '662b3ad120d35e56545194a8',
                  },
                  {
                    $oid: '662b3ae120d35e56545194b6',
                  },
                  {
                    $oid: '662b3afa20d35e56545194c4',
                  },
                ],
                status: 'Active',
                createdBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
                createdAt: {
                  $date: '2024-04-24T12:21:46.790Z',
                },
                updatedAt: {
                  $date: '2024-04-26T06:45:35.336Z',
                },
                __v: 2,
                updatedBy: {
                  $oid: '660b85ae0346c06926a80be5',
                },
              },
            },
          ],
          machineGroups: ['Group 1'],
        },
      ],
    }));

    UserMachineShift.countDocuments = jest.fn().mockImplementation(() => {
      return Promise.resolve(2);
    });
    const getShiftsReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
        pagination: {
          page: 1,
          limit: 2,
        },
        filters: {},
      },
    };
    const getShiftsRes = {};
    const authNext = jest.fn();

    await userMachineShiftController.getShifts(
      getShiftsReq,
      getShiftsRes,
      authNext
    );
    expect(User.findById).toHaveBeenCalled();
    expect(UserMachineShift.aggregate).toHaveBeenCalled();
  });

  it('Get Shift By Id Data', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      preferences: {
        dateAndTime: {
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '24 hours - HH:MM:SS',
          timeZone: '(UTC-0400) Atlantic Time (Canada)',
        },
      },
      save: () => ({
        updated: 1,
      }),
    }));

    UserMachineShift.aggregate = jest.fn().mockImplementation(() => ({
      exec: () => [
        {
          _id: {
            $oid: '665d8b2041853b65c6c61ec8',
          },
          user: {
            _id: {
              $oid: '6654387926fbe93ae4e7305e',
            },
            email: 'mahidhar2@pregis.com',
            roles: {
              _id: '65fbe04df731bd4b9af1df61',
              roleName: 'Administrator',
              isActive: true,
            },
            isEmailVerified: false,
            isActive: true,
            isDeleted: false,
            displayName: 'mahidhar2',
            machineWishList: {
              machineGroup: 'Group 1',
              machineId: 'AURORA1',
              _id: {
                $oid: '665d8b2041853b65c6c61ec5',
              },
            },
          },
          date: {
            $date: '2024-06-03T09:21:36.000Z',
          },
          firstClockIn: {
            $date: '2024-06-03T09:21:36.000Z',
          },
          lastClockOut: {
            $date: '2024-06-03T09:21:39.000Z',
          },
          workDuration: 0,
          morning: 0,
          evening: 0,
          night: 0,
          machineGroups: ['Group 1'],
        },
      ],
    }));
    UserMachineShift.aggregate = jest.fn().mockImplementation(() => ({
      exec: () => [
        {
          shiftActivityGrouped: {
            'Group 2': {
              evening: 3.6666666666666665,
              morning: 6.33,
              night: 0,
              workDuration: 9.996666666666666,
              shiftActivities: [
                {
                  _id: '6646cbbe71b3212489889b13',
                  clockIn: '2024-05-17T09:40:00.000Z',
                  clockOut: '2024-05-17T16:00:00.000Z',
                  evening: '0.00',
                  morning: '6.33',
                  night: '0.00',
                  machineGroupName: 'Group 2',
                  machineGroup: '662f82a30fcb315ba42caa39',
                },
                {
                  _id: '6646cc1171b3212489889b2f',
                  clockIn: '2024-05-17T16:00:00.000Z',
                  clockOut: '2024-05-17T19:40:00.000Z',
                  evening: '3.6666666666666665',
                  morning: '0',
                  night: '0',
                  machineGroupName: 'Group 2',
                  machineGroup: '662f82a30fcb315ba42caa39',
                },
              ],
            },
            'group 1': {
              evening: 7.35,
              morning: 0,
              night: 7,
              workDuration: 14.35,
              shiftActivities: [
                {
                  _id: '664636c79a0fea7ed212ebad',
                  clockIn: '2024-05-17T19:40:00.000Z',
                  clockOut: '2024-05-18T00:00:00.000Z',
                  evening: '4.33',
                  morning: '0.00',
                  night: '0.00',
                  machineGroupName: 'group 1',
                  machineGroup: '662f82860fcb315ba42caa2e',
                },
                {
                  _id: '664650a8b0716be2461b9592',
                  clockIn: '2024-05-17T01:00:00.000Z',
                  clockOut: '2024-05-17T08:00:00.000Z',
                  evening: '0.00',
                  morning: '0.00',
                  night: '7.00',
                  machineGroupName: 'group 1',
                  machineGroup: '662f82860fcb315ba42caa2e',
                },
                {
                  _id: '6646cc1171b3212489889b30',
                  clockIn: '2024-05-17T19:40:00.000Z',
                  clockOut: '2024-05-17T22:41:00.000Z',
                  evening: '3.02',
                  morning: '0.00',
                  night: '0.00',
                  machineGroupName: 'group 1',
                  machineGroup: '662f82860fcb315ba42caa2e',
                },
              ],
            },
          },
        },
      ],
    }));

    const getShiftByIdReq = {
      params: {
        id: '664636c79a0fea7ed212ebac',
      },
      body: {
        userId: '660b85ae0346c06926a80be5',
      },
    };
    const getShiftByIdRes = {};
    const authNext = jest.fn();

    await userMachineShiftController.getShiftById(
      getShiftByIdReq,
      getShiftByIdRes,
      authNext
    );
    expect(User.findById).toHaveBeenCalled();
    expect(UserMachineShift.aggregate).toHaveBeenCalled();
    expect(UserMachineShift.aggregate).toHaveBeenCalled();
  });

  it('Get Ongoing shift by userId', async () => {
    UserMachineShift.findOne = jest.fn().mockImplementation(() => ({
      _id: '66434955c8ecb10f35b08865',
      userId: '660b85ae0346c06926a80be5',
      currentMachineGroupId: null,
      shiftActivity: [
        {
          machineGroup: '662f82a30fcb315ba42caa39',
          clockIn: new Date('2024-05-14T09:00:00.000Z'),
          clockOut: new Date('2024-05-14T11:00:00.000Z'),
          _id: '66434a80b079c2f8a03b5d71',
        },
      ],
      createdAt: new Date('2024-05-14T11:21:57.112Z'),
      updatedAt: '2024-05-14T12:55:51.480Z',
      save: jest.fn().mockImplementation(() => ({
        message: 'User machine shift started succesfully',
      })),
    }));

    const getOngoingShiftByUserIdReq = {
      body: {
        userId: '660b85ae0346c06926a80be5',
      },
    };
    const getOngoingShiftByUserIdRes = {};
    const authNext = jest.fn();

    await userMachineShiftController.getOngoingShift(
      getOngoingShiftByUserIdReq,
      getOngoingShiftByUserIdRes,
      authNext
    );
    await expect(UserMachineShift.findOne).toHaveBeenCalled();
  });
});

describe('UserMachineShift Controller: addMachineToWishlist test cases', () => {
  // End shift test cases
  it('UserMachineShift Controller - addMachineToWishList is true', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    const addMachineToWishListReq = {
      body: {
        machineGroup: 'Group 1',
        machineId: 'Id 1',
        userId: '6593f61758ec983208c4ed06',
        addMachineToWishlist: true,
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const addMachineToWishListRes = { status: mockStatus };
    userMachineShiftController.addMachineToWishlist(
      addMachineToWishListReq,
      addMachineToWishListRes,
      authNext
    );

    expect(User.findById).toHaveBeenCalled();
  });

  it('UserMachineShift Controller - addMachineToWishList is false', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      machineWishList: {
        machineGroup: 'Group 1',
        machineId: 'M0004',
      },
      machineGroups: ['123'],
      userId: '6593f61758ec983208c4ed06',
      save: () => ({
        updated: 1,
      }),
    }));

    const addMachineToWishListReq = {
      body: {
        addMachineToWishlist: false,
      },
    };

    const authNext = jest.fn();

    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const addMachineToWishListRes = { status: mockStatus };
    userMachineShiftController.addMachineToWishlist(
      addMachineToWishListReq,
      addMachineToWishListRes,
      authNext
    );

    expect(User.findById).toHaveBeenCalled();
  });
});
