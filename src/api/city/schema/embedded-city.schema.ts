import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HydratedDocument } from 'mongoose';

import {
  EmbeddedRegionDocument,
  embeddedRegionSchema,
} from 'src/api/region/schema';

@Schema({ autoCreate: false })
export class EmbeddedCity {
  @Prop({ type: String, required: true })
  cityName: string;

  @Prop({ type: embeddedRegionSchema, required: true })
  region: EmbeddedRegionDocument;
}

export const embeddedCitySchema = SchemaFactory.createForClass(EmbeddedCity);

export type EmbeddedCityDocument = HydratedDocument<EmbeddedCity>;
export type EmbeddedCityModel = Model<EmbeddedCity>;
