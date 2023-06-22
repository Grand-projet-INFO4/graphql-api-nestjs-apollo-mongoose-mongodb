export interface QueryParams {
  sort?: string;
  search?: string;
}

export interface PaginationParams extends QueryParams {
  page?: number;
  limit?: number;
}
