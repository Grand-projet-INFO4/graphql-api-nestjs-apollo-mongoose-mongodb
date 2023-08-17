import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Types,
  Schema as MongooseSchema,
  HydratedDocument,
  Model,
} from 'mongoose';
import { Cooperative } from 'src/api/cooperative/schema';
import { Vehicle } from 'src/api/vehicle/schema';

import {
  GeoJSONPoint,
  geoJSONPointSchema,
} from 'src/common/schemas/geojson-point.schema';

// Tracking devices colletion name
export const TRACKING_DEVICE_COLLECTION = 'trackingDevices';

@Schema({ collection: TRACKING_DEVICE_COLLECTION, timestamps: true })
export class TrackingDevice {
  // (Numéro de série)
  @Prop({ type: String, required: true, unique: true })
  serialId: string;

  @Prop({ type: geoJSONPointSchema, required: true, index: '2dsphere' })
  position: GeoJSONPoint;

  // Speed in km/h
  @Prop({ type: Number, required: true })
  speed: number;

  // Whether the device is currently being connected to the server or not
  @Prop({ type: Boolean, required: true, default: false })
  connected: boolean;

  @Prop({ type: MongooseSchema.ObjectId, ref: Vehicle.name })
  vehicle?: Types.ObjectId;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    required: true,
  })
  cooperative: Types.ObjectId;
}

export const trackingDeviceSchema =
  SchemaFactory.createForClass(TrackingDevice);

// Indexes
trackingDeviceSchema.index({ cooperative: 1 });

export type TrackingDeviceDocument = HydratedDocument<TrackingDevice>;
export type TrackingDeviceModel = Model<TrackingDevice>;
