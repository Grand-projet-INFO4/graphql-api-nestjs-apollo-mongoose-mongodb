import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DriverLicense, driverLicenseSchema } from './driver-license.schema';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: false, autoCreate: false })
export class TripDriver {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: driverLicenseSchema, required: true })
  license: DriverLicense;

  @Prop({ type: [{ type: String, required: true }], required: true })
  phones: string[];

  @Prop({ type: Date, required: true })
  hiredAt: Date;

  @Prop({ type: Date })
  latestTripAt?: Date;
}

export const tripDriverSchema = SchemaFactory.createForClass(TripDriver);

export type TripDriverDocument = HydratedDocument<TripDriver>;
export type TripDriverModel = Model<TripDriver>;
