
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum BookingMode {
    IN_PERSON = "IN_PERSON",
    ONLINE = "ONLINE"
}

export enum BookingPersonAttendance {
    WAITING = "WAITING",
    CONFIRMED = "CONFIRMED",
    MISSED = "MISSED"
}

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

export enum CooperativeZone {
    NATIONAL = "NATIONAL",
    REGIONAL = "REGIONAL"
}

export enum PlannedTripStatus {
    PENDING = "PENDING",
    FILLING = "FILLING",
    READY = "READY",
    CANCELLED = "CANCELLED"
}

export enum SocialMediaPlatform {
    FACEBOOK = "FACEBOOK",
    INSTAGRAM = "INSTAGRAM",
    TWITTER = "TWITTER",
    TIKTOK = "TIKTOK"
}

export enum TripStatus {
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    INTERRUPTED = "INTERRUPTED"
}

export enum VehicleStatus {
    IN_USE = "IN_USE",
    OUT_OF_SERVICE = "OUT_OF_SERVICE",
    REVIEWED = "REVIEWED",
    MAINTAINED = "MAINTAINED",
    REPAIRED = "REPAIRED"
}

export enum VehicleState {
    OPERATIONAL = "OPERATIONAL",
    FAILING = "FAILING",
    DAMAGED = "DAMAGED"
}

export enum QuerySortOrder {
    asc = "asc",
    desc = "desc"
}

export enum GeoJSONType {
    Point = "Point"
}

export enum PaymentMethod {
    CASH = "CASH",
    MOBILE_MONEY = "MOBILE_MONEY",
    DEBIT_CARD = "DEBIT_CARD",
    CREDIT_CARD = "CREDIT_CARD"
}

export interface GetBookingsQueryFilters {
    cooperativeId?: Nullable<string>;
    plannedTripId?: Nullable<string>;
    tripId?: Nullable<string>;
    mode?: Nullable<BookingMode>;
}

export interface AddBookingMutationPayload {
    personName: string;
    phone: string;
    email?: Nullable<string>;
    seats: string[];
    mode: BookingMode;
    paymentMethod: PaymentMethod;
    paymentService?: Nullable<string>;
    parkingLotId?: Nullable<string>;
    plannedTripId: string;
}

export interface GetBusStationsQueryFilters {
    regionId?: Nullable<string>;
    cityId?: Nullable<string>;
    highways?: Nullable<string[]>;
    nearPoint?: Nullable<number[]>;
    boundingsBox?: Nullable<number[][]>;
}

export interface GetCitiesQueryFilters {
    regionId?: Nullable<string>;
    weight?: Nullable<number>;
}

export interface GetDriversQueryFilters {
    licenseCategories?: Nullable<string[]>;
    cooperativeId?: Nullable<string>;
}

export interface GetParkingLotsQueryFilters {
    cooperativeId?: Nullable<string>;
    nearPoint?: Nullable<number[]>;
    boundingsBox?: Nullable<number[][]>;
}

export interface GetPlannedTripsFilters {
    cooperativeId?: Nullable<string>;
    fromCityId?: Nullable<string>;
    fromParkingLotId?: Nullable<string>;
    toCityId?: Nullable<string>;
    toParkingLotId?: Nullable<string>;
    closedPath?: Nullable<boolean>;
    status?: Nullable<PlannedTripStatus>;
    availSeatsCount?: Nullable<number>;
    startsAfter?: Nullable<string>;
}

export interface GetRegionsQueryFilters {
    province?: Nullable<string>;
}

export interface GetRoutesQueryFilters {
    cooperativeId?: Nullable<string>;
    parkingLotId?: Nullable<string>;
    cityId?: Nullable<string>;
    highways?: Nullable<string[]>;
}

export interface GetTripsFilters {
    cooperativeId?: Nullable<string>;
    fromCityId?: Nullable<string>;
    fromParkingLotId?: Nullable<string>;
    toCityId?: Nullable<string>;
    toParkingLotId?: Nullable<string>;
    closedPath?: Nullable<boolean>;
    status?: Nullable<TripStatus>;
}

