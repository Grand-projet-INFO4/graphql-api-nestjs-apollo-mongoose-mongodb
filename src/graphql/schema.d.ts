
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum QuerySortOrder {
    asc = "asc",
    desc = "desc"
}

export interface GetCitiesQueryFilters {
    regionId?: Nullable<string>;
    weight?: Nullable<number>;
}

export interface GetRegionsQueryFilters {
    province?: Nullable<string>;
}

export interface QuerySortParams {
    sortBy: string;
    order: QuerySortOrder;
}

export interface QueryPagePaginationParams {
    page: number;
    limit: number;
}

export interface QueryTextSearchParams {
    search?: Nullable<string>;
    text?: Nullable<string>;
}

export interface IQuery {
    __typename?: 'IQuery';
    cities(pagination: QueryPagePaginationParams, filters?: Nullable<GetCitiesQueryFilters>, textSearch?: Nullable<QueryTextSearchParams>, sort?: Nullable<QuerySortParams>): PagePaginatedCities | Promise<PagePaginatedCities>;
    regions(filters?: Nullable<GetRegionsQueryFilters>, sort?: Nullable<QuerySortParams>): Region[] | Promise<Region[]>;
    users(): User[] | Promise<User[]>;
}

export interface City {
    __typename?: 'City';
    id: string;
    cityName: string;
    region: Region;
}

export interface PagePaginatedCities {
    __typename?: 'PagePaginatedCities';
    page: number;
    limit: number;
    count: number;
    items: City[];
}

export interface Cooperative {
    __typename?: 'Cooperative';
    id?: Nullable<string>;
}

export interface Region {
    __typename?: 'Region';
    id: string;
    regionName: string;
    province: string;
}

export interface User {
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    photo?: Nullable<string>;
    email: string;
    phone: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export type Void = any;
export type DateTime = any;
type Nullable<T> = T | null;
