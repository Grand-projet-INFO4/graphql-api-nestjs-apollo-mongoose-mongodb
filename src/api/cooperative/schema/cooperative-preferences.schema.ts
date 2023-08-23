import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true, autoCreate: false })
export class CooperativePreferences {
  // Delay in minutes during a trip checkout takes before the departure
  @Prop()
  tripCheckoutDelay?: number;
}

export const cooperativePreferencesSchema = SchemaFactory.createForClass(
  CooperativePreferences,
);

export type CooperativePreferencesDocument =
  HydratedDocument<CooperativePreferences>;
export type CooperativePreferencesModel = Model<CooperativePreferences>;
