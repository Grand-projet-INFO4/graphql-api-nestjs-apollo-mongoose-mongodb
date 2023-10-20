import { BoundingsBoxInput } from "../types/geojson";

/**
 * Gets the Longitude-Latitude pairs the 4 corners of a boundings box
 */
export function getBoundingsBoxPolygon(boundingsBox: BoundingsBoxInput) {
  return [[
    boundingsBox[0],
    [boundingsBox[1][0], boundingsBox[0][1]],
    boundingsBox[1],
    [boundingsBox[0][0], boundingsBox[1][1]],
    boundingsBox[0]
  ]]
}