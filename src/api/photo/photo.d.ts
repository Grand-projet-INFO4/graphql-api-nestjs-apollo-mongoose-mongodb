import { WithMongoId } from 'src/common/types/mongo-id';
import { EmbeddedPhoto } from './schema';

export type EmbeddedPhotoSeed = WithMongoId<EmbeddedPhoto>;
