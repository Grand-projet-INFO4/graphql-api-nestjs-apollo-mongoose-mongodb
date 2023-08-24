import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  SOCIAL_MEDIA_PLATFORMS,
  SocialMediaPlatform,
} from '../social-media.constants';

/**
 * Embedded document for storing a user or cooperative's link to an existing social media platform
 */
@Schema({ autoCreate: false })
export class SocialMediaLink {
  // Name of the social media platform
  @Prop({
    type: [{ type: String, required: true, enum: SOCIAL_MEDIA_PLATFORMS }],
    required: true,
  })
  platform: SocialMediaPlatform;

  // URL to the user or cooperative's social media platform's profile
  @Prop({ type: String, required: true })
  url: string;
}

export const socialMediaLinkSchema =
  SchemaFactory.createForClass(SocialMediaLink);

export type SocialMediaLinkDocument = HydratedDocument<SocialMediaLink>;
