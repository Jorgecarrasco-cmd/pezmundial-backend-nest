import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audio } from './entities/audio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audio])]
})
export class AudiosModule {}
