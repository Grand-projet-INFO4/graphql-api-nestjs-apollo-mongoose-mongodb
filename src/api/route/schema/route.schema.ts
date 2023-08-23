import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import { ParkingLot, ParkingLotDocument } from 'src/api/parking-lot/schema';

// Routes collection name
export const ROUTE_COLLECTION = 'routes';

@Schema({ timestamps: true })
export class Route {
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
    type: [{ type: MongooseSchema.ObjectId, required: true }],
    ref: ParkingLot.name,
    required: true,
  })
  parkingLots: Types.ObjectId[] | ParkingLotDocument[];
}

export const routeSchema = SchemaFactory.createForClass(Route);

// Indexes
routeSchema.index({ cooperative: 1, parkingLots: 1 });

export type RouteDocument = HydratedDocument<Route>;
export type RouteModel = Model<Route>;
