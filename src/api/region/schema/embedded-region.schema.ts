import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({
  // Disable the collection auto-creation since this is intended to be an embedded document
  autoCreate: false,
})
export class EmbeddedRegion {
  @Prop({ type: String, required: true })
  regionName: string;

  @Prop({ type: String, required: true })
  province: string;
}

export const embeddedRegionSchema =
  SchemaFactory.createForClass(EmbeddedRegion);

export type EmbeddedRegionDocument = HydratedDocument<EmbeddedRegion>;
export type EmbeddedRegionModel = Model<EmbeddedRegion>;
