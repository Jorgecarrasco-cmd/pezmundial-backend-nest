import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from 'src/resources/entities/resource.entity';
import { Author } from 'src/authors/entities/author.entity';
import { BibleBook } from 'src/bible-books/entities/bible-book.entity';
import { Series } from 'src/series/entities/series.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Frontpage } from 'src/frontpages/entities/frontpage.entity';
import { Audio } from 'src/audios/entities/audio.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
  TypeOrmModule.forFeature([Resource, Author, BibleBook, Series, Tag, Frontpage, Audio])

  ]
})
export class SeedModule { }
