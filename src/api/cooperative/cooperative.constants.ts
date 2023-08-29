// Zone scope of the cooperative's transport
export enum CooperativeZone {
  National = 'NATIONAL',
  Regional = 'REGIONAL',
}
// Array of copereatives zones
export const COOPERATIVE_ZONES: CooperativeZone[] = [
  CooperativeZone.National,
  CooperativeZone.Regional,
];

// Folder that stores cooperatives photos within the static images directory
export const COOPERATIVE_PHOTOS_DIR = 'cooperatives';
