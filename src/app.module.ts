import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { UserModule } from './api/user/user.module';
import { GqlConfigService } from './graphql/gql-config.service';
import { DataloaderModule } from './dataloader/dataloader.module';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  controllers: [AppController],
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      useClass: GqlConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    DataloaderModule,
    AuthModule,
  ],
})
export class AppModule {}
