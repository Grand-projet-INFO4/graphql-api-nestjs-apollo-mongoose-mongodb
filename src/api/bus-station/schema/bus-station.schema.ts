import {
  HydratedDocument,
  Model,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  EmbeddedPhotoDocument,
  embeddedPhotoSchema,
} from 'src/api/photo/schema';
import {
  GeoJSONPoint,
  geoJSONPointSchema,
} from 'src/common/schemas/geojson-point.schema';
import { EmbeddedCityDocument, embeddedCitySchema } from 'src/api/city/schema';

// Collection name
export const BUS_STATION_COLLECTION = 'busStations';

@Schema({ timestamps: true, collection: BUS_STATION_COLLECTION })
export class BusStation {
  @Prop({ type: String, required: true })
  stationName: string;

  @Prop()
  description?: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: MongooseSchema.ObjectId })
  mainPhotoId?: Types.ObjectId;

  @Prop({ type: [{ type: embeddedPhotoSchema, required: true }] })
  photos?: EmbeddedPhotoDocument[];

  @Prop({ type: geoJSONPointSchema, required: true, index: '2dsphere' })
  position: GeoJSONPoint;

  @Prop({ type: String, required: true })
  street: string;

  @Prop({ type: embeddedCitySchema, required: true })
  city: EmbeddedCityDocument;

  @Prop({ type: [{ type: String, required: true }], required: true })
  highways: string[];

  @Prop({ type: Date, index: true })
  createdAt: Date;

  @Prop({ type: Date, index: true })
  updatedAt: Date;
}

export const busStationSchema = SchemaFactory.createForClass(BusStation);

// Indexes
busStationSchema.index({ 'city._id': 1 });
busStationSchema.index({ 'city.region._id': 1 });
busStationSchema.index(
  {
    stationName: 'text',
    slug: 'text',
    street: 'text',
    'city.cityName': 'text',
  },
  { weights: { stationName: 2, slug: 2, street: 1, 'city.cityName': 1 } },
);

export type BusStationDocument = HydratedDocument<BusStation>;
export type BusStationModel = Model<BusStation>;
