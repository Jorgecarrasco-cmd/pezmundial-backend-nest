import { BaseClass } from "src/common/clases/base-class";
import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('bible_books')
export class BibleBook extends BaseClass {
    @Column('text')
    title!: string

    @Column({ type: 'int', unique: true, select: false })
    order!: number

    @OneToMany(() => Resource, (resource) => resource.bibleBook, { eager: false })
    resources!: Resource[]
}
