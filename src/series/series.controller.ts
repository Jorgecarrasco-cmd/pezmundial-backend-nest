import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'image', maxCount: 1 }],
      { storage: memoryStorage() }, // ← faltaba
    ),
  )
  create(
    @Body() createSeriesDto: CreateSeriesDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] }, // ← es array
  ) {
    return this.seriesService.create(createSeriesDto, files.image![0]); // ← [0]
  }

  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'image', maxCount: 1 }],
      { storage: memoryStorage() }, // ← faltaba
    ),
  )
  update(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] }, // ← es array
  ) {
    return this.seriesService.update(id, updateSeriesDto, files.image![0]); // ← [0]
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
  }
}