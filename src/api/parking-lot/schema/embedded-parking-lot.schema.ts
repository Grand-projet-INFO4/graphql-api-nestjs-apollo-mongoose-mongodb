import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Model,
  Types,
  Schema as MongooseSchema,
} from 'mongoose';

import { BusStation, BusStationDocument } from 'src/api/bus-station/schema';
import { CityDocument, embeddedCitySchema } from 'src/api/city/schema';
import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import {
  GeoJSONPoint,
  geoJSONPointSchema,
} from 'src/common/schemas/geojson-point.schema';
import {
  WeekOpenHours,
  weekOpenHoursSchema,
} from 'src/common/schemas/week-open-hours.schema';

@Schema({ autoCreate: false, timestamps: false })
export class EmbeddedParkingLot {
  @Prop({ type: String, required: true })
  address: string;

  @Prop()
  locationHint?: string;

  @Prop({ type: geoJSONPointSchema, required: true })
  position: GeoJSONPoint;

  @Prop({ type: embeddedCitySchema, required: true })
  city: CityDocument;

  @Prop({ type: weekOpenHoursSchema, required: true })
  openHours: WeekOpenHours;

  @Prop({ type: MongooseSchema.ObjectId, ref: Cooperative.name })
  cooperative: Types.ObjectId | CooperativeDocument;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: BusStation.name,
  })
  busStation?: Types.ObjectId | BusStationDocument;
}

export const embeddedParkingLotSchema =
  SchemaFactory.createForClass(EmbeddedParkingLot);

export type EmbeddedParkingLotDocument = HydratedDocument<EmbeddedParkingLot>;
export type EmbeddedParkingLotModel = Model<EmbeddedParkingLot>;
