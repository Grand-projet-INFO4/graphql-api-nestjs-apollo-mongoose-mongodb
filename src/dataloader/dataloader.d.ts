import DataLoader, { BatchLoadFn } from 'dataloader';

/**
 * Batch function that return a single batched value per key
 *
 * @param TKey The type of a key item
 * @param TValue The type of a batched return value
 */
export type BatchOneFn<TKey = string | number, TValue = unknown> = BatchLoadFn<
  TKey,
  TValue
>;

/**
 * Batch function that return an array of batched values per key
 *
 * @param TKey The type of a key item
 * @param TValue The type of a item inside the batched array return value
 */
export type BatchManyFn<TKey = string | number, TValue = unknown> = BatchLoadFn<
  TKey,
  TValue[]
>;

// Must have a `getLoaders()` that return a record of dataloaders
export interface HasLoaders {
  getLoaders(): { [string]: DataLoader };
}