export interface GetVehiclesQueryFilters {
    cooperativeId?: Nullable<string>;
    nearPoint?: Nullable<number[]>;
    boundingsBox?: Nullable<number[][]>;
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
    bookings(pagination: QueryPagePaginationParams, sort?: Nullable<QuerySortParams>, textSearch?: Nullable<QueryTextSearchParams>, filters?: Nullable<GetBookingsQueryFilters>): PagePaginatedBookings | Promise<PagePaginatedBookings>;
    busStations(pagination: QueryPagePaginationParams, textSearch?: Nullable<QueryTextSearchParams>, filters?: Nullable<GetBusStationsQueryFilters>): PaginatedBusStations | Promise<PaginatedBusStations>;
    cities(pagination: QueryPagePaginationParams, filters?: Nullable<GetCitiesQueryFilters>, textSearch?: Nullable<QueryTextSearchParams>, sort?: Nullable<QuerySortParams>): PagePaginatedCities | Promise<PagePaginatedCities>;
    cooperative(identifier: string): Cooperative | Promise<Cooperative>;
    drivers(pagination: QueryPagePaginationParams, textSearch?: Nullable<QueryTextSearchParams>, filters?: Nullable<GetDriversQueryFilters>, sort?: Nullable<QuerySortParams>): PaginatedDrivers | Promise<PaginatedDrivers>;
    driver(identifier: string): Driver | Promise<Driver>;
    highways(textSearch?: Nullable<QueryTextSearchParams>, sort?: Nullable<QuerySortParams>): Highway[] | Promise<Highway[]>;
    highway(identifier?: Nullable<string>): Highway | Promise<Highway>;
    parkingLots(pagination: QueryPagePaginationParams, sort?: Nullable<QuerySortParams>, filters?: Nullable<GetParkingLotsQueryFilters>): PaginatedParkingLots | Promise<PaginatedParkingLots>;
    plannedTrips(pagination: QueryPagePaginationParams, sort?: Nullable<QuerySortParams>, filters?: Nullable<GetPlannedTripsFilters>): PagePaginatedPlannedTrips | Promise<PagePaginatedPlannedTrips>;
    regions(filters?: Nullable<GetRegionsQueryFilters>, sort?: Nullable<QuerySortParams>): Region[] | Promise<Region[]>;
    routes(pagination: QueryPagePaginationParams, sort?: Nullable<QuerySortParams>, filters?: Nullable<GetRoutesQueryFilters>): PagePaginatedRoutes | Promise<PagePaginatedRoutes>;
    trips(pagination: QueryPagePaginationParams, sort?: Nullable<QuerySortParams>, filters?: Nullable<GetTripsFilters>): PagePaginatedTrips | Promise<PagePaginatedTrips>;
    users(): User[] | Promise<User[]>;
    vehicles(pagination: QueryPagePaginationParams, sort?: Nullable<QuerySortParams>, filters?: Nullable<GetVehiclesQueryFilters>): Nullable<PagePaginatedVehicles> | Promise<Nullable<PagePaginatedVehicles>>;
}

export interface IMutation {
    __typename?: 'IMutation';
    addBooking(payload: AddBookingMutationPayload): Booking | Promise<Booking>;
}

