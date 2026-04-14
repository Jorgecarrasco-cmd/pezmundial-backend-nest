import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ResourcesModule } from './resources/resources.module';
import { AudiosModule } from './audios/audios.module';
import { FrontpagesModule } from './frontpages/frontpages.module';
import { SeriesModule } from './series/series.module';
import { AuthorsModule } from './authors/authors.module';
import { TagsModule } from './tags/tags.module';
import { BibleBooksModule } from './bible-books/bible-books.module';
import { EmailModule } from './email/email.module';
import { FirebaseModule } from './firebase/firebase.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { ResourcesController } from './resources/resources.controller';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.getOrThrow<string>('DB_HOST'),
        port:     config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AuthModule,
    ResourcesModule,
    AudiosModule,
    FrontpagesModule,
    SeriesModule,
    AuthorsModule,
    TagsModule,
    BibleBooksModule,
    EmailModule,
    FirebaseModule,
    SeedModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(ResourcesController);
  }
}