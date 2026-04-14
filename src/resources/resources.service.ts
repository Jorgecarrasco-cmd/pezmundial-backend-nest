import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { Between, ILike, In, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/interfaces/pagination-dto';
import { Author } from 'src/authors/entities/author.entity';
import { BibleBook } from 'src/bible-books/entities/bible-book.entity';
import { Series } from 'src/series/entities/series.entity';
import { Audio } from 'src/audios/entities/audio.entity';
import { Frontpage } from 'src/frontpages/entities/frontpage.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FilterResourceDto } from './dto/filters';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(BibleBook)
    private readonly bibleBookRe: Repository<BibleBook>,
    @InjectRepository(Series)
    private readonly seriesRepository: Repository<Series>,
    @InjectRepository(Audio)
    private readonly audioRepository: Repository<Audio>,
    @InjectRepository(Frontpage)
    private readonly frontpageRepository: Repository<Frontpage>,

    //servicios

    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    dto: CreateResourceDto,
    imageFile: Express.Multer.File,
    audioFile: Express.Multer.File,
  ) {
    const author = await this.authorRepository.findOneBy({ id: dto.authorId });
    if (!author)
      throw new NotFoundException(`Author ${dto.authorId} not found`);

    const bibleBook = await this.bibleBookRe.findOneBy({ id: dto.bibleBookId });
    if (!bibleBook)
      throw new NotFoundException(`BibleBook ${dto.bibleBookId} not found`);

    const serie = await this.seriesRepository.findOneBy({ id: dto.serieId });
    if (!serie) throw new NotFoundException(`serie ${dto.serieId} not found`);

    const tags = dto.tagIds?.length
      ? await this.seriesRepository.findBy({ id: In(dto.tagIds) })
      : [];

    const [imageUrl, audioUrl] = await Promise.all([
      this.firebaseService.uploadFile(imageFile, 'imagenes'),
      this.firebaseService.uploadFile(audioFile, 'audios'),
    ]);

    const frontpage = await this.frontpageRepository.save(
      this.frontpageRepository.create({ url: imageUrl }),
    );

    const audio = await this.audioRepository.save(
      this.audioRepository.create({ url: audioUrl }),
    );

    const resource = this.resourceRepository.create({
      title: dto.title,
      description: dto.description,
      date: dto.date,
      private: dto.private,
      youtubeUrl: dto.youtubeUrl,
      spotifyUrl: dto.spotifyUrl,
      author,
      bibleBook,
      serie,
      frontpage,
      audio,
      tags,
      resume: dto.resume,
    });

    await this.resourceRepository.save(resource);
    return { resource };
  }

  async findAll() {
    return this.resourceRepository.find({
      order: {
        date: 'DESC',
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        private: true,
        youtubeUrl: true,
        spotifyUrl: true,
        resume: true,
        frontpage: {
          url: true,
        },
        audio: {
          url: true,
        },
        author: {
          id: true,
          name: true,
        },
        serie: {
          id: true,
          title: true,
        },
        bibleBook: {
          id: true,
          title: true,
        },
        tags: {
          id: true,
          title: true,
        },
      },
      relations: {
        author: true,
        serie: true,
        bibleBook: true,
        frontpage: true,
        audio: true,
        tags: true,
      },
    });
  }

  findOne(id: string) {
    return this.resourceRepository.findOne({
      where: { id },
      relations: {
        author: true,
        serie: true,
        bibleBook: true,
        frontpage: true,
        audio: true,
        tags: true,
      },
    });
  }

  async update(
    id: string,
    updateResourceDto: UpdateResourceDto,
    imageFile?: Express.Multer.File,
    audioFile?: Express.Multer.File,
  ) {
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: { frontpage: true, audio: true },
    });

    if (!resource)
      throw new NotFoundException(`Resource with id: ${id} not found`);

    //actualizar una imagen si se mando una nueva
    if (imageFile) {
      await this.firebaseService.deleteFile(resource.frontpage.url);
      const newImageUrl = await this.firebaseService.uploadFile(
        imageFile,
        'imagenes',
      );
      await this.frontpageRepository.update(resource.frontpage.id, {
        url: newImageUrl,
      });
    }

    //actualizar audio si se manda uno nuevo
    if (audioFile) {
      await this.firebaseService.deleteFile(resource.audio.url);
      const audioUrl = await this.firebaseService.uploadFile(
        audioFile,
        'imagenes',
      );
      await this.audioRepository.update(resource.audio.id, { url: audioUrl });
    }

    const updated = await this.resourceRepository.save({
      ...resource,
      ...updateResourceDto,
    });

    return { resource: updated };
  }

  async remove(id: string) {
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: { frontpage: true, audio: true },
    });

    if (!resource) throw new NotFoundException(`Resource ${id} not found`);

    await Promise.all([
      this.firebaseService.deleteFile(resource?.frontpage.url!),
      this.resourceRepository.delete(id),
    ]);

    return { message: 'Delete succeded' };
  }
}
