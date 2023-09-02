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

@Schema({ collection: TRACKING_DEVICE_COLLECTION })
export class TrackingDevice {
  // (Numéro de série)
  @Prop({ type: String, required: true, unique: true })
  serialId: string;

  @Prop({ type: geoJSONPointSchema, required: true, index: '2dsphere' })
  position: GeoJSONPoint;

  // Speed in km/h
  @Prop({ type: Number, required: true, default: 0 })
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
    index: true,
  })
  cooperative?: Types.ObjectId;

  // Date-Time of the most recent disconnection of the device
  @Prop()
  disconnectedAt?: Date;

  @Prop({
    type: Date,
    required: true,
  })
  createdAt: Date;

  // Date-Time of the update of either the position, speed, connected or vehicle fields
  @Prop({
    type: Date,
    required: true,
  })
  updatedAt: Date;
}

export const trackingDeviceSchema =
  SchemaFactory.createForClass(TrackingDevice);

export type TrackingDeviceDocument = HydratedDocument<TrackingDevice>;
export type TrackingDeviceModel = Model<TrackingDevice>;
