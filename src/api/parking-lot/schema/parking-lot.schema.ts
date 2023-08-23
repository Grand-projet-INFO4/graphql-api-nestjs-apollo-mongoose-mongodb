import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Types,
  Schema as MongooseSchema,
  HydratedDocument,
  Model,
} from 'mongoose';

import { BusStation, BusStationDocument } from 'src/api/bus-station/schema';
import { CityDocument, embeddedCitySchema } from 'src/api/city/schema';
import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import { Photo, PhotoDocument } from 'src/api/photo/schema';
import {
  GeoJSONPoint,
  geoJSONPointSchema,
} from 'src/common/schemas/geojson-point.schema';
import {
  WeekOpenHours,
  weekOpenHoursSchema,
} from 'src/common/schemas/week-open-hours.schema';

export const PARKING_LOT_COLLECTION = 'parkingLots';

@Schema({ collection: PARKING_LOT_COLLECTION, timestamps: true })
export class ParkingLot {
  @Prop({ type: String, required: true })
  address: string;

  @Prop()
  locationHint?: string;

  @Prop({ type: geoJSONPointSchema, required: true, index: '2dsphere' })
  position: GeoJSONPoint;

  @Prop({ type: embeddedCitySchema, required: true })
  city: CityDocument;

  @Prop({ type: MongooseSchema.ObjectId, ref: Photo.name })
  mainPhoto?: Types.ObjectId | PhotoDocument;

  @Prop({ type: [{ type: String, required: true }], required: true })
  phones: string[];

  @Prop({ type: weekOpenHoursSchema, required: true })
  openHours: WeekOpenHours;

  @Prop({ type: MongooseSchema.ObjectId, ref: Cooperative.name, index: true })
  cooperative: Types.ObjectId | CooperativeDocument;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: BusStation.name,
    index: true,
    sparse: true,
  })
  busStation?: Types.ObjectId | BusStationDocument;
}

export const parkingLotSchema = SchemaFactory.createForClass(ParkingLot);

// Indexes
parkingLotSchema.index({ 'city._id': 1 });

export type ParkingLotDocument = HydratedDocument<ParkingLot>;
export type ParkingLotModel = Model<ParkingLot>;
