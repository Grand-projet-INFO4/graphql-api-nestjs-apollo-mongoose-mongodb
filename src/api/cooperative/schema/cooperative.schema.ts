import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import { COOPERATIVE_ZONES, CooperativeZone } from '../cooperative.constants';
import {
  SocialMediaLinkDocument,
  socialMediaLinkSchema,
} from 'src/api/social-media/schema';
import {
  CooperativePreferencesDocument,
  cooperativePreferencesSchema,
} from './cooperative-preferences.schema';
import { EmbeddedCityDocument, embeddedCitySchema } from 'src/api/city/schema';

@Schema({ timestamps: true })
export class Cooperative {
  @Prop({ type: String, required: true })
  coopName: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    required: true,
    enum: COOPERATIVE_ZONES,
    default: CooperativeZone.National,
  })
  zone: CooperativeZone;

  @Prop({ type: String, required: true })
  profilePhoto: string;

  @Prop()
  transparentLogo?: string;

  @Prop()
  coverPhoto?: string;

  @Prop({ type: embeddedCitySchema, required: true })
  city: EmbeddedCityDocument;

  @Prop({ type: String, required: true })
  address: string;

  @Prop()
  email?: string;

  @Prop({ type: [{ type: String, required: true }], required: true })
  phones: string[];

  @Prop()
  websiteURL?: string;

  @Prop({
    type: [{ type: socialMediaLinkSchema, required: true }],
  })
  socialMedias?: SocialMediaLinkDocument[];

  // The number order (no) of Madagascar's highways
  @Prop({
    type: [{ type: String, required: true }],
    required: true,
    index: true,
  })
  highways: string[];

  @Prop({
    type: cooperativePreferencesSchema,
    required: true,
  })
  preferences: CooperativePreferencesDocument;
}

export const cooperativeSchema = SchemaFactory.createForClass(Cooperative);

// Indexes
cooperativeSchema.index({ 'city._id': 1 }, { sparse: true });
// Text search index
cooperativeSchema.index(
  { coopName: 'text', description: 'text', slug: 'text' },
  { name: 'cooperatives_text_index' },
);

export type CooperativeDocument = HydratedDocument<Cooperative>;
export type CooperativeModel = Model<Cooperative>;
