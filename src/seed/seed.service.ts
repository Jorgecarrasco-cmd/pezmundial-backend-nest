import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Audio } from 'src/audios/entities/audio.entity';
import { Author } from 'src/authors/entities/author.entity';
import { BibleBook } from 'src/bible-books/entities/bible-book.entity';
import { Frontpage } from 'src/frontpages/entities/frontpage.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { Series } from 'src/series/entities/series.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Repository } from 'typeorm';
import { bibleBooks, resources } from './data/resources';
import { Evento, Recurso } from './interfaces/resource-seed.interface';

@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(Resource)
        private readonly resourceRepository: Repository<Resource>,
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,
        @InjectRepository(BibleBook)
        private readonly bibleBookRepository: Repository<BibleBook>,
        @InjectRepository(Series)
        private readonly seriesRepository: Repository<Series>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        @InjectRepository(Frontpage)
        private readonly frontpageRepository: Repository<Frontpage>,
        @InjectRepository(Audio)
        private readonly audioRepository: Repository<Audio>,
    ) { }

    async executeSeed() {
        await this.deleteAll();
        await this.insertBibleBooks();
        await this.insertResources();
        await this.fixNullSeries();
        return { message: 'Seed executed successfully' };
    }

    private async deleteAll() {
        await this.resourceRepository.deleteAll()
        await this.audioRepository.deleteAll()
        await this.frontpageRepository.deleteAll()
        await this.authorRepository.deleteAll()
        await this.seriesRepository.deleteAll()
        await this.tagRepository.deleteAll()
        await this.bibleBookRepository.deleteAll()
    }

    private async insertBibleBooks() {
        for (const book of bibleBooks) {
            await this.bibleBookRepository.save(
                this.bibleBookRepository.create(book)
            );
        }
    }

    async fixNullSeries() {
        const serie = await this.seriesRepository.findOneBy({ title: 'Serie Regular' });
        if (!serie) {
            console.warn('Serie Regular no encontrada');
            return;
        }

        await this.resourceRepository
            .createQueryBuilder()
            .update(Resource)
            .set({ serie: { id: serie.id } })
            .where('"serieId" IS NULL')
            .execute();

        return { message: 'Series updated' };
    }

    private async insertResources() {
        const legacyBookTitles: Record<number, string> = {
            1: 'Génesis', 2: 'Éxodo', 3: 'Levítico', 4: 'Números', 5: 'Deuteronomio',
            6: 'Josué', 7: 'Jueces', 8: 'Rut', 9: '1 Samuel', 10: '2 Samuel',
            11: '1 Reyes', 12: '2 Reyes', 13: '1 Crónicas', 14: '2 Crónicas',
            15: 'Esdras', 16: 'Nehemías', 17: 'Ester', 18: 'Job', 19: 'Salmos',
            20: 'Proverbios', 21: 'Eclesiastés', 22: 'Cantares', 23: 'Isaías',
            24: 'Jeremías', 25: 'Lamentaciones', 26: 'Ezequiel', 27: 'Daniel',
            28: 'Oseas', 29: 'Joel', 30: 'Amós', 31: 'Abdías', 32: 'Jonás',
            33: 'Miqueas', 34: 'Nahúm', 35: 'Habacuc', 36: 'Sofonías', 37: 'Hageo',
            38: 'Zacarías', 39: 'Malaquías', 40: 'Mateo', 41: 'Marcos', 42: 'Lucas',
            43: 'Juan', 44: 'Hechos', 45: 'Romanos', 46: '1 Corintios', 47: '2 Corintios',
            48: 'Gálatas', 49: 'Efesios', 50: 'Filipenses', 51: 'Colosenses',
            52: '1 Tesalonicenses', 53: '2 Tesalonicenses', 54: '1 Timoteo', 55: '2 Timoteo',
            56: 'Tito', 57: 'Filemón', 58: 'Hebreos', 59: 'Santiago', 60: '1 Pedro',
            61: '2 Pedro', 62: '1 Juan', 63: '2 Juan', 64: '3 Juan', 65: 'Judas',
            66: 'Apocalipsis',
        };

        for (const item of resources as unknown as Recurso[]) {

            // 1. BibleBook
            let bibleBook: BibleBook | null = null;
            if (item.libroId) {
                const bookTitle = legacyBookTitles[item.libroId];
                if (bookTitle) {
                    bibleBook = await this.bibleBookRepository.findOneBy({ title: bookTitle });
                }
            }

            // 2. Author
            let author = await this.authorRepository.findOneBy({ name: item.autor.nombre });
            if (!author) {
                author = await this.authorRepository.save(
                    this.authorRepository.create({ name: item.autor.nombre })
                );
            }

            // 3. Serie (opcional)
            let serie: Series | null = null;
            if (item.serie) {
                serie = await this.seriesRepository.findOneBy({ title: item.serie.titulo });
                if (!serie) {
                    serie = await this.seriesRepository.save(
                        this.seriesRepository.create({ title: item.serie.titulo })
                    );
                }
            }

            // 4. Tags (opcional)
            const tags: Tag[] = [];
            for (const etiqueta of (item.etiquetas as Evento[])) {
                let tag = await this.tagRepository.findOneBy({ title: etiqueta.titulo });
                if (!tag) {
                    tag = await this.tagRepository.save(
                        this.tagRepository.create({ title: etiqueta.titulo })
                    );
                }
                tags.push(tag);
            }

            // 5. Frontpage
            const frontpage = await this.frontpageRepository.save(
                this.frontpageRepository.create({ url: item.imagenUrl ?? '' })
            );

            // 6. Audio
            const audio = await this.audioRepository.save(
                this.audioRepository.create({ url: item.mp3Url ?? '' })
            );

            // 7. Resource
            await this.resourceRepository.save(
                this.resourceRepository.create({
                    title: item.titulo,
                    description: item.descripcion ?? '',
                    resume: item.resumen ?? '',
                    spotifyUrl: item.medioSpotify ?? undefined,
                    youtubeUrl: item.medioYoutube ?? undefined,
                    date: new Date(item.fechaCompleta),
                    private: !item.visible,
                    author,
                    bibleBook: bibleBook ?? undefined,
                    serie: serie ?? undefined,
                    tags,
                    frontpage,
                    audio,
                })
            );
        }
    }
}