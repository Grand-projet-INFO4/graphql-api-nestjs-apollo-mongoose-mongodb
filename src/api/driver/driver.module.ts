import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Driver, driverSchema } from './schema';
import { DriverService } from './driver.service';
import { DriverResolver } from './driver.resolver';
import { DriverPolicy } from './driver.policy';
import { BindDriverIdArgPipe } from './pipe';

const driverMongooseModule = MongooseModule.forFeature([
  {
    name: Driver.name,
    schema: driverSchema,
  },
]);

@Module({
  imports: [driverMongooseModule],
  exports: [driverMongooseModule],
  providers: [DriverService, DriverResolver, DriverPolicy, BindDriverIdArgPipe],
})
export class DriverModule {}
