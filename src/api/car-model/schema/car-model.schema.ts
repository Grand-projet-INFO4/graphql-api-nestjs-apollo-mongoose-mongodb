import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

// Car models collection name
export const CAR_MODEL_COLLECTION = 'carModels';

@Schema({ collection: CAR_MODEL_COLLECTION, timestamps: true })
export class CarModel {
  @Prop({ type: String, required: true })
  modelName: string;

  @Prop({ type: String, required: true })
  brand: string;
}

export const carModelSchema = SchemaFactory.createForClass(CarModel);

// Indexes
carModelSchema.index({ brand: 1, modelName: 1 }, { unique: true });

export type CarModelDocument = HydratedDocument<CarModel>;
export type CarModelModel = Model<CarModel>;
