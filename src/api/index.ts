import { BookingModule } from './booking/booking.module';
import { BusStationModule } from './bus-station/bus-station.module';
import { CarModelModule } from './car-model/car-model.module';
import { CityModule } from './city/city.module';
import { CooperativeAdminModule } from './cooperative-admin/cooperative-admin.module';
import { CooperativeModule } from './cooperative/cooperative.module';
import { DriverModule } from './driver/driver.module';
import { HighwayModule } from './highway/highway.module';
import { ParkingLotModule } from './parking-lot/parking-lot.module';
import { PhotoModule } from './photo/photo.module';
import { PlannedTripModule } from './planned-trip/planned-trip.module';
import { RegionModule } from './region/region.module';
import { RouteModule } from './route/route.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { TrackingDeviceModule } from './tracking-device/tracking-device.module';
import { TripModule } from './trip/trip.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';

// Array of all the modules of the GraphQL API's resources
// It's facilitates the import of all these modules from other parts of the application
export const apiModules = [
  UserModule,
  RegionModule,
  CityModule,
  BusStationModule,
  CooperativeModule,
  HighwayModule,
  ParkingLotModule,
  PhotoModule,
  SocialMediaModule,
  VehicleModule,
  CarModelModule,
  TrackingDeviceModule,
  DriverModule,
  RouteModule,
  PlannedTripModule,
  TripModule,
  BookingModule,
  CooperativeAdminModule,
];
