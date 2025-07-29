const mockingoose = require('mockingoose');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const sinon = require('sinon');

jest.mock(
  '../../../src/seed/users.json',
  () => [{ username: 'admin', password: 'plaintext' }],
  { virtual: true }
);

const {
  seedData,
  teardownDocument,
  seedUserCollectionIfEmpty,
  reSeedData,
  checkAndSeedCollections,
} = require('../../../src/seed/seed_data_import');

const logger = require('../../../src/config/logger');
const {
  AccessConfigurationConstants,
  Policy,
  Role,
  User,
} = require('../../../src/models');

// Mocks
jest.mock('bcryptjs');
jest.mock('../../../src/config/logger');

beforeAll(() => {
  mongoose.connection.db = {
    listCollections: jest.fn().mockReturnValue({
      toArray: async () => [
        { name: 'accessConfigurationConstants' },
        { name: 'roles' },
      ],
    }),
    dropCollection: jest.fn().mockResolvedValue(undefined),
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Seed Database Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  describe('seedUserCollectionIfEmpty', () => {
    it('should seed users when collection is empty', async () => {
      mockingoose(User).toReturn(0, 'countDocuments');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      const insertSpy = jest.spyOn(User, 'insertMany').mockResolvedValue([]);

      await seedUserCollectionIfEmpty();

      expect(insertSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ password: 'hashedPassword' }),
        ])
      );

      expect(logger.info).toHaveBeenCalledWith(
        'Seeding completed for users collection.'
      );
    });

    it('should not seed if users exist', async () => {
      mockingoose(User).toReturn(2, 'countDocuments');

      const insertSpy = jest.spyOn(User, 'insertMany');

      await seedUserCollectionIfEmpty();

      expect(insertSpy).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        'User collection already has 2 records, skipping seeding.'
      );
    });
  });

  describe('reSeedData', () => {
    it('should insert seed data into a collection', async () => {
      const fakeData = [{ key: 'value' }];
      const insertSpy = jest.spyOn(Policy, 'insertMany').mockResolvedValue([]);

      await reSeedData(Policy, fakeData, 'policies');

      expect(insertSpy).toHaveBeenCalledWith(fakeData);
    });
  });

  describe('teardownDocument', () => {
    it('should delete all documents from specific collections', async () => {
      const deleteSpy1 = jest
        .spyOn(AccessConfigurationConstants, 'deleteMany')
        .mockResolvedValue({ deletedCount: 1 });
      const deleteSpy2 = jest
        .spyOn(Role, 'deleteMany')
        .mockResolvedValue({ deletedCount: 2 });
      const deleteSpy3 = jest
        .spyOn(Policy, 'deleteMany')
        .mockResolvedValue({ deletedCount: 3 });

      await teardownDocument();

      expect(deleteSpy1).toHaveBeenCalled();
      expect(deleteSpy2).toHaveBeenCalled();
      expect(deleteSpy3).toHaveBeenCalled();

      expect(logger.info).toHaveBeenCalledWith('Deleted 1 records');
      expect(logger.info).toHaveBeenCalledWith('Deleted 2 records');
      expect(logger.info).toHaveBeenCalledWith('Deleted 3 records');
    });
  });

  describe('seedData', () => {
    it('should list collections and proceed with seeding', async () => {
      const listCollectionsStub = sinon
        .stub(mongoose.connection.db, 'listCollections')
        .returns({
          toArray: async () => [
            { name: 'accessConfigurationConstants' },
            { name: 'roles' },
            { name: 'policies' },
            { name: 'machine_lookups' },
          ],
        });

      // Mock `exists` and `create` for at least one model used in seeding
      jest
        .spyOn(AccessConfigurationConstants, 'exists')
        .mockResolvedValue(false);
      jest.spyOn(AccessConfigurationConstants, 'create').mockResolvedValue({});

      jest.spyOn(Role, 'exists').mockResolvedValue(true); // simulate skipping
      jest.spyOn(Policy, 'exists').mockResolvedValue(false);
      jest.spyOn(Policy, 'create').mockResolvedValue({});

      await seedData();

      expect(logger.info).toHaveBeenCalledWith('Starting seed data process...');
      expect(AccessConfigurationConstants.create).toHaveBeenCalled();
      expect(Role.exists).toHaveBeenCalled(); // even if skipped
      expect(Policy.create).toHaveBeenCalled();

      listCollectionsStub.restore();
    });
  });
});
