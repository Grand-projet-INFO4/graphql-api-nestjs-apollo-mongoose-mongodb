import { resolve } from 'path';

// The directory that contains the static files
export const STATIC_FILES_DIR = 'public';

// The path of the static files' directory on the disk
export const STATIC_FILES_DIR_PATH = resolve(STATIC_FILES_DIR);

// The URL prefix of the endpoint that serves the static files
export const STATIC_FILES_URL_PREFIX = '/public';

// The directory of the images files
export const IMAGES_DIR = 'images';

// Path on disk to the images files
export const IMAGES_DIR_PATH = resolve(STATIC_FILES_DIR_PATH, IMAGES_DIR);
