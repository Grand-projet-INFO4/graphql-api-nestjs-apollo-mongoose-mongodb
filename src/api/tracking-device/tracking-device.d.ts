import { WithMongoId } from 'src/common/types/mongo-id';
import { EmbeddedTrackingDevice } from './schema';

export type EmbeddedTrackingDeviceSeed = WithMongoId<
  Omit<EmbeddedTrackingDevice, 'createdAt'>
>;
