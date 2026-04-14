import { Module } from '@nestjs/common';
import { BibleBooksService } from './bible-books.service';
import { BibleBooksController } from './bible-books.controller';
import { BibleBook } from './entities/bible-book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BibleBooksController],
  providers: [BibleBooksService],
  imports: [TypeOrmModule.forFeature([BibleBook])]

})
export class BibleBooksModule { }
                