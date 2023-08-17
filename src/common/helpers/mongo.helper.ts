import { Model } from 'mongoose';

/**
 * Checks if the collection of a mongoose model exists inside the database
 *
 * @param model The mongoose model
 */
export async function modelCollectionExists(
  model: Model<unknown>,
): Promise<boolean> {
  const matches = await model.db.db
    .listCollections({
      name: model.collection.name,
    })
    .toArray();
  return matches.length > 0;
}
