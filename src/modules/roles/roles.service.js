// In-memory stores for roles and user_roles associations.
// Replace with database queries when a DB layer is introduced.
const roles = [];
const userRoles = [];

let roleIdCounter = 1;

function generateRoleId() {
  return String(roleIdCounter++);
}

async function getAllRoles() {
  return roles.slice();
}

async function getRoleById(roleId) {
  return roles.find((r) => r.id === roleId) || null;
}

async function createRole({ name, description = '', permissions = [] }) {
  if (!name) {
    const error = new Error('Role name is required');
    error.status = 400;
    throw error;
  }

  const existing = roles.find((r) => r.name === name);
  if (existing) {
    const error = new Error('A role with this name already exists');
    error.status = 409;
    throw error;
  }

  const role = {
    id: generateRoleId(),
    name,
    description,
    permissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  roles.push(role);
  return role;
}

async function updateRole(roleId, { name, description, permissions }) {
  const role = roles.find((r) => r.id === roleId);
  if (!role) {
    return null;
  }

  if (name !== undefined) {
    const duplicate = roles.find((r) => r.name === name && r.id !== roleId);
    if (duplicate) {
      const error = new Error('A role with this name already exists');
      error.status = 409;
      throw error;
    }
    role.name = name;
  }

  if (description !== undefined) {
    role.description = description;
  }

  if (permissions !== undefined) {
    role.permissions = permissions;
  }

  role.updatedAt = new Date().toISOString();
  return role;
}

async function deleteRole(roleId) {
  const index = roles.findIndex((r) => r.id === roleId);
  if (index === -1) {
    return false;
  }

  roles.splice(index, 1);

  // Remove all user_roles associations for this role
  const toRemove = userRoles.filter((ur) => ur.roleId === roleId);
  toRemove.forEach((ur) => {
    const i = userRoles.indexOf(ur);
    if (i !== -1) userRoles.splice(i, 1);
  });

  return true;
}

async function getUsersByRole(roleId) {
  const role = roles.find((r) => r.id === roleId);
  if (!role) {
    const error = new Error('Role not found');
    error.status = 404;
    throw error;
  }

  return userRoles
    .filter((ur) => ur.roleId === roleId)
    .map((ur) => ({ userId: ur.userId, roleId: ur.roleId, assignedAt: ur.assignedAt }));
}

async function assignRoleToUser({ userId, roleId }) {
  if (!userId || !roleId) {
    const error = new Error('userId and roleId are required');
    error.status = 400;
    throw error;
  }

  const role = roles.find((r) => r.id === roleId);
  if (!role) {
    const error = new Error('Role not found');
    error.status = 404;
    throw error;
  }

  const existing = userRoles.find((ur) => ur.userId === userId && ur.roleId === roleId);
  if (existing) {
    const error = new Error('User already has this role');
    error.status = 409;
    throw error;
  }

  const userRole = {
    userId,
    roleId,
    assignedAt: new Date().toISOString(),
  };

  userRoles.push(userRole);
  return userRole;
}

async function removeRoleFromUser({ userId, roleId }) {
  if (!userId || !roleId) {
    const error = new Error('userId and roleId are required');
    error.status = 400;
    throw error;
  }

  const index = userRoles.findIndex((ur) => ur.userId === userId && ur.roleId === roleId);
  if (index === -1) {
    return false;
  }

  userRoles.splice(index, 1);
  return true;
}

async function getRolesByUser(userId) {
  if (!userId) {
    const error = new Error('userId is required');
    error.status = 400;
    throw error;
  }

  const userRoleEntries = userRoles.filter((ur) => ur.userId === userId);
  const result = [];

  for (const ur of userRoleEntries) {
    const role = roles.find((r) => r.id === ur.roleId);
    if (role) {
      result.push({ ...role, assignedAt: ur.assignedAt });
    }
  }

  return result;
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getUsersByRole,
  assignRoleToUser,
  removeRoleFromUser,
  getRolesByUser,
};
