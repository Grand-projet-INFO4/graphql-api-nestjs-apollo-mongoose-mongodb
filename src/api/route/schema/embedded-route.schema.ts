import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import {
  EmbeddedParkingLotDocument,
  embeddedParkingLotSchema,
} from 'src/api/parking-lot/schema';

@Schema({ autoCreate: false })
export class EmbeddedRoute {
  // (Frais de transport)
  @Prop({
    type: Number,
    required: true,
    validate: (value: number) => value > 0,
  })
  fee: number;

  // The approximated/estimated duration of the route's trip in minutes
  @Prop({
    type: Number,
    required: true,
    validate: (value: number) => value > 0,
  })
  approxDuration: number;

  // The maximum tolerated duration of the route's trip in minutes
  @Prop({
    type: Number,
    required: true,
    validate: (value: number) => value > 0,
  })
  maxDuration: number;

  @Prop({ type: [{ type: String, required: true }], required: true })
  highways: string[];

  // Distance in kilometers between the location of the departure and the location of the destination
  @Prop({
    type: Number,
    required: true,
    validate: (value: number) => value > 0,
  })
  distance: number;

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    required: true,
  })
  cooperative: Types.ObjectId | CooperativeDocument;

  @Prop({
    type: [{ type: embeddedParkingLotSchema, required: true }],
    required: true,
  })
  parkingLots: EmbeddedParkingLotDocument[];
}

export const embeddedRouteSchema = SchemaFactory.createForClass(EmbeddedRoute);

export type EmbeddedRouteDocument = HydratedDocument<EmbeddedRoute>;
export type EmbeddedRouteModel = Model<EmbeddedRoute>;
