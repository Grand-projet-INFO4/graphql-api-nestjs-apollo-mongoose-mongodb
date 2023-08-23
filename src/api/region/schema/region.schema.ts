import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Region {
  @Prop({ type: String, required: true, unique: true })
  regionName: string;

  @Prop({ type: String, required: true, index: true })
  province: string;
}

export const regionSchema = SchemaFactory.createForClass(Region);

// Full text index
regionSchema.index(
  { regionName: 'text', province: 'text' },
  {
    name: 'regions_text_index',
    weights: {
      regionName: 2,
    },
  },
);

export type RegionDocument = HydratedDocument<Region>;
export type RegionModel = Model<Region>;
