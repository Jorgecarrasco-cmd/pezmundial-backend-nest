import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService, FirebaseService],
  imports: [TypeOrmModule.forFeature([Series])]
})
export class SeriesModule {}
