import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Model,
  Types,
  Schema as MongooseSchema,
} from 'mongoose';

import {
  VehicleState,
  plateIdRegExp,
  rearSeatRegExp,
  vehicleStates,
} from '../vehicle.constants';
import {
  EmbeddedCarModelDocument,
  embeddedCarModelSchema,
} from 'src/api/car-model/schema';
import { Cooperative, CooperativeDocument } from 'src/api/cooperative/schema';
import {
  VehicleSeatsCount,
  vehicleSeatsCountSchema,
} from './vehicle-seats-count.schema';

@Schema({ autoCreate: false })
export class EmbeddedVehicle {
  // (Numéro d'immatriculation de la plaque)
  @Prop({
    type: String,
    required: true,
    validate(value: string) {
      return plateIdRegExp.test(value);
    },
  })
  plateId: string;

  @Prop({
    type: String,
    required: true,
    enum: vehicleStates,
  })
  state: VehicleState;

  @Prop({
    type: embeddedCarModelSchema,
    required: true,
  })
  model: EmbeddedCarModelDocument;

  // The count of the vehicles's seats
  @Prop({
    type: vehicleSeatsCountSchema,
    required: true,
  })
  seatsCount: VehicleSeatsCount;

  // Rear seats that are removed from the original design of the vehicle.
  // They are typically used to free some space for some walking area within the vehicle.
  @Prop({
    type: [
      {
        type: String,
        required: true,
        validate(value: string) {
          return rearSeatRegExp.test(value);
        },
      },
    ],
  })
  removedSeats?: string[];

  @Prop({
    type: MongooseSchema.ObjectId,
    ref: Cooperative.name,
    required: true,
    index: true,
  })
  cooperative: Types.ObjectId | CooperativeDocument;
}

export const embeddedVehicleSchema =
  SchemaFactory.createForClass(EmbeddedVehicle);

export type EmbeddedVehicleDocument = HydratedDocument<EmbeddedVehicle>;
export type EmbeddedVehicleModel = Model<EmbeddedVehicle>;
