import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { Binary } from 'typeorm';
import { FilterResourceDto } from './dto/filters';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
      ],
      { storage: memoryStorage() },
    ),
  )
  create(
    @Body() createResourceDto: CreateResourceDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      audio?: Express.Multer.File[];
    },
  ) {
    if (!files?.image?.[0]) throw new BadRequestException('Image is required');

    return this.resourcesService.create(
      createResourceDto,
      files.image[0],
      files?.audio![0],
    );
  }

  @Get()
  findAll() {
    return this.resourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
      ],
      { storage: memoryStorage() },
    ),
  )
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      audio?: Express.Multer.File[];
    },
  ) {
    return this.resourcesService.update(
      id,
      updateResourceDto,
      files.image?.[0],
      files.audio?.[0],
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
