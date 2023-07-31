import { Seeder } from 'nestjs-seeder';
import { Highway, HighwayModel } from './schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { WithMongoId } from 'src/common/types/mongo-id';
import { CitySeeder, CitySeederPayload } from '../city/city.seeder';
import { Connection, mongo } from 'mongoose';

export type HighwaySeederPayload = WithMongoId<
  Omit<Highway, 'cities'> & { cities: CitySeederPayload[] }
>;

export class HighwaySeeder implements Seeder {
  // Singleton the highways data seed
  private static highways: HighwaySeederPayload[] | null = null;

  constructor(
    @InjectModel(Highway.name) private highwayModel: HighwayModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.highwayModel.insertMany(HighwaySeeder.getHighways());
    await session.commitTransaction();
    console.log('Seeded the `highways` collection ...');
  }

  async drop() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.highwayModel.db.dropCollection('highways');
    await session.commitTransaction();
    console.log('Cleared the `highways` collection ...');
  }

  /**
   * Getter for the highways data seed singleton
   */
  static getHighways(): HighwaySeederPayload[] {
    if (!HighwaySeeder.highways) {
      const cityNameMap = CitySeeder.getCityNameMap();
      const highways: HighwaySeederPayload[] = [
        {
          _id: new mongo.ObjectId(),
          no: '1',
          cities: [
            cityNameMap.get('Antananarivo'),
            cityNameMap.get('Imerintsiatosika'),
            cityNameMap.get('Arivonimamo'),
            cityNameMap.get('Miarinarivo'),
            cityNameMap.get('Analavory'),
            cityNameMap.get('Belobaka'),
            cityNameMap.get('Tsiroanomandidy'),
          ],
          distance: 149,
        },
        {
          _id: new mongo.ObjectId(),
          no: '1a',
          cities: [
            cityNameMap.get('Tsiroanomandidy'),
            cityNameMap.get('Maintirano'),
          ],
        },
        {
          _id: new mongo.ObjectId(),
          no: '1b',
          cities: [
            cityNameMap.get('Analavory'),
            cityNameMap.get('Ankadinondry Sakay'),
            cityNameMap.get('Tsiroanomandidy'),
          ],
          distance: 94,
        },
        {
          _id: new mongo.ObjectId(),
          no: '2',
          cities: [
            cityNameMap.get('Antananarivo'),
            cityNameMap.get('Manjakandriana'),
            cityNameMap.get('Moramanga'),
            cityNameMap.get('Vohibinany'),
            cityNameMap.get('Toamasina'),
          ],
          distance: 367,
        },
        {
          _id: new mongo.ObjectId(),
          no: '3',
          cities: [
            cityNameMap.get('Antananarivo'),
            cityNameMap.get('Anjozorobe'),
          ],
          distance: 91,
        },
        {
          _id: new mongo.ObjectId(),
          no: '3a',
          cities: [
            cityNameMap.get('Vohidiala'),
            cityNameMap.get('Amparafaravola'),
            cityNameMap.get('Tanambe'),
            cityNameMap.get('Amboavory'),
            cityNameMap.get('Andilamena'),
          ],
          distance: 180,
        },
        {
          _id: new mongo.ObjectId(),
          no: '4',
          cities: [
            cityNameMap.get('Antananarivo'),
            cityNameMap.get('Ankazobe'),
            cityNameMap.get('Maevatanàna'),
            cityNameMap.get('Ambondromamy'),
            cityNameMap.get('Mahajanga'),
          ],
          distance: 570,
        },
        {
          _id: new mongo.ObjectId(),
          no: '5a',
          cities: [
            cityNameMap.get('Ambilobe'),
            cityNameMap.get('Sambava'),
            cityNameMap.get('Vohimarina'),
            cityNameMap.get('Antalaha'),
          ],
          distance: 406,
        },
        {
          _id: new mongo.ObjectId(),
          no: '6',
          cities: [
            cityNameMap.get('Ambondromamy'),
            cityNameMap.get('Mampikony'),
            cityNameMap.get('Boriziny'),
            cityNameMap.get('Antsohihy'),
            cityNameMap.get('Ambanja'),
            cityNameMap.get('Ambilobe'),
            cityNameMap.get('Antsiranana'),
          ],
          distance: 706,
        },
        {
          _id: new mongo.ObjectId(),
          no: '7',
          cities: [
            cityNameMap.get('Antananarivo'),
            cityNameMap.get('Ambatolampy'),
            cityNameMap.get('Antsirabe'),
            cityNameMap.get('Ambositra'),
            cityNameMap.get('Ambohimahasoa'),
            cityNameMap.get('Fianarantsoa'),
            cityNameMap.get('Ambalavao'),
            cityNameMap.get('Ihosy'),
            cityNameMap.get('Sakaraha'),
            cityNameMap.get('Toliara'),
          ],
          distance: 956,
        },
        {
          _id: new mongo.ObjectId(),
          no: '12',
          cities: [
            cityNameMap.get('Irondro'),
            cityNameMap.get('Manakara'),
            cityNameMap.get('Vohipeno'),
            cityNameMap.get('Farafangana'),
            cityNameMap.get('Vangaindrano'),
          ],
          distance: 300,
        },
        {
          _id: new mongo.ObjectId(),
          no: '13',
          cities: [
            cityNameMap.get('Ihosy'),
            cityNameMap.get('Betroka'),
            cityNameMap.get('Ambovombe'),
            cityNameMap.get('Amboasary-Atsimo'),
            cityNameMap.get('Taolagnaro'),
          ],
          distance: 493,
        },
        {
          _id: new mongo.ObjectId(),
          no: '25',
          cities: [
            cityNameMap.get('Ambohimahasoa'),
            cityNameMap.get('Vohiparara'),
            cityNameMap.get('Ifanadiana'),
            cityNameMap.get('Irondro'),
            cityNameMap.get('Mananjary'),
          ],
          distance: 165,
        },
        {
          _id: new mongo.ObjectId(),
          no: '32',
          cities: [
            cityNameMap.get('Antsohihy'),
            cityNameMap.get('Befandriana Avaratra'),
            cityNameMap.get('Mandritsara'),
          ],
          distance: 200,
        },
        {
          _id: new mongo.ObjectId(),
          no: '34',
          cities: [
            cityNameMap.get('Antsirabe'),
            cityNameMap.get('Miandrivazo'),
            cityNameMap.get('Malaimbandy'),
            cityNameMap.get('Morondava'),
          ],
          distance: 368,
        },
        {
          _id: new mongo.ObjectId(),
          no: '35',
          cities: [
            cityNameMap.get('Ambositra'),
            cityNameMap.get('Ambatofinandrahana'),
            cityNameMap.get('Malaimbandy'),
            cityNameMap.get('Morondava'),
          ],
          distance: 460,
        },
        {
          _id: new mongo.ObjectId(),
          no: '44',
          cities: [
            cityNameMap.get('Moramanga'),
            cityNameMap.get('Morarano-Gara'),
            cityNameMap.get('Amboasary-Gara'),
            cityNameMap.get('Vohidiala'),
            cityNameMap.get('Ambatondrazaka'),
            cityNameMap.get('Amboavory'),
          ],
          distance: 228,
        },
      ];
      HighwaySeeder.highways = highways;
    }
    return HighwaySeeder.highways;
  }
}
