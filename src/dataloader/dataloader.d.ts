import DataLoader, { BatchLoadFn } from 'dataloader';

/**
 * Batch function that return a single batched value per key
 *
 * @param TKey The type of a key item
 * @param TValue The type of a batched return value
 */
export type BatchOneFn<TValue = unknown, TKey = string | number> = BatchLoadFn<
  TKey,
  TValue
>;

/**
 * Batch function that return an array of batched values per key
 *
 * @param TKey The type of a key item
 * @param TValue The type of a item inside the batched array return value
 */
export type BatchManyFn<TValue = unknown, TKey = string | number> = BatchLoadFn<
  TKey,
  TValue[]
>;

// Must have a `getDataLoaders()` that return a record of dataloaders
export interface HasDataLoaders {
  getDataLoaders(): { [string]: DataLoader };
}
