// The possibles statuses of a vehicle
export enum VehicleStatus {
  InUse = 'IN_USE', // En service
  OutOfService = 'OUT_OF_SERVICE', // Hors-service
  Reviewed = 'REVIEWED', // En visite technique
  Maintained = 'MAINTAINED', // En maintenance
  Repaired = 'REPAIRED', // En cours de réparation
}
export const vehicleStatuses = [
  VehicleStatus.InUse,
  VehicleStatus.OutOfService,
  VehicleStatus.Reviewed,
  VehicleStatus.Maintained,
  VehicleStatus.Repaired,
];

// The possible states (états) of a vehicle
export enum VehicleState {
  Operational = 'OPERATIONAL', // Opérationnel
  Failing = 'FAILING', // Défaillant
  Damaged = 'DAMAGED', // Endommagé
}
export const vehicleStates = [
  VehicleState.Operational,
  VehicleState.Failing,
  VehicleState.Damaged,
];

// Regular expression for a rear seat
// Concatenation of 2 numbers that correspond to the row and column respectively
export const rearSeatRegExp = /^\d{2,3}$/;

// Regular expression for a front seat
// Uppercase alphabetic letter starting from 'A' to whatever the number of front seats is
export const frontSeatRegExp = /^\w{1}$/;

// Regular expression for a vehicle plate id
export const plateIdRegExp = /^\d{4}\s{1}[A-Z]{2,3}$/;

// The folder that stores the vehicles photos in the static images directory
export const VEHICLES_PHOTOS_DIR = 'vehicles';
