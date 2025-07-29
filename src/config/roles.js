const allRoles = {
  user: ['read', 'write', 'update', 'delete'],
  admin: ['read', 'write', 'update', 'delete'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
