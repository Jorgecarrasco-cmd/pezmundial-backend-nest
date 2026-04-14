import { BaseClass } from "src/common/clases/base-class";
import { Frontpage } from "src/frontpages/entities/frontpage.entity";
import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity('series')
export class Series extends BaseClass {
    @Column('text', { unique: true })
    title!: string

    @Column('text', { nullable: true })
    imageUrl?: string

    @OneToMany(() => Resource, (resource) => resource.serie)
    resources?: Resource[]
}
