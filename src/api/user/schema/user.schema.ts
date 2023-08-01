import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import { UserRole, USER_ROLES } from '../user.constants';
import { EmbeddedCityDocument, embeddedCitySchema } from 'src/api/city/schema';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String })
  photo?: string;

  @Prop({ type: embeddedCitySchema })
  city?: EmbeddedCityDocument;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, unique: true })
  phone?: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: { type: [String], required: true, enum: USER_ROLES },
    required: true,
  })
  roles: UserRole[];
}

export const userSchema = SchemaFactory.createForClass(User);

// Text search index on the firstName, lastName and username fields
userSchema.index(
  { firstName: 'text', lastName: 'text', username: 'text' },
  { name: 'user_text_index' },
);

export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;
