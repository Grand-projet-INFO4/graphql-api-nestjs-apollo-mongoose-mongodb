import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import { DateTimeResolver, VoidResolver } from 'graphql-scalars';

import { DataloaderService } from 'src/dataloader/dataloader.service';
import { AppGqlContext } from './context';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private dataloaderService: DataloaderService) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql/schema.d.ts'),
        emitTypenameField: true,
      },
      context: () => {
        return {
          loaders: this.dataloaderService.getLoaders(),
        } as AppGqlContext;
      },
      resolvers: {
        Void: VoidResolver,
        DateTime: DateTimeResolver,
      },
    };
  }
}
