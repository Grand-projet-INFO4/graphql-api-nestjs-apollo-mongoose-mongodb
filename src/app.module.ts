import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { UserModule } from './api/user/user.module';
import { GqlConfigService } from './graphql/gql-config.service';
import { DataloaderModule } from './dataloader/dataloader.module';
import { AuthModule } from './api/auth/auth.module';
import { RegionModule } from './api/region/region.module';
import { isProductionEnvironment } from './common/helpers/environment.helper';
import { CityModule } from './api/city/city.module';
import { RedisModule } from './redis/redis.module';
import { HighwayModule } from './api/highway/highway.module';
import { CooperativeModule } from './api/cooperative/cooperative.module';
import { SocialMediaModule } from './api/social-media/social-media.module';
import { BusStationModule } from './api/bus-station/bus-station.module';
import { PhotoModule } from './api/photo/photo.module';
import { ParkingLotModule } from './api/parking-lot/parking-lot.module';
import { VehicleModule } from './api/vehicle/vehicle.module';
import { CarModelModule } from './api/car-model/car-model.module';
import { TrackingDeviceModule } from './api/tracking-device/tracking-device.module';
import { DriverModule } from './api/driver/driver.module';
import { RouteModule } from './api/route/route.module';
import { PlannedTripModule } from './api/planned-trip/planned-trip.module';
import { BookingModule } from './api/booking/booking.module';
import { TripModule } from './api/trip/trip.module';
import { CooperativeAdminModule } from './api/cooperative-admin/cooperative-admin.module';

@Module({
  controllers: [AppController],
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      useClass: GqlConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL as string, {
      autoIndex: !isProductionEnvironment(process.env.NODE_ENV),
      directConnection: !isProductionEnvironment(process.env.NODE_ENV),
    }),
    UserModule,
    DataloaderModule,
    AuthModule,
    RegionModule,
    CityModule,
    RedisModule,
    HighwayModule,
    CooperativeModule,
    SocialMediaModule,
    BusStationModule,
    PhotoModule,
    ParkingLotModule,
    VehicleModule,
    CarModelModule,
    TrackingDeviceModule,
    DriverModule,
    RouteModule,
    PlannedTripModule,
    BookingModule,
    TripModule,
    CooperativeAdminModule,
  ],
})
export class AppModule {}
