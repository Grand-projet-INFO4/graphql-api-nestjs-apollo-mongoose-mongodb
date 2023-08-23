import { Connection, mongo } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';

import { BUS_STATION_COLLECTION, BusStation, BusStationModel } from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { CitySeeder, CitySeederPayload } from '../city/city.seeder';
import { ReplaceFields } from 'src/common/types/utils';
import { GeoJSONPoint } from 'src/common/schemas/geojson-point.schema';
import { EmbeddedPhotoSeed } from '../photo/photo';
import { generateEmbeddedPhotosSeed } from '../photo/helpers/embedded-photos-seed.helper';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';

export type BusStationSeederPayload = WithMongoId<
  ReplaceFields<
    BusStation,
    {
      city: CitySeederPayload;
      mainPhotoId?: mongo.BSON.ObjectId;
      photos?: EmbeddedPhotoSeed[];
    }
  >
>;

export class BusStationSeeder implements Seeder {
  // Bus stations seed data singleton
  private static busStations: BusStationSeederPayload[] | null = null;

  // Singleton of a map of the bus stations seed data with the slug as the key
  private static busStationSlugMap: Map<
    string,
    BusStationSeederPayload
  > | null = null;

  constructor(
    @InjectModel(BusStation.name) private busStationModel: BusStationModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.busStationModel.insertMany(BusStationSeeder.getBusStations());
    await session.commitTransaction();
    console.log(`Seeded the \`${BUS_STATION_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.busStationModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection(BUS_STATION_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${BUS_STATION_COLLECTION}\` collection ...`);
  }

