import { resolve } from 'path';

import { STATIC_FILES_DIR_PATH } from 'src/common/constants/static-files.constants';

// Directory of the users' photos in the static files
export const USERS_PHOTOS_DIR = 'users';

// Path on disk to the users' photos directory
export const USERS_PHOTOS_DIR_PATH = resolve(
  STATIC_FILES_DIR_PATH,
  USERS_PHOTOS_DIR,
);
