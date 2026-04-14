import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Frontpage } from './entities/frontpage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Frontpage])]
})
export class FrontpagesModule { }
