import { SortOrder } from 'mongoose';

export type SortParams = {
  sortBy: string;
  order: SortOrder;
};

export type PaginationParams<TCursor = Record<string, unknown>> =
  | { limit: number; page: number }
  | { limit: number; cursor: TCursor };

export type SearchParams = {
  search?: string;
};

export type BaseQueryParams = SortParams & PaginationParams & SearchParams;
