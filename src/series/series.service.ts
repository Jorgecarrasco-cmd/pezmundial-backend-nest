import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class SeriesService {

  constructor(
    @InjectRepository(Series)
    private readonly repo: Repository<Series>,
    private readonly firebaseService: FirebaseService
  ) { }

  async create(createSeriesDto: CreateSeriesDto, imageFile: Express.Multer.File) {
    const imageUrl = await this.firebaseService.uploadFile(imageFile, 'series')
    const serie = await this.repo.create(
      {
        ...createSeriesDto,
        imageUrl
      }
    )
    await this.repo.save(serie)
    return { serie }
  }

  async findAll() {
    return this.repo.find()
  }

  async findOne(id: string) {

    const serie = await this.repo.findOneBy({ id })

    if (!serie) throw new NotFoundException(`Serie with ${id} not founded`)
    return serie
  }

  async update(id: string, updateSeriesDto: UpdateSeriesDto, imageFile: Express.Multer.File) {
      const imageUrl = await this.firebaseService.uploadFile(imageFile, 'series')
      const serie = await this.repo.preload({
        id,
        ...updateSeriesDto,
        imageUrl
      })

      if (!serie) throw new NotFoundException(`Serie with id ${id} not founded`)

      await this.repo.save(serie)
      return { serie }
  }

  async remove(id: string) {
    const serie = await this.repo.findOneBy({ id })
    if (!serie) throw new NotFoundException(`Serie with ${id} not founded`);

    await Promise.all([
      this.firebaseService.deleteFile(serie.imageUrl!),
      this.repo.delete(id)
    ])

    return { message: 'Delete Succeded' }
  }
}
