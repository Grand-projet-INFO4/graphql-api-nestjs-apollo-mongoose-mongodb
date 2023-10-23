import {
  AddBookingMutationPayload,
  BookingMode,
  PaymentMethod,
} from 'src/graphql/schema';

export class AddBookingDTO implements AddBookingMutationPayload {
  personName: string;

  phone: string;

  email?: string;

  mode: BookingMode;

  plannedTripId: string;

  seats: string[];

  paymentMethod: PaymentMethod;

  paymentService?: string;

  parkingLotId?: string;
}
