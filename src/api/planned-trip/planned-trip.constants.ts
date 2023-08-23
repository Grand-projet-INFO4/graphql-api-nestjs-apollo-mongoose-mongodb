// The possible statuses for a planned trip
export enum PlannedTripStatus {
  Pending = 'PENDING',
  Filling = 'FILLING', // (Entrain de remplir les sièges/passagers)
  Ready = 'READY', // Ready for departure, there's no more seats that can be booked
  Cancelled = 'CANCELLED',
}
export const plannedTripStatuses = [
  PlannedTripStatus.Pending,
  PlannedTripStatus.Filling,
  PlannedTripStatus.Ready,
  PlannedTripStatus.Cancelled,
];
