import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/interfaces/pagination-dto';

@Injectable()
export class AuthorsService {

  constructor(
    @InjectRepository(Author)
    private readonly repo: Repository<Author>
  ) { }

  async create(createAuthorDto: CreateAuthorDto) {
    
    const author = await this.repo.create(createAuthorDto)
    await this.repo.save(author)

    return { author }
    
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    return this.repo.find({
      take: limit,
      skip: offset
    })
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.repo.findOneBy({ id })
    if (!author) throw new NotFoundException(`Author with id ${id} not found`)

    const updated = await this.repo.save({
      ...author,
      ...updateAuthorDto
    })

    return { updated }
  }

  async remove(id: string) {
    const results = await this.repo.delete(id)
    if (results.affected === 0) throw new NotFoundException(`Author with id ${id} not found`)

    return { message: "Delete Succeded" }
  }
}
