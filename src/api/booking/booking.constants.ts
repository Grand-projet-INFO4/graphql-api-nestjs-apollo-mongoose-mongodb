// The possible modes of trip booking
export enum BookingMode {
  // In person:
  // The person booked seats for the trip by physically going to one of the cooperative's parking lots
  InPerson = 'IN_PERSON',

  // Online:
  // The person booked seats for the trip through Zaha Dia's application (web and/or mobile) itself
  Online = 'ONLINE',
}
export const bookingModes = [BookingMode.InPerson, BookingMode.Online];

// The possible attendance values of the person that booked seats for a trip
// (Présence)
export enum BookingPersonAttendance {
  Waiting = 'WAITING', // (En attente de la personne chez le stationnement de départ)
  Confirmed = 'CONFIRMED', // (Présence confirmée)
  Missed = 'MISSED', // (Absent / Raté le voyage)
}
export const bookingPersonAttendances = [
  BookingPersonAttendance.Waiting,
  BookingPersonAttendance.Confirmed,
  BookingPersonAttendance.Missed,
];

// The possible statuses of a boking
export enum BookingStatus {
  Pending = 'PENDING', // Not confirmed yet. An eventual booking cancellation thereafter comes with a refund.
  Confirmed = 'CONFIRMED', // If the booking is then cancelled, a refund of the payment is no longer possible
  Cancelled = 'CANCELLED',
}
export const bookingStatuses = [
  BookingStatus.Pending,
  BookingStatus.Confirmed,
  BookingStatus.Cancelled,
];
