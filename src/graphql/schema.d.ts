
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum CooperativeZone {
    NATIONAL = "NATIONAL",
    REGIONAL = "REGIONAL"
}

export enum SocialMediaPlatform {
    FACEBOOK = "FACEBOOK",
    INSTAGRAM = "INSTAGRAM",
    TWITTER = "TWITTER",
    TIKTOK = "TIKTOK"
}

export enum QuerySortOrder {
    asc = "asc",
    desc = "desc"
}

export enum GeoJSONType {
    Point = "Point"
}

export interface GetBusStationsQueryFilters {
    regionId?: Nullable<string>;
    cityId?: Nullable<string>;
    highways?: Nullable<string[]>;
    nearPoint?: Nullable<number[]>;
}

export interface GetCitiesQueryFilters {
    regionId?: Nullable<string>;
    weight?: Nullable<number>;
}

export interface GetDriversQueryFilters {
    licenseCategories?: Nullable<string[]>;
    cooperativeId?: Nullable<string>;
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
    busStations(pagination: QueryPagePaginationParams, textSearch?: Nullable<QueryTextSearchParams>, filters?: Nullable<GetBusStationsQueryFilters>): PaginatedBusStations | Promise<PaginatedBusStations>;
    cities(pagination: QueryPagePaginationParams, filters?: Nullable<GetCitiesQueryFilters>, textSearch?: Nullable<QueryTextSearchParams>, sort?: Nullable<QuerySortParams>): PagePaginatedCities | Promise<PagePaginatedCities>;
    cooperative(identifier: string): Cooperative | Promise<Cooperative>;
    drivers(pagination: QueryPagePaginationParams, textSearch?: Nullable<QueryTextSearchParams>, filters?: Nullable<GetDriversQueryFilters>, sort?: Nullable<QuerySortParams>): PaginatedDrivers | Promise<PaginatedDrivers>;
    driver(identifier: string): Driver | Promise<Driver>;
    highways(textSearch?: Nullable<QueryTextSearchParams>, sort?: Nullable<QuerySortParams>): Highway[] | Promise<Highway[]>;
    highway(identifier?: Nullable<string>): Highway | Promise<Highway>;
    regions(filters?: Nullable<GetRegionsQueryFilters>, sort?: Nullable<QuerySortParams>): Region[] | Promise<Region[]>;
    users(): User[] | Promise<User[]>;
}

export interface BusStation {
    __typename?: 'BusStation';
    id: string;
    stationName: string;
    description?: Nullable<string>;
    slug: string;
    mainPhotoId?: Nullable<string>;
    mainPhoto?: Nullable<string>;
    photos?: Nullable<EmbeddedPhoto[]>;
    position: GeoJSONPoint;
    street: string;
    city: EmbeddedCity;
    highways: string[];
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface PaginatedBusStations {
    __typename?: 'PaginatedBusStations';
    page: number;
    limit: number;
    count: number;
    items: BusStation[];
}

export interface City {
    __typename?: 'City';
    id: string;
    cityName: string;
    region: Region;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface PagePaginatedCities {
    __typename?: 'PagePaginatedCities';
    page: number;
    limit: number;
    count: number;
    items: City[];
}

export interface EmbeddedCity {
    __typename?: 'EmbeddedCity';
    id: string;
    cityName: string;
    region: Region;
}

export interface Cooperative {
    __typename?: 'Cooperative';
    id: string;
    coopName: string;
    description?: Nullable<string>;
    slug: string;
    zone?: Nullable<CooperativeZone>;
    profilePhoto: string;
    transparentLogo?: Nullable<string>;
    coverPhoto?: Nullable<string>;
    city: EmbeddedCity;
    address: string;
    email?: Nullable<string>;
    phones: string[];
    websiteURL?: Nullable<string>;
    socialMedias?: Nullable<SocialMediaLink[]>;
    highways: string[];
}

export interface Driver {
    __typename?: 'Driver';
    id: string;
    firstName: string;
    lastName: string;
    photo?: Nullable<string>;
    license: DriverLicense;
    email?: Nullable<string>;
    phones: string[];
    hiredAt?: Nullable<DateTime>;
    latestTripAt?: Nullable<DateTime>;
    user?: Nullable<User>;
    cooperative?: Nullable<Cooperative>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface DriverLicense {
    __typename?: 'DriverLicense';
    licenseId: string;
    categories: string[];
}

export interface PaginatedDrivers {
    __typename?: 'PaginatedDrivers';
    page: number;
    limit: number;
    count: number;
    items: Driver[];
}

export interface Highway {
    __typename?: 'Highway';
    id: string;
    no: string;
    cities: EmbeddedCity[];
    distance?: Nullable<number>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface EmbeddedPhoto {
    __typename?: 'EmbeddedPhoto';
    id: string;
    filename: string;
    url: string;
    description?: Nullable<string>;
}

export interface Region {
    __typename?: 'Region';
    id: string;
    regionName: string;
    province: string;
}

export interface SocialMediaLink {
    __typename?: 'SocialMediaLink';
    platoform: SocialMediaPlatform;
    url: string;
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

export interface GeoJSONPoint {
    __typename?: 'GeoJSONPoint';
    type: GeoJSONType;
    coordinates: number[];
}

export type Void = any;
export type DateTime = any;
type Nullable<T> = T | null;
