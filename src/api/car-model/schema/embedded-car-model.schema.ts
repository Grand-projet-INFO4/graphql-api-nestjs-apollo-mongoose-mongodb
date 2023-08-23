import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ autoCreate: false })
export class EmbeddedCarModel {
  @Prop({ type: String, required: true })
  modelName: string;

  @Prop({ type: String, required: true })
  brand: string;
}

export const embeddedCarModelSchema =
  SchemaFactory.createForClass(EmbeddedCarModel);

export type EmbeddedCarModelDocument = HydratedDocument<EmbeddedCarModel>;
export type EmbeddedCarModelModel = Model<EmbeddedCarModel>;
