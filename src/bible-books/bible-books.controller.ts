import { Controller, Get, Param } from '@nestjs/common';
import { BibleBooksService } from './bible-books.service';

@Controller('bible-books')
export class BibleBooksController {
  
  constructor(private readonly bibleBooksService: BibleBooksService) {}

  @Get()
  findAll() {
    return this.bibleBooksService.findAll();
  }

}
