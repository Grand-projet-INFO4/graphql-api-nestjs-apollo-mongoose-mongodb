import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';

import { Region, regionSchema } from 'src/api/region/schema';
import { RegionSeeder } from 'src/api/region/region.seeder';
import { City, citySchema } from 'src/api/city/schema';
import { CitySeeder } from 'src/api/city/city.seeder';
import { UserSeeder } from 'src/api/user/user.seeder';
import { User, userSchema } from 'src/api/user/schema';
import { Highway, highwaySchema } from 'src/api/highway/schema';
import { HighwaySeeder } from 'src/api/highway/highway.seeder';
import { SocialMedia, socialMediaSchema } from 'src/api/social-media/schema';
import { SocialMediaSeeder } from 'src/api/social-media/social-media.seeder';
import { Cooperative, cooperativeSchema } from 'src/api/cooperative/schema';
import { CooperativeSeeder } from 'src/api/cooperative/cooperative.seeder';
import { BusStationSeeder } from 'src/api/bus-station/bus-station.seeder';
import { BusStation, busStationSchema } from 'src/api/bus-station/schema';
import {
  ParkingLot,
  parkingLotSchema,
} from 'src/api/parking-lot/schema/parking-lot.schema';
import { ParkingLotSeeder } from 'src/api/parking-lot/parking-lot.seeder';
import { Photo, photoSchema } from 'src/api/photo/schema';
import { PhotoSeeder } from 'src/api/photo/photo.seeder';
import { CarModelSeeder } from 'src/api/car-model/car-model.seeder';
import { VehicleSeeder } from 'src/api/vehicle/vehicle.seeder';
import { CarModel, carModelSchema } from 'src/api/car-model/schema';
import { Vehicle, vehicleSchema } from 'src/api/vehicle/schema';
import { Driver, driverSchema } from 'src/api/driver/schema';
import { DriverSeeder } from 'src/api/driver/driver.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL as string),
    MongooseModule.forFeature([{ name: Region.name, schema: regionSchema }]),
    MongooseModule.forFeature([{ name: City.name, schema: citySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: Highway.name, schema: highwaySchema }]),
    MongooseModule.forFeature([
      { name: SocialMedia.name, schema: socialMediaSchema },
    ]),
    MongooseModule.forFeature([
      { name: Cooperative.name, schema: cooperativeSchema },
    ]),
    MongooseModule.forFeature([
      { name: BusStation.name, schema: busStationSchema },
    ]),
    MongooseModule.forFeature([
      { name: ParkingLot.name, schema: parkingLotSchema },
    ]),
    MongooseModule.forFeature([{ name: Photo.name, schema: photoSchema }]),
    MongooseModule.forFeature([
      { name: CarModel.name, schema: carModelSchema },
    ]),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: vehicleSchema }]),
    MongooseModule.forFeature([{ name: Driver.name, schema: driverSchema }]),
  ],
}).run([
  UserSeeder,
  RegionSeeder,
  CitySeeder,
  HighwaySeeder,
  SocialMediaSeeder,
  CooperativeSeeder,
  BusStationSeeder,
  ParkingLotSeeder,
  PhotoSeeder,
  CarModelSeeder,
  VehicleSeeder,
  DriverSeeder,
]);
