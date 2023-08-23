import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import {
  GeoJSONPoint,
  geoJSONPointSchema,
} from 'src/common/schemas/geojson-point.schema';

@Schema({ timestamps: true, autoCreate: false })
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
}

export const embeddedTrackingDeviceSchema = SchemaFactory.createForClass(
  EmbeddedTrackingDevice,
);

export type EmbeddedTrackingDeviceDocument =
  HydratedDocument<EmbeddedTrackingDevice>;
export type EmbeddedTrackingDeviceModel = Model<EmbeddedTrackingDevice>;
