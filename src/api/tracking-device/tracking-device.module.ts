import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  EmbeddedTrackingDevice,
  TrackingDevice,
  embeddedTrackingDeviceSchema,
  trackingDeviceSchema,
} from './schema';

export const trackingDeviceMongooseModule = MongooseModule.forFeature([
  {
    name: TrackingDevice.name,
    schema: trackingDeviceSchema,
  },
]);

export const embeddedTrackingDeviceMongooseModule = MongooseModule.forFeature([
  {
    name: EmbeddedTrackingDevice.name,
    schema: embeddedTrackingDeviceSchema,
  },
]);

@Module({
  imports: [trackingDeviceMongooseModule, embeddedTrackingDeviceMongooseModule],
  exports: [trackingDeviceMongooseModule, embeddedTrackingDeviceMongooseModule],
})
export class TrackingDeviceModule {}
