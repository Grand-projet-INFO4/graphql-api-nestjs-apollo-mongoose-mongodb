import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Model,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';

import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import { User, UserDocument } from 'src/api/user/schema';
import { UserRole, COOPERATIVE_USER_ROLES } from 'src/api/user/user.constants';

// Cooperative admins collection name
export const COOPERATIVE_ADMIN_COLLECTION = 'cooperativeAdmins';

@Schema({ timestamps: true, collection: COOPERATIVE_ADMIN_COLLECTION })
export class CooperativeAdmin {
  @Prop({ type: String, required: true, enum: COOPERATIVE_USER_ROLES })
  role: UserRole;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user: Types.ObjectId | UserDocument;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    required: true,
    index: true,
  })
  cooperative: Types.ObjectId | CooperativeDocument;
}

export const cooperativeAdminSchema =
  SchemaFactory.createForClass(CooperativeAdmin);

export type CooperativeAdminDocument = HydratedDocument<CooperativeAdmin>;
export type CooperativeAdminModel = Model<CooperativeAdmin>;
