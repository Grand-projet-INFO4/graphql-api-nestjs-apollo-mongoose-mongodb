export type WithoutTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>;
