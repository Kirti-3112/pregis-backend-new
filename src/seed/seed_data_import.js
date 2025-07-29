const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const accessConfigurationConstantsSeedData = require('./accessConfigurationConstants.json');
const policiesSeedData = require('./policies.json');
const rolesSeedData = require('./roles.json');
const usersSeedData = require('./users.json'); // Added usersSeedData
const machineEventMessageLookupData = require('./machineEventMessageLookup.json');
const logger = require('../config/logger');

const {
  AccessConfigurationConstants,
  Policy,
  Role,
  User, // Import the User model
  MachineLookup,
} = require('../models');

const ACCESS_CONFIGURATION_CONSTANTS_COLLECTION_NAME =
  'accessConfigurationConstants';
const POLICY_COLLECTION_NAME = 'policies';
const ROLE_COLLECTION_NAME = 'roles';
const MACHINE_LOOKUPS_COLLECTION_NAME = 'machine_lookups';
const USER_COLLECTION_NAME = 'users';

/**
 * Defines the collections to seed with their respective data and filter functions.
 * Each collection object contains:
 * - model: The Mongoose model for the collection.
 * - data: The seed data to insert into the collection.
 * - name: The name of the collection (for logging purposes).
 * - getFilter: A function that returns a filter object to check for existing records.
 */
const collectionsToSeed = [
  {
    model: AccessConfigurationConstants,
    data: accessConfigurationConstantsSeedData,
    name: ACCESS_CONFIGURATION_CONSTANTS_COLLECTION_NAME,
    getFilter: (record) => ({
      category: record.category,
      name: record.name,
    }),
  },
  {
    model: Policy,
    data: policiesSeedData,
    name: POLICY_COLLECTION_NAME,
    getFilter: (record) => ({
      _id: record._id,
      policyName: record.policyName,
    }),
  },
  {
    model: Role,
    data: rolesSeedData,
    name: ROLE_COLLECTION_NAME,
    getFilter: (record) => ({
      _id: record._id,
      roleName: record.roleName,
    }),
  },
  {
    model: MachineLookup,
    data: machineEventMessageLookupData,
    name: MACHINE_LOOKUPS_COLLECTION_NAME,
    getFilter: (record) => ({
      Area: record.Area,
      MessageBitString: record.MessageBitString,
    }),
  },
];

/**
 * Inserts data into a MongoDB collection.
 * @param {*} collection - The MongoDB collection to insert data into.
 * @param {*} documents - The documents to insert.
 * @param {*} collectionName - The name of the collection (for logging purposes).
 */
async function insertDataIntoCollection(collection, documents, collectionName) {
  await collection.insertMany(documents);
  logger.debug(
    `Inserted ${documents.length} documents into ${collectionName} collection.`
  );
}

/**
 * Gets the record count from a MongoDB collection.
 * @param {*} collection - The MongoDB collection to count documents from.
 * @returns {Promise<number>} - The count of documents in the collection.
 */
async function getRecordCountsFromCollection(collection) {
  return collection.countDocuments();
}

/**
 * Seeds the User collection with initial data if it is empty.
 * This function hashes the passwords of the users before inserting them into the collection.
 * It ensures that existing users are not overwritten by checking the count of documents in the collection.
 * @returns {Promise<void>}
 */
async function seedUserCollectionIfEmpty() {
  const existingUsersCount = await getRecordCountsFromCollection(User);

  if (!existingUsersCount) {
    logger.warn(
      `No existing users found in ${USER_COLLECTION_NAME} collection, seeding new data.`
    );

    const usersSeedDataWithHashedPasswords = await Promise.all(
      usersSeedData.map(async (userData) => ({
        ...userData,
        password: await bcrypt.hash(userData.password, 8),
      }))
    );

    await insertDataIntoCollection(
      User,
      usersSeedDataWithHashedPasswords,
      USER_COLLECTION_NAME
    );

    logger.info(`Seeding completed for ${USER_COLLECTION_NAME} collection.`);
  } else {
    logger.info(
      `User collection already has ${existingUsersCount} records, skipping seeding.`
    );
  }
}

/**
 * Re-seeds a MongoDB collection with new data.
 * @param {*} collectionModel - The Mongoose model for the collection.
 * @param {*} seedDataJson - The JSON data to seed the collection with.
 * @param {*} collectionName - The name of the collection (for logging purposes).
 */
async function reSeedData(collectionModel, seedDataJson, collectionName) {
  try {
    logger.info(`Re-seeding data into ${collectionName} collection.`);

    // Insert Seed Data
    await insertDataIntoCollection(
      collectionModel,
      seedDataJson,
      collectionName
    );

    logger.info(`Seeding completed for ${collectionName} collection.`);
  } catch (error) {
    logger.error(`[reSeedData] : Error during re-seed process: ${error}`);
  }
}

/**
 * Checks and seeds the specified MongoDB collections.
 * @param {*} collectionNames - The names of the collections to check and seed.
 * This function filters the collections to seed based on the provided collection names,
 */
async function checkAndSeedCollections(collectionNames) {
  try {
    const allSeedPromises = collectionsToSeed
      .filter(({ name }) => {
        if (!collectionNames.includes(name)) {
          logger.warn(`Collection ${name} not included in the list. Skipping.`);
          return false;
        }
        return true;
      })
      .flatMap(({ model, data, name, getFilter }) => {
        logger.info(`Seeding collection: ${name}`);

        return data.map(async (record) => {
          const filter = getFilter ? getFilter(record) : {};
          const exists = await model.exists(filter);

          if (!exists) {
            await model.create(record);
            logger.info(
              `Created new record in ${name}: ${JSON.stringify(filter)}`
            );
          }
        });
      });

    await Promise.all(allSeedPromises);

    logger.info(`Seed process completed successfully.`);
  } catch (error) {
    logger.error(`Error during seed process: ${error}`);
  }
}

/**
 * Seeds the database with initial data for AccessConfigurationConstants and Policy collections.
 * This function checks if the collections exist, drops them if they do, and then re-seeds them with the provided seed data.
 * It also seeds the User collection if it is empty.
 * @returns {Promise<void>}
 */
async function seedData() {
  try {
    logger.info(`Starting seed data process...`);

    // get the collection names from the database
    const collectionNames = (
      await mongoose.connection.db.listCollections().toArray()
    ).map((col) => col.name);

    await checkAndSeedCollections(collectionNames);

    // Seed the User collection if it is empty
    await seedUserCollectionIfEmpty();
  } catch (error) {
    logger.error(`Error seeding data: ${error.message}`, {
      stack: error.stack,
    });
  }
}

async function teardownDocument() {
  const collectioNamesToRemoveDocument = [
    AccessConfigurationConstants,
    Role,
    Policy,
  ];

  const deleteRecordsPromises = collectioNamesToRemoveDocument.map(
    (collectionName) => collectionName.deleteMany({})
  );

  const results = await Promise.all(deleteRecordsPromises);
  // Log the results of each collection's deletion
  results.forEach((result) => {
    logger.info(`Deleted ${result.deletedCount} records`);
  });
}

module.exports = {
  seedData,
  teardownDocument,
  reSeedData,
  seedUserCollectionIfEmpty,
  insertDataIntoCollection,
  getRecordCountsFromCollection,
  checkAndSeedCollections,
};
