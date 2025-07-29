const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { SIDE_MENU_CONFIGURATION, AUTH } = require('../config/constants');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }

  const userToCreate = {
    ...userBody,
    createdBy: userBody.userId,
  };

  return User.create(userToCreate);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (options) => {
  const { pageLimit, page } = options.pagination;
  const filterToApply = {};

  const count = await User.countDocuments(filterToApply);

  const users = await User.find(filterToApply)
    .select({
      displayName: 1,
      email: 1,
      password: 1,
      roles: 1,
      policies: 1,
      isActive: 1,
      isDeleted: 1,
      machineGroups: 1,
    })
    .populate({
      path: 'roles',
      populate: {
        path: 'policies',
      },
    })
    .populate('policies')
    .populate({
      path: 'machineGroups',
      populate: {
        path: 'machines',
        populate: {
          path: 'machineType',
        },
      },
    })
    .limit(pageLimit)
    .skip((page - 1) * pageLimit)
    .sort({ updatedAt: -1 })
    .exec();

  const userData = {
    users,
    rowsPerPage: pageLimit,
    totalPages: Math.ceil(count / pageLimit),
    currentPage: page,
    totalRecords: count,
  };
  return userData;
};

/**
 * Get user by email
 * @returns {Promise<User>}
 */
const getUserByEmail = (email) => {
  return User.findOne({ email })
    .populate({
      path: 'roles',
      populate: {
        path: 'policies',
      },
    })
    .populate('policies')
    .populate({
      path: 'machineGroups',
      populate: {
        path: 'machines',
        populate: {
          path: 'machineType',
        },
      },
    })
    .exec();
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByEmail = async (user, password) => {
  return User.update(user, password);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

function checkUserMachineGroupsIsEqualToUpdatedOne(
  currentMachineGroups,
  updatedMachineGroups
) {
  return (
    currentMachineGroups.length === updatedMachineGroups.length &&
    currentMachineGroups
      .sort()
      .every((value, index) => value === updatedMachineGroups.sort()[index])
  );
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    updateBody.email !== user.email &&
    (await User.isEmailTaken(updateBody.email))
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }

  const userMachineGroups = user.machineGroups.map((objectId) =>
    objectId.toString()
  );
  const updatedMachineGroups = updateBody.machineGroups;

  const newUpdatedUser =
    userMachineGroups &&
    updatedMachineGroups &&
    !checkUserMachineGroupsIsEqualToUpdatedOne(
      userMachineGroups,
      updatedMachineGroups
    )
      ? {
          ...updateBody,
          machineWishList: { machineGroup: '', machineId: '' },
          updatedBy: updateBody.userId,
        }
      : { ...updateBody, updatedBy: updateBody.userId };

  Object.assign(user, newUpdatedUser);

  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const newUpdatedUser = {
    ...user,
    isActive: false,
    isDeleted: true,
    updatedBy: user.userId,
  };

  Object.assign(user, newUpdatedUser);

  await user.save();
  return user;
};

const generateUserSideMenuConfiguration = (allowedPolicyNames) => {
  const userSideMenuConfiguration = SIDE_MENU_CONFIGURATION.menus
    .map((menu) => {
      if (!menu) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          AUTH.AUTH_SIDE_MENU_CONFIGURATION_FAIL
        );
      }

      if (menu.subMenus) {
        const filteredSubMenus = menu.subMenus.filter((subMenu) =>
          allowedPolicyNames.includes(subMenu.policyName)
        );

        // Return only if there are valid subMenus, otherwise do nothing
        return filteredSubMenus.length
          ? { ...menu, subMenus: filteredSubMenus }
          : null;
      }
      return allowedPolicyNames.includes(menu.policyName) ? menu : null;
    })
    .filter(Boolean);

  return userSideMenuConfiguration;
};

module.exports = {
  createUser,
  updateUserById,
  queryUsers,
  getUserByEmail,
  updateUserByEmail,
  getUserById,
  deleteUserById,
  generateUserSideMenuConfiguration,
};
