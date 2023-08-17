import { WithMongoId } from 'src/common/types/mongo-id';
import { EmbeddedCarModel } from './schema';

// Embedded car model document seed
export type EmbeddedCarModelSeed = WithMongoId<EmbeddedCarModel>;
