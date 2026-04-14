import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { Author } from 'src/authors/entities/author.entity';
import { BibleBook } from 'src/bible-books/entities/bible-book.entity';
import { Series } from 'src/series/entities/series.entity';
import { Audio } from 'src/audios/entities/audio.entity';
import { Frontpage } from 'src/frontpages/entities/frontpage.entity';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService, FirebaseService],
  imports: [
    TypeOrmModule.forFeature([
      Resource,
      Author,
      BibleBook,
      Series,
      Audio,
      Frontpage,
    ]),
  ],
})
export class ResourcesModule {}