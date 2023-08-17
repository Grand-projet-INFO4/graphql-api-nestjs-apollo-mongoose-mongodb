import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { EmbeddedCityDocument, embeddedCitySchema } from 'src/api/city/schema';

/**
 * A highway refers an official so called 'route nationale' here in Madagascar.
 */

@Schema()
export class Highway {
  /**
   * The number order of the highway.
   * It is of a string type because some highways' number order are suffixed with a letter
   * Example: 1, 1b, 2, 3, ...
   */
  @Prop({ type: String, required: true, unique: true })
  no: string;

  /**
   * The cities that are linked by the highway.
   * It must contain at least 2 cities which correspond to the starting point and the ending point of the highway.
   * It can also contain intermediate cities between the starting and the ending point for the sake of clarity
   * but the order of the cities along the highway must be preserved inside the array in that case.
   * Example: [Antananarivo, Analavory, Belobaka, Tsiroanomandidy] for RN1
   */
  @Prop({
    type: [{ type: embeddedCitySchema, required: true }],
    required: true,
  })
  cities: EmbeddedCityDocument[];

  /**
   * Distance in kilometers of the highway
   */
  @Prop({ type: Number })
  distance?: number;
}

export const highwaySchema = SchemaFactory.createForClass(Highway);

// Indexes
highwaySchema.index({ city_id: 1 });
// Full text index
highwaySchema.index(
  {
    no: 'text',
    'city.cityName': 'text',
    'city.region.regionName': 'text',
    'city.region.province': 'text',
  },
  {
    weights: {
      no: 4,
      'city.cityName': 3,
      'city.region.regionName': 2,
      'city.region.province': 1,
    },
  },
);

export type HighwayDocument = HydratedDocument<Highway>;
export type HighwayModel = Model<Highway>;
