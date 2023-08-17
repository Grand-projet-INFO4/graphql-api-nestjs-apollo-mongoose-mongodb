import { mongo } from 'mongoose';
import { EmbeddedPhotoSeed } from '../photo';

export type GeneratedEmbeddedPhotosSeed = {
  mainPhotoId: mongo.BSON.ObjectId;
  photos: EmbeddedPhotoSeed[];
};

/**
 * Generates an array of embedded photos seed data and their main photo id
 * from an array of photos filenames and the main photo filename
 *
 * @param photos The array of photos filenames
 * @param mainPhoto The filename of the photos
 */
export function generateEmbeddedPhotosSeed(
  photos: string[],
  mainPhoto: string,
): GeneratedEmbeddedPhotosSeed {
  let mainPhotoId: mongo.BSON.ObjectId;
  const embeddedPhotos = photos.map<EmbeddedPhotoSeed>((photo) => {
    const id = new mongo.ObjectId();
    if (mainPhoto === photo) {
      mainPhotoId = id;
    }
    return {
      _id: id,
      filename: photo,
    };
  });
  return {
    mainPhotoId,
    photos: embeddedPhotos,
  };
}
