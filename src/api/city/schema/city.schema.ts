import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import {
  EmbeddedRegionDocument,
  embeddedRegionSchema,
} from 'src/api/region/schema';

@Schema({ timestamps: true })
export class City {
  @Prop({ type: String, required: true, index: true })
  cityName: string;

  /**
   * Alternative city name
   * Some cities of madagascar have an alternative name inherited from the french colonialism
   */
  @Prop({ type: String, index: true })
  alt?: string;

  /**
   * The weight of a city determines the importance of the city amongst all cities
   * It scales from 1 to 5.
   * 5: Capital of Madagascar (Antananarivo)
   * 4: Capital of a province (Toamasina, Mahajanga, Antsiranana, Toliara, Fianaranstsoa)
   * 3: Captial of a region
   * 2: Capital of a district
   * 1: Basic small city (default)
   * This weight crucial for prioriting the most important cities first in the results sorting
   */
  @Prop({ type: Number, required: true, default: 1, index: true })
  weight: number;

  @Prop({ type: embeddedRegionSchema, required: true })
  region: EmbeddedRegionDocument;
}

export const citySchema = SchemaFactory.createForClass(City);

// Text search index
citySchema.index(
  {
    cityName: 'text',
    alt: 'text',
    'region.regionName': 'text',
    'region.province': 'text',
  },
  {
    name: 'cities_text_index',
    weights: {
      cityName: 2,
    },
  },
);
// Indexes on the region and province
citySchema.index({ 'region._id': 1 });
citySchema.index({ 'region.regionName': 1 });
citySchema.index({ 'region.province': 1 });

export type CityDocument = HydratedDocument<City>;
export type CityModel = Model<City>;
