import { WithMongoId } from 'src/common/types/mongo-id';
import { TripDriver } from './schema';

// The possible categories of a driver license
export type DriverLicenseCategory = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type TripDriverSeed = WithMongoId<TripDriver>;
