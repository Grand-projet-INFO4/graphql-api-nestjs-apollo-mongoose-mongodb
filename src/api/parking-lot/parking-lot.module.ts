import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingLot, parkingLotSchema } from './schema';

const parkingLotModule = MongooseModule.forFeature([
  {
    name: ParkingLot.name,
    schema: parkingLotSchema,
  },
]);

@Module({
  imports: [parkingLotModule],
  exports: [parkingLotModule],
})
export class ParkingLotModule {}
