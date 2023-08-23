// The possible statuses of a trip
export enum TripStatus {
  Ongoing = 'ONGOING', // (En cours)
  Completed = 'COMPLETED', // (Terminé)
  Interrupted = 'INTERRUPTED', // (Intérrompu)
}
export const tripStatuses = [
  TripStatus.Ongoing,
  TripStatus.Completed,
  TripStatus.Interrupted,
];
