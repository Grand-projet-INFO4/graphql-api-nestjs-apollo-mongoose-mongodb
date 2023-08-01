import { resolve } from 'path';

import { STATIC_FILES_DIR_PATH } from 'src/common/constants/static-files.constants';

// Directory of the users' photos in the static files
export const USERS_PHOTOS_DIR = 'users';

// Path on disk to the users' photos directory
export const USERS_PHOTOS_DIR_PATH = resolve(
  STATIC_FILES_DIR_PATH,
  USERS_PHOTOS_DIR,
);

// The possible user role values
export enum UserRole {
  Basic = 'BASIC',
  Manager = 'MANAGER',
  Regulator = 'REGULATOR',
  Driver = 'DRIVER',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
}
// Array of user roles
export const USER_ROLES = [
  UserRole.Basic,
  UserRole.Manager,
  UserRole.Regulator,
  UserRole.Driver,
  UserRole.SuperAdmin,
  UserRole.Admin,
];
// Array of user roles that is associated with a cooperative
export const COOPERATIVE_USER_ROLES = [
  UserRole.Manager,
  UserRole.Regulator,
  UserRole.Driver,
];
// Array of user roles of users that are the application's administrators
export const ADMIN_USER_ROLES = [UserRole.SuperAdmin, UserRole.Admin];
