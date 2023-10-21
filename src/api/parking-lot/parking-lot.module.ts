import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingLot, parkingLotSchema } from './schema';
import { ParkingLotResolver } from './parking-lot.resolver';
import { ParkingLotService } from './parking-lot.service';

const parkingLotModule = MongooseModule.forFeature([
  {
    name: ParkingLot.name,
    schema: parkingLotSchema,
  },
]);

@Module({
  imports: [parkingLotModule],
  providers: [ParkingLotResolver, ParkingLotService],
  exports: [parkingLotModule, ParkingLotService],
})
export class ParkingLotModule {}
