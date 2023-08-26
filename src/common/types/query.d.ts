import { SortOrder } from 'mongoose';

export type SortParams = {
  sortBy: string;
  order: SortOrder;
};

export type PagePaginationParams = { limit: number; page: number };
export type CursorPaginationParams<TCursor = Record<string, unknown>> = {
  limit: number;
  cursor: TCursor;
};

export type PaginationParams<TCursor = Record<string, unknown>> =
  | { limit: number; page: number }
  | { limit: number; cursor: TCursor };

export type TextSearchParams = {
  search?: string; // Partial text search using RegExp
  text?: string; // Full-text search using Text index
};

export type BaseQueryParams = SortParams & PagePaginationParams & SearchParams;

export type PagePaginated<TItem = unknown> = {
  page: number;
  limit: number;
  count: number;
  items: TItem[];
};
