import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourcesService } from '../resources/resources.service';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {

    constructor(
        private readonly repository: SeedService
    ) { }
    @Get()
    executeSeed() {
        return this.repository.executeSeed()
    }
}
