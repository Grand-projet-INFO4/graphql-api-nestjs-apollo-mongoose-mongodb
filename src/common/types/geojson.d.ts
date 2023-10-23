/**
 * Type of a boundings box input sent from the client queries
 * 
 * The first sub-tuple represents the Longitude-Latitude pair of the top-left corner of the box
 * The second sub-tuple represents the Longitude-Latitude pair of the bottom-right corner of the box
 */
export type BoundingsBoxInput = [[number, number], [number, number]]