  // Getter for the bus stations seed data singleton
  static getBusStations() {
    if (!BusStationSeeder.busStations) {
      const cityNameMap = CitySeeder.getCityNameMap();
      const fasankaranaPhotosSeed = generateEmbeddedPhotosSeed(
        [
          'fasanny-karana(1).webp',
          'zotra-nasionaly.webp',
          'fasanny-karana.webp',
          'fasankarana.jpg',
          'Taxibrousse-8-1000x525.jpg',
          'mini-bus-depo-a-antananarivo-madagascar-a5fhkc.jpg',
          'stationnement_0.jpg',
        ],
        'fasanny-karana(1).webp',
      );
      const makiPhotosSeed = generateEmbeddedPhotosSeed(
        [
          '150272511_3837168923008388_2387244086463493217_n.jpg',
          '69720071_2518046824920611_3188775001213894656_n.jpg',
          '71529145_2581966015195358_8532281553768677376_n.jpg',
          '71546894_2581966125195347_8907844231549157376_n.jpg',
          '71563895_2581966021862024_1567434497765408768_n.jpg',
          '71949495_2581966005195359_69884263276740608_n.jpg',
          '73294815_2641670059224953_1316290837797142528_n.jpg',
        ],
        '150272511_3837168923008388_2387244086463493217_n.jpg',
      );
      const estPhotosSeed = generateEmbeddedPhotosSeed(
        [
          'P_20191221_082319.jpg',
          'P_20191221_082340.jpg',
          'P_20191221_082349.jpg',
          '24585629_22KbuiWi5MIal4fiVjCvKjTt3CuNXtpFfgpU1eHgKRU.jpg',
          '3592298_Mq047C7yg0XE9mRHPcTSwO9iGAcK6p_34ZLmFO62MyU.jpg',
          '24585629_g0e6KoOXUiifPrrr7_G1bVDkqNOVRJt71_Fv0fMi36U.jpg',
        ],
        'P_20191221_082319.jpg',
      );
      const mahajangaPhotosSeed = generateEmbeddedPhotosSeed(
        [
          'aranta-2.PNG',
          'Capture-25.png',
          '6356192_orig.jpg',
          '1-97-990x556.png',
          'aranta-1.PNG',
          'aranta-3.PNG',
        ],
        'aranta-2.PNG',
      );
      const antsirananaPhotosSeed = generateEmbeddedPhotosSeed(
        [
          'nouvelle-gare-routiere-toujours-inoccupee-fit-640x480.jpg',
          '50536356_501070063751769_3269709974825074688_n.jpg',
          'gare-routiere-d-antsiranana-fit-640x360.jpg',
          'nouvelle-gare-routiere-antsiranana.jpg',
        ],
        'nouvelle-gare-routiere-toujours-inoccupee-fit-640x480.jpg',
      );
      const fianaraSudPhotosSeed = generateEmbeddedPhotosSeed(
        [
          '82250668_1336237236547833_8282611394000453632_n.jpg',
          'station-de-bus-a-fianarantsoa-madagacar-ax9mgn.jpg',
          '69668821.jpg',
          '2021-12-14.jpg',
          '2023-07-05.jpg',
          '2021-12-14(1).jpg',
        ],
        '82250668_1336237236547833_8282611394000453632_n.jpg',
      );
      const tanambao5PhotosSeed = generateEmbeddedPhotosSeed(
        ['jkljjlkjlkj.PNG', 'jfdslkfjdlskfjlk.PNG', 'ghfhfghjjotrh.PNG'],
        'jfdslkfjdlskfjlk.PNG',
      );
      const feneriveEstPhotosSeed = generateEmbeddedPhotosSeed(
        ['IMG_20230808_234923.jpg', 'IMG_20230808_234854.jpg'],
        'IMG_20230808_234923.jpg',
      );
      const moramangaPhotosSeed = generateEmbeddedPhotosSeed(
        [
          '2023-06-14.jpg',
          '2023-06-14(3).jpg',
          '2023-06-14(2).jpg',
          '2023-06-14(1).jpg',
          '2023-06-14(4).jpg',
        ],
        '2023-06-14.jpg',
      );
      const ambalabakoPhotosSeed = generateEmbeddedPhotosSeed(
        [
          '2022-05-22.jpg',
          '42841632.jpg',
          'IMG_0923.JPG',
          '119517634_201484561335907_7070859348638938949_n.jpg',
          '119644342_201484484669248_7027626185759991950_n.jpg',
        ],
        '2022-05-22.jpg',
      );
      const manakaraPhotosSeed = generateEmbeddedPhotosSeed(
        [
          'manakara-station.PNG',
          'manakara-station-2.PNG',
          'manakara-station-1.PNG',
        ],
        'manakara-station.PNG',
      );
      const toliaraPhotosSeed = generateEmbeddedPhotosSeed(
        [
          'les-gens-et-les-bagages-dans-un-taxi-brousse-taxi-brousse-a-toliara-toliary-tulear-atsimo-andrefana-au-sud-ouest-de-madagascar-bp0g21.jpg',
          'taxi-brousse-taxi-brousse-a-toliara-toliary-tulear-atsimo-andrefana-au-sud-ouest-de-madagascar-bp0g61.jpg',
          'madagascar-toliara-taxi-brousse-pousse-pousse-et-camion-brousse-d5h69j.jpg',
          'taxi-brousse-depot-a-toliara-montrant-differents-types-de-transport-y-compris-les-camions-les-rickshaws-tirees-a-la-main-et-les-taxis-atsimo-andrefana-madagascar-ddjhr3.jpg',
        ],
        'les-gens-et-les-bagages-dans-un-taxi-brousse-taxi-brousse-a-toliara-toliary-tulear-atsimo-andrefana-au-sud-ouest-de-madagascar-bp0g21.jpg',
      );
      const busStations: BusStationSeederPayload[] = [
        {
          _id: new mongo.ObjectId(),
          stationName: "Gare routière fasan'ny karàna",
          slug: 'fasankarana',
          city: cityNameMap.get('Antananarivo'),
          street:
            "Route digue fasan'ny karàna Ankadimbahoaka, Antananarivo, Madagascar",
          position: new GeoJSONPoint([47.51573736625678, -18.9458462774446]),
          highways: ['1', '1a', '1b', '7', '12', '13', '25', '34', '35'],
          mainPhotoId: fasankaranaPhotosSeed.mainPhotoId,
          photos: fasankaranaPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière Maki',
          slug: 'gare-routiere-maki',
          city: cityNameMap.get('Antananarivo'),
          street: 'Route digue Andohatapenaka, Antananarivo, Madagascar',
          position: new GeoJSONPoint([47.496054, -18.898222]),
          highways: ['2', '4', '5', '6', '5a', '32', '44'],
          mainPhotoId: makiPhotosSeed.mainPhotoId,
          photos: makiPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: "Gare routière de l'Est",
          slug: 'gare-routiere-ampasampito',
          city: cityNameMap.get('Antananarivo'),
          street: 'Jovenna Ampasampito, Antananarivo, Madagascar',
          position: new GeoJSONPoint([47.548932, -18.893833]),
          highways: ['2', '5', '11a'],
          mainPhotoId: estPhotosSeed.mainPhotoId,
          photos: estPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: "Gare routière d'Aranta",
          slug: 'gare-routiere-aranta',
          city: cityNameMap.get('Mahajanga'),
          street: 'Avenue Barday, Mahajanga, Madagascar',
          position: new GeoJSONPoint([46.32691279558178, -15.721833425717419]),
          highways: ['4', '6', '5a'],
          mainPhotoId: mahajangaPhotosSeed.mainPhotoId,
          photos: mahajangaPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière Jovenna Antsiranana',
          slug: 'gare-routiere-antsiranana',
          city: cityNameMap.get('Antsiranana'),
          street: 'Scama, Antsiranana, Madagascar',
          position: new GeoJSONPoint([49.294825265425224, -12.3228863961827]),
          highways: ['4', '6', '5a'],
          mainPhotoId: antsirananaPhotosSeed.mainPhotoId,
          photos: antsirananaPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière du Sud Fianarantsoa',
          slug: 'gare-routiere-sud-fianarantsoa',
          city: cityNameMap.get('Fianarantsoa'),
          street: 'RN7 Ankazondrano, Fianarantsoa, Madagascar',
          position: new GeoJSONPoint([47.09031222741544, -21.452205146287877]),
          highways: ['7', '12', '13', '25', '34', '35'],
          mainPhotoId: fianaraSudPhotosSeed.mainPhotoId,
          photos: fianaraSudPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière du Nord Manakara',
          slug: 'gare-routiere-nord-manakara',
          city: cityNameMap.get('Manakara'),
          street: 'Mangarivotra, Manakara, Madagascar',
          position: new GeoJSONPoint([48.01353841805343, -22.130930998769113]),
          highways: ['7', '12', '25'],
          mainPhotoId: manakaraPhotosSeed.mainPhotoId,
          photos: manakaraPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière Toliara',
          slug: 'gare-routiere-toliara',
          city: cityNameMap.get('Toliara'),
          street: "Route d'interêt général, Toliara, Madagascar",
          position: new GeoJSONPoint([43.680890598763874, -23.35476249473319]),
          highways: ['7', '13', '34', '35'],
          mainPhotoId: toliaraPhotosSeed.mainPhotoId,
          photos: toliaraPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière Morondava',
          slug: 'gare-routiere-morondava',
          city: cityNameMap.get('Morondava'),
          street: 'Rue principale, Morondava, Madagascar',
          position: new GeoJSONPoint([44.27646, -20.2908751]),
          highways: ['7', '34', '35'],
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière Tanambao V',
          slug: 'gare-routiere-tanambao-5',
          city: cityNameMap.get('Toamasina'),
          street: "Boulevard d'Andovoranto, Toamasina, Madagascar",
          position: new GeoJSONPoint([49.4056437615076, -18.15042276034348]),
          highways: ['2', '3a', '5', '11a', '44'],
          mainPhotoId: tanambao5PhotosSeed.mainPhotoId,
          photos: tanambao5PhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière Fenoarivo Atsinanana',
          slug: 'gare-routiere-fenerive-est',
          city: cityNameMap.get('Fenoarivo Atsinanana'),
          street: 'Mahavelonkely, Fenoarivo Atsinanana, Madagascar',
          position: new GeoJSONPoint([49.4117829, -17.3830036]),
          highways: ['2', '3a', '5', '11a', '44'],
          mainPhotoId: feneriveEstPhotosSeed.mainPhotoId,
          photos: feneriveEstPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière Moramanga',
          slug: 'gare-routiere-moramanga',
          city: cityNameMap.get('Moramanga'),
          street: 'Route axe sud, Moramanga, Madagascar',
          position: new GeoJSONPoint([48.22998356780619, -18.94790672697453]),
          highways: ['2', '3a', '5', '11a', '44'],
          mainPhotoId: moramangaPhotosSeed.mainPhotoId,
          photos: moramangaPhotosSeed.photos,
        },
        {
          _id: new mongo.ObjectId(),
          stationName: 'Gare routière Ambalabako',
          slug: 'gare-routiere-ambalabako',
          city: cityNameMap.get('Ambatondrazaka'),
          street: 'RN44 Ambalabako, Ambatondrazaka, Madagascar',
          position: new GeoJSONPoint([48.42270956682009, -17.84508476912953]),
          highways: ['2', '3a', '5', '11a', '44'],
          mainPhotoId: ambalabakoPhotosSeed.mainPhotoId,
          photos: ambalabakoPhotosSeed.photos,
        },
      ];
      BusStationSeeder.busStations = busStations;
    }
    return BusStationSeeder.busStations;
  }

  /**
   * Getter for the bus stations slug map singleton
   */
  static getBusStationSlugMap() {
    if (!BusStationSeeder.busStationSlugMap) {
      const busStationSlugMap = new Map<string, BusStationSeederPayload>();
      for (const busStation of BusStationSeeder.getBusStations()) {
        busStationSlugMap.set(busStation.slug, busStation);
      }
      BusStationSeeder.busStationSlugMap = busStationSlugMap;
    }
    return BusStationSeeder.busStationSlugMap;
  }
}
