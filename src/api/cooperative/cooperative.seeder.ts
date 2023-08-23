import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, mongo } from 'mongoose';

import { WithMongoId } from 'src/common/types/mongo-id';
import { Cooperative, CooperativeModel } from './schema';
import { CooperativeZone } from './cooperative.constants';
import { CooperativePreferencesSeed } from './cooperative';
import { SocialMediaLinkSeed } from '../social-media/social-media';
import { SocialMediaPlatform } from '../social-media/social-media.constants';
import { CitySeeder, CitySeederPayload } from '../city/city.seeder';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';

export type CooperativeSeederPayload = Omit<
  WithMongoId<Cooperative>,
  'preferences' | 'socialMedias' | 'city'
> & {
  preferences: CooperativePreferencesSeed;
  socialMedias: SocialMediaLinkSeed[];
  city: CitySeederPayload;
};

@Injectable()
export class CooperativeSeeder implements Seeder {
  // Cooperatives seed data singleton
  private static cooperatives: CooperativeSeederPayload[] | null = null;

  // Singleton of a map of cooperatives seed data with the slug as the key
  private static cooperativeSlugMap: Map<
    string,
    CooperativeSeederPayload
  > | null = null;

  constructor(
    @InjectModel(Cooperative.name) private cooperativeModel: CooperativeModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.cooperativeModel.insertMany(CooperativeSeeder.getCooperatives());
    await session.commitTransaction();
    console.log('Seeded the `cooperatives` table ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.cooperativeModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection('cooperatives');
    await session.commitTransaction();
    console.log('Cleared the `cooperatives` table ...');
  }

  // Getter for the cooperatives seed data singleton
  static getCooperatives() {
    if (!CooperativeSeeder.cooperatives) {
      const cityNameMap = CitySeeder.getCityNameMap();
      const cooperatives: CooperativeSeederPayload[] = [
        {
          _id: new mongo.ObjectId(),
          coopName: 'Transport Vatsi',
          description:
            'Transport Vatsi se trouve à Antananarivo, Madagascar. La société travaille sur Consultance de transport comme activités d\'affaires. Elle relie notamment la capitale Antananarivo (Tananarive) aux deux grandes villes côtières de Mahajanga (Majunga) et de Toamasina (Tamatave). Transport Vatsi a toujours eu une éxcellente réputation dans le service de transport dans ces axes routiers en raison de leur qualité de service, la sécurité mais surtout grâce aux nombreux grands autocars surnommés "Boeings" dont elle possède qui sillonent ces routes.',
          slug: 'trans-vatsi',
          profilePhoto: '104573993_263928821695003_2611845275966236775_n7.jpg',
          transparentLogo:
            '104573993_263928821695003_2611845275966236775_n7-removebg-preview.png',
          city: cityNameMap.get('Antananarivo'),
          address: '4G5J+4RF, Antananarivo, Madagascar',
          phones: ['+261340419098'],
          zone: CooperativeZone.National,
          highways: ['2', '4'],
          preferences: {
            _id: new mongo.ObjectId(),
          },
          socialMedias: [
            {
              _id: new mongo.ObjectId(),
              platform: SocialMediaPlatform.Facebook,
              url: 'https://www.facebook.com/p/Transport-Vatsy-100069872634105/',
            },
          ],
        },
        {
          _id: new mongo.ObjectId(),
          coopName: 'KOFMAD',
          description:
            "KOFMAD est une coopérative de transport routiers offrant principalement comme service le transport en taxi-brousses de voyageurs à Madagascar. Une des particularités de KOFMAD est que la coopérative opère presque dans toute l'intégralité de l'île car elle dispose des stationnments et des services de transport dans tous les coins du pays. Opérant depuis très longtemps, KOFMAD a su acquérir une grande réputation en termes de service de transport à l'échelle de tout le térritoire national.",
          slug: 'kofmad',
          profilePhoto: '311135355_102282109340480_5854936483699053771_n.jpg',
          transparentLogo:
            '310116437_100994132802611_3189045434300332683_n-removebg-preview.png',
          city: cityNameMap.get('Antananarivo'),
          address: 'Antohomadinika, Antananarivo, Madagascar',
          phones: ['0387446891'],
          zone: CooperativeZone.National,
          highways: ['2', '4', '6', '7'],
          socialMedias: [
            {
              _id: new mongo.ObjectId(),
              platform: SocialMediaPlatform.Facebook,
              url: 'https://web.facebook.com/profile.php?id=100086760722828',
            },
          ],
          preferences: {
            _id: new mongo.ObjectId(),
          },
        },
        {
          _id: new mongo.ObjectId(),
          coopName: 'Kofimanga Plus',
          description:
            "Kofimanga Plus est une coopérative de transport en taxi-brousses de voyageurs opérant principalement dans la partie Est de Madagascar mais aussi sur l'axe de la route nationale numéro 4. Elle relie principalement les grandes villes d'Antananarivo (Tananarive), d'Ambatondrazaka, de Toamasina (Tamatave) et de Mahajanga (Majunga) mais possède également des stationnements dans les villes intermédiares telles que Fenoarivo Atsinanana (Fénérive- Est), Andasibe, Vatomandry, Mahanoro, Moramanga et Marovoay. Elle demeure jusqu'à ajourd'hui l'une des meilleures coopératives de transports opérant sur ces axes routiers.",
          slug: 'kofimanga-plus',
          profilePhoto: '306079326_466156932192902_5568511465342036462_n.jpg',
          transparentLogo:
            '306079326_466156932192902_5568511465342036462_n-removebg-preview.png',
          coverPhoto: '363953356_701751605300099_6769422731043737871_n.png',
          city: cityNameMap.get('Antananarivo'),
          address: 'Lot II H 12 ter K Ankadindramamy, Antananarivo, Madagascar',
          email: 'Kofimangaplustana@gmail.com',
          phones: ['0341726063'],
          zone: CooperativeZone.National,
          highways: ['2', '4', '44'],
          socialMedias: [
            {
              _id: new mongo.ObjectId(),
              platform: SocialMediaPlatform.Facebook,
              url: 'https://www.facebook.com/Kofimanga/',
            },
          ],
          preferences: {
            _id: new mongo.ObjectId(),
          },
        },
        {
          _id: new mongo.ObjectId(),
          coopName: 'TRANSAM PLUS',
          description:
            'TRANSAM PLUS est une coopérative de transport reliant principalement la capitale Antananarivo (Tananarive) avec les villes d\'Ambatolampy et de Toamasina (Tamatave). Elle fait partie des coopératives offrant des services de transports de première classe qui se caractérisent par leurs véhicules de modèle "Crafter" de la marque Volkswagen neufs et luxueux tout en ayant un frais de transport abordable. Ayant commencé à opérer très récemment, TRANSAM PLUS a déjà su devenir l\'une des meilleures sur ces axes routiers.',
          slug: 'transam_plus',
          city: cityNameMap.get('Antananarivo'),
          address: '4H55+85M, Antananarivo',
          phones: ['0342712227', '0333333327'],
          profilePhoto: '272299784_143354604793195_9097169812082277343_n.jpg',
          coverPhoto: '"1690834395403.jpg"',
          zone: CooperativeZone.National,
          highways: ['2', '7'],
          socialMedias: [
            {
              _id: new mongo.ObjectId(),
              platform: SocialMediaPlatform.Facebook,
              url: 'https://web.facebook.com/Pejy.34',
            },
          ],
          preferences: {
            _id: new mongo.ObjectId(),
          },
        },
        {
          _id: new mongo.ObjectId(),
          coopName: 'Soatrans PLUS',
          description:
            "Fondée en 2017, Soatrans Plus est une société de transport des personnes et des marchandises. Son siège social étant basé à Antsirabe, elle opère principalement dans la route nationale numéro 7 en reliant les villes d'Antananarivo (Tananarive) la capitale, d'Antsirabe et de Fianarantsoa entre elles. Soatrans PLUS est très populairement connue pour ses services de première' classe d'éxcellente qualité sur cet axe routier.",
          slug: 'soatrans_plus',
          profilePhoto: 'soatrans-dark.png',
          transparentLogo: 'logo-200.png',
          coverPhoto: '194065924_103524178619811_7467960765433643262_n.jpg',
          city: cityNameMap.get('Antsirabe'),
          address: 'Rue Maréchal Foch, Antsirabe, Madagascar',
          zone: CooperativeZone.National,
          highways: ['7'],
          email: 'dircom@soatransplus.mg',
          phones: ['0321190500'],
          websiteURL: 'https://soatransplus.mg/',
          socialMedias: [
            {
              _id: new mongo.ObjectId(),
              platform: SocialMediaPlatform.Facebook,
              url: 'https://www.facebook.com/soatransplus.mg/',
            },
          ],
          preferences: {
            _id: new mongo.ObjectId(),
          },
        },
      ];
      CooperativeSeeder.cooperatives = cooperatives;
    }
    return CooperativeSeeder.cooperatives;
  }

  /**
   * Getter for the cooperatives slug map singleton
   */
  static getCooperativesSlugMap() {
    if (!CooperativeSeeder.cooperativeSlugMap) {
      const cooperativeSlugMap = new Map<string, CooperativeSeederPayload>();
      for (const cooperative of CooperativeSeeder.getCooperatives()) {
        cooperativeSlugMap.set(cooperative.slug, cooperative);
      }
      CooperativeSeeder.cooperativeSlugMap = cooperativeSlugMap;
    }
    return CooperativeSeeder.cooperativeSlugMap;
  }
}
