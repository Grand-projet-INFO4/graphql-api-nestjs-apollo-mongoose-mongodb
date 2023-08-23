import { CitySeederPayload } from "../city/city.seeder";
import { TripPath } from "./schema";

export type TripPathSeed = {
  [Field in keyof TripPath]: CitySeederPayload
}