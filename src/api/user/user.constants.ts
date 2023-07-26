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
// Set for the user roles
export const userRolesSet = new Set<UserRole>([
  UserRole.Basic,
  UserRole.Manager,
  UserRole.Regulator,
  UserRole.Driver,
  UserRole.SuperAdmin,
  UserRole.Admin,
]);
