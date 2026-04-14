import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationDto } from 'src/common/interfaces/pagination-dto';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>
  ) { }


  async create(createTagDto: CreateTagDto) {
    try {
      const tag = await this.repo.create(createTagDto)
      await this.repo.save(tag)
      return { tag }
    } catch (error) {
      console.log(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 20, offset = 0 } = paginationDto
    return this.repo.find({ take: limit, skip: offset })
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const tag = await this.repo.preload({
        id,
        ...updateTagDto
      })

      if (!tag) throw new NotFoundException(`tag with ${id} not founded`)

      await this.repo.save(tag)
      return { tag }
    } catch (error) {
      console.log(error)
    }
  }

  async remove(id: string) {
    try {
      const result = await this.repo.delete(id)
      if (result.affected === 0) throw new NotFoundException(`Tag with id ${id}  not founded`)
    } catch (error) {
      console.log(error)
    }
  }
}
