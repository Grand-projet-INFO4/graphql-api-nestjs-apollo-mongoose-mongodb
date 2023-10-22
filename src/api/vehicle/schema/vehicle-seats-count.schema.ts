import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Schema for storing the number of seats of a vehicles
@Schema({ timestamps: false, autoCreate: false })
export class VehicleSeatsCount {
  // Front seats count
  @Prop({
    type: Number,
    required: true,
    default: 2,
    validate(value: number) {
      return value >= 1;
    },
  })
  front: number;

  // Rear seats columns count
  @Prop({
    type: Number,
    required: true,
    default: 2,
    validate(value: number) {
      return value >= 2;
    },
  })
  rearCols: number;

  // Rear seats rows count
  @Prop({
    type: Number,
    required: true,
    validate(value: number) {
      return value >= 1;
    },
  })
  rearRows: number;
}

export const vehicleSeatsCountSchema =
  SchemaFactory.createForClass(VehicleSeatsCount);
