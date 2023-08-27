import { resolve } from 'path';

import { STATIC_FILES_DIR_PATH } from 'src/common/constants/static-files.constants';

// The folder where the bus stations's photos are stored
export const BUS_STATIONS_PHOTOS_DIR = 'bus-stations';
// The file path to the bus stations photos directory
export const BUS_STATIONS_PHOTOS_DIR_PATH = resolve(
  STATIC_FILES_DIR_PATH,
  BUS_STATIONS_PHOTOS_DIR,
);
