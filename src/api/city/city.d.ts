import { ReplaceFields } from 'src/common/types/utils';
import { CitySeederPayload } from './city.seeder';
import { WithoutTimestamps } from 'src/common/types/timestamps';

export type EmbeddedCitySeed = ReplaceFields<
  WithoutTimestamps<CitySeederPayload>,
  {
    weight?: number;
  }
>;
