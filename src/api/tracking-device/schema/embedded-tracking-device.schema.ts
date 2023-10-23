import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  GeoJSONPoint,
  geoJSONPointSchema,
} from 'src/common/schemas/geojson-point.schema';

@Schema({ autoCreate: false })
export class EmbeddedTrackingDevice {
  // (Numéro de série)
  @Prop({ type: String, required: true })
  serialId: string;

  @Prop({ type: geoJSONPointSchema, required: true })
  position: GeoJSONPoint;

  // Speed in km/h
  @Prop({ type: Number, required: true })
  speed: number;

  // Whether the device is currently being connected to the server or not
  @Prop({ type: Boolean, required: true, default: false })
  connected: boolean;

  // Date-Time of the most recent disconnection of the device
  @Prop()
  disconnectedAt?: Date;

  // Date-Time of the update of either the position, speed or connectied fields
  @Prop({
    type: Date,
    required: true,
  })
  updatedAt: Date;
}

export const embeddedTrackingDeviceSchema = SchemaFactory.createForClass(
  EmbeddedTrackingDevice,
);

export type EmbeddedTrackingDeviceDocument =
  HydratedDocument<EmbeddedTrackingDevice>;
