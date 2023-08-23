import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  SOCIAL_MEDIA_PLATFORMS,
  SocialMediaPlatform,
} from '../social-media.constants';
import { HydratedDocument, Model } from 'mongoose';

/**
 * Collection for the social media platforms that users and cooperatives can refer to in the application
 */
@Schema({ collection: 'socialMedias' })
export class SocialMedia {
  // The name of the social platform
  @Prop({
    type: String,
    required: true,
    enum: SOCIAL_MEDIA_PLATFORMS,
    unique: true,
  })
  platform: SocialMediaPlatform;

  // The URL to the landing page of the social media platform
  @Prop({
    type: String,
    required: true,
  })
  url: string;

  @Prop({ type: String, required: true })
  logo: string;
}

export const socialMediaSchema = SchemaFactory.createForClass(SocialMedia);

export type SocialMediaDocument = HydratedDocument<SocialMedia>;
export type SocialMediaModel = Model<SocialMedia>;
