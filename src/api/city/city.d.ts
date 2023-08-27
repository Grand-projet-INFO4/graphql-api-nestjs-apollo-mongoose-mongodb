import { ReplaceFields } from 'src/common/types/utils';
import { CitySeederPayload } from './city.seeder';

export type EmbeddedCitySeed = ReplaceFields<
  CitySeederPayload,
  {
    weight?: number;
  }
>;