export interface Booking {
    __typename?: 'Booking';
    id: string;
    personName: string;
    phone: string;
    email?: Nullable<string>;
    seats: string[];
    mode: BookingMode;
    payment: Payment;
    secretCode?: Nullable<string>;
    attendance: BookingPersonAttendance;
    parkingLot?: Nullable<ParkingLot>;
    plannedTrip?: Nullable<PlannedTrip>;
    trip?: Nullable<Trip>;
    cooperative: Cooperative;
    user?: Nullable<User>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface EmbeddedBooking {
    __typename?: 'EmbeddedBooking';
    id: string;
    personName: string;
    phone: string;
    email?: Nullable<string>;
    seats: string[];
    mode: BookingMode;
    payment: Payment;
    secretCode?: Nullable<string>;
    attendance: BookingPersonAttendance;
    parkingLot?: Nullable<ParkingLot>;
    user?: Nullable<User>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface PagePaginatedBookings {
    __typename?: 'PagePaginatedBookings';
    page: number;
    limit: number;
    count: number;
    items: Booking[];
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

export interface EmbeddedCarModel {
    __typename?: 'EmbeddedCarModel';
    id: string;
    modelName: string;
    brand: string;
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

export interface TripDriver {
    __typename?: 'TripDriver';
    id: string;
    firstName: string;
    lastName: string;
    license: DriverLicense;
    phones: string[];
    hiredAt: DateTime;
    latestTripAt?: Nullable<DateTime>;
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

export interface ParkingLot {
    __typename?: 'ParkingLot';
    id: string;
    address: string;
    locationHint?: Nullable<string>;
    position: GeoJSONPoint;
    city?: Nullable<EmbeddedCity>;
    mainPhoto?: Nullable<CooperativePhoto>;
    phones?: Nullable<string[]>;
    openHours: WeekOpenHours;
    cooperative: Cooperative;
    busStation?: Nullable<BusStation>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface PaginatedParkingLots {
    __typename?: 'PaginatedParkingLots';
    page: number;
    limit: number;
    count: number;
    items: ParkingLot[];
}

export interface EmbeddedParkingLot {
    __typename?: 'EmbeddedParkingLot';
    id: string;
    address: string;
    locationHint?: Nullable<string>;
    position: GeoJSONPoint;
    city?: Nullable<EmbeddedCity>;
    openHours: WeekOpenHours;
    cooperative: Cooperative;
    mainPhoto: CooperativePhoto;
    busStation?: Nullable<BusStation>;
}

export interface CooperativePhoto {
    __typename?: 'CooperativePhoto';
    id: string;
    filename: string;
    url: string;
    description?: Nullable<string>;
    cooperativeId: string;
    parkingLotId?: Nullable<string>;
}

export interface EmbeddedPhoto {
    __typename?: 'EmbeddedPhoto';
    id: string;
    filename: string;
    url: string;
    description?: Nullable<string>;
}

export interface PlannedTrip {
    __typename?: 'PlannedTrip';
    id: string;
    route: EmbeddedRoute;
    path: TripPath;
    reservedSeats?: Nullable<string[]>;
    availSeatsCount: number;
    bookings: EmbeddedBooking[];
    status: PlannedTripStatus;
    checkoutDelay?: Nullable<number>;
    startsAt: DateTime;
    vehicle: Vehicle;
    drivers: Driver[];
    cooperative: Cooperative;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface PagePaginatedPlannedTrips {
    __typename?: 'PagePaginatedPlannedTrips';
    page: number;
    limit: number;
    count: number;
    items: PlannedTrip[];
}

export interface Region {
    __typename?: 'Region';
    id: string;
    regionName: string;
    province: string;
}

export interface Route {
    __typename?: 'Route';
    id: string;
    fee: number;
    approxDuration: number;
    maxDuration: number;
    highways: string[];
    distance: number;
    cooperative: Cooperative;
    parkingLots: ParkingLot[];
}

export interface PagePaginatedRoutes {
    __typename?: 'PagePaginatedRoutes';
    page: number;
    limit: number;
    count: number;
    items: Route[];
}

export interface EmbeddedRoute {
    __typename?: 'EmbeddedRoute';
    id: string;
    fee: number;
    approxDuration: number;
    maxDuration: number;
    highways: string[];
    distance: number;
    cooperative: Cooperative;
    parkingLots: EmbeddedParkingLot[];
}

export interface SocialMediaLink {
    __typename?: 'SocialMediaLink';
    platoform: SocialMediaPlatform;
    url: string;
}

export interface EmbeddedTrackingDevice {
    __typename?: 'EmbeddedTrackingDevice';
    serialId: string;
    position: GeoJSONPoint;
    speed: number;
    connected: boolean;
    disconnectedAt: DateTime;
    updatedAt: DateTime;
}

export interface Trip {
    __typename?: 'Trip';
    id: string;
    route: EmbeddedRoute;
    path: TripPath;
    currentVehicle: EmbeddedVehicle;
    currentDriver: TripDriver;
    reservedSeats?: Nullable<string[]>;
    bookings: EmbeddedBooking[];
    status: TripStatus;
    checkoutDelay?: Nullable<number>;
    startsAt: DateTime;
    startedAt?: Nullable<DateTime>;
    completedAt?: Nullable<DateTime>;
    vehicle: Vehicle;
    drivers: Driver[];
    cooperative: Cooperative;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface TripPath {
    __typename?: 'TripPath';
    from: EmbeddedCity;
    to: EmbeddedCity;
}

export interface PagePaginatedTrips {
    __typename?: 'PagePaginatedTrips';
    page: number;
    limit: number;
    count: number;
    items: Trip[];
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

export interface Vehicle {
    __typename?: 'Vehicle';
    id: string;
    plateId: string;
    mainPhotoId?: Nullable<string>;
    mainPhoto?: Nullable<EmbeddedPhoto>;
    photos?: Nullable<EmbeddedPhoto[]>;
    status: VehicleStatus;
    state: VehicleState;
    tracker?: Nullable<EmbeddedTrackingDevice>;
    model: EmbeddedCarModel;
    seatsCount: VehicleSeatsCount;
    removedSeats?: Nullable<string[]>;
    totalSeatsCount: number;
    cooperative: Cooperative;
    ongoingTrip?: Nullable<Trip>;
    drivers: Driver[];
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface VehicleSeatsCount {
    __typename?: 'VehicleSeatsCount';
    front: number;
    rearCols: number;
    rearRows: number;
}

export interface EmbeddedVehicle {
    __typename?: 'EmbeddedVehicle';
    id: string;
    plateId: string;
    state: VehicleState;
    model: EmbeddedCarModel;
    seatsCount: VehicleSeatsCount;
    removedSeats?: Nullable<string[]>;
    cooperative: Cooperative;
}

export interface PagePaginatedVehicles {
    __typename?: 'PagePaginatedVehicles';
    page: number;
    limit: number;
    count: number;
    items: Vehicle[];
}

export interface GeoJSONPoint {
    __typename?: 'GeoJSONPoint';
    type: GeoJSONType;
    coordinates: number[];
}

export interface WeekOpenHours {
    __typename?: 'WeekOpenHours';
    opensAt: string;
    closesAt: string;
    tzOffset: string;
}

export interface Payment {
    __typename?: 'Payment';
    amount: number;
    paidAt: DateTime;
    method: PaymentMethod;
    service?: Nullable<string>;
}

export type Void = any;
export type DateTime = any;
type Nullable<T> = T | null;
