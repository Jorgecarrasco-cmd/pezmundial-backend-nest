import { BibleBook } from "src/bible-books/entities/bible-book.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { BaseClass } from "src/common/clases/base-class";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { Author } from "src/authors/entities/author.entity";
import { Frontpage } from "src/frontpages/entities/frontpage.entity";
import { Series } from "src/series/entities/series.entity";
import { Audio } from "src/audios/entities/audio.entity";

@Entity('resources')
export class Resource extends BaseClass {

    @Column({ type: 'text' })
    title!: string

    @Column({ type: 'text', nullable: true })
    spotifyUrl?: string

    @Column({ type: 'text', nullable: true })
    youtubeUrl?: string

    @Column({ type: 'text', nullable: false })
    description?: string

    @Column({ type: 'text', nullable: false })
    resume?: string

    @Column({ type: 'bool', default: false })
    private?: boolean

    @Column({ type: 'date', nullable: false })
    date!: Date

    // RELACIONES
    @ManyToOne(() => BibleBook, (book) => book.resources, { nullable: true })
    bibleBook!: BibleBook
    
    @ManyToOne(() => Series, (serie) => serie.resources, { nullable: true })
    serie!: Series

    @ManyToOne(() => Author, (author) => author.resources, { nullable: false })
    author!: Author

    @OneToOne(() => Frontpage, (frontpage) => frontpage.resource, { nullable: false })
    @JoinColumn()
    frontpage!: Frontpage
    
    
    @OneToOne(() => Audio, (audio) => audio.resource, { nullable: false })
    @JoinColumn()
    audio!: Audio

    @ManyToMany(() => Tag, (tag) => tag.resources, {nullable: true})
    @JoinTable()
    tags!: Tag[]
}