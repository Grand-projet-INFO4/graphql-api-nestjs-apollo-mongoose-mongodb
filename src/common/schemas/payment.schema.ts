import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentMethod, paymentMethods } from '../constants/payment.constants';

@Schema({ autoCreate: false, timestamps: true })
export class Payment {
  // The amount of money that was paid in Ariary
  @Prop({
    type: Number,
    required: true,
    validate(value: number) {
      return value > 0;
    },
  })
  amount: number;

  // The exact date-time when the payment took place
  @Prop({ type: Date, required: true })
  paidAt: Date;

  @Prop({ type: String, required: true, enum: paymentMethods })
  method: PaymentMethod;

  // The name of the online service that executed the payment
  // e.g: Orange Money, Airtel Money, MVola, etc ...
  @Prop()
  service?: string;
}

export const paymentSchema = SchemaFactory.createForClass(Payment);
