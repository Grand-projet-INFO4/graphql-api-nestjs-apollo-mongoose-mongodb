import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import { UserRole, USER_ROLES, ADMIN_USER_ROLES } from '../user.constants';
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

  @Prop({ type: String, unique: true, sparse: true })
  phone?: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: [{ type: String, required: true, enum: USER_ROLES }],
    required: true,
  })
  roles: UserRole[];

  // Instance methods

  isAdmin: typeof isAdmin;
}

// Instance methods

/**
 * Checks whether the user has an application admin role
 *
 * @param strict If set to true, the user must strictly only have the `admin` role
 */
function isAdmin(this: UserDocument, strict = false): boolean {
  if (strict) return this.roles.includes(UserRole.Admin);
  return this.roles.some((role) => ADMIN_USER_ROLES.includes(role));
}

export const userSchema = SchemaFactory.createForClass(User);
// Instance methods
userSchema.methods = {
  isAdmin,
};

// Text search index on the firstName, lastName and username fields
userSchema.index(
  { firstName: 'text', lastName: 'text', username: 'text' },
  { name: 'user_text_index' },
);

export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;
