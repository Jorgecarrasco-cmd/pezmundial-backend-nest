import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BibleBook } from './entities/bible-book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BibleBooksService {

  constructor(
    @InjectRepository(BibleBook)
    private readonly repo: Repository<BibleBook>
  ) { }


  findAll() {
    return this.repo.find()
  }
 
}
