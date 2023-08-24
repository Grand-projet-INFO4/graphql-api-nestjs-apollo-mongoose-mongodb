import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TrackingDevice, trackingDeviceSchema } from './schema';

export const trackingDeviceMongooseModule = MongooseModule.forFeature([
  {
    name: TrackingDevice.name,
    schema: trackingDeviceSchema,
  },
]);

@Module({
  imports: [trackingDeviceMongooseModule],
  exports: [trackingDeviceMongooseModule],
})
export class TrackingDeviceModule {}
