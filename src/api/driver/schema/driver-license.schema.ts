import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DriverLicenseCategory } from '../driver';

@Schema({ autoCreate: false, timestamps: false })
export class DriverLicense {
  @Prop({ type: String, required: true })
  licenseId: string;

  @Prop({
    type: [
      { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E', 'F'] },
    ],
    required: true,
  })
  categories: DriverLicenseCategory[];
}

export const driverLicenseSchema = SchemaFactory.createForClass(DriverLicense);
