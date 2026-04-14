import { BaseClass } from "src/common/clases/base-class";
import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity('frontpages')
export class Frontpage extends BaseClass {
    @Column('text')
    url!: string

    @OneToOne(() => Resource, (resource) => resource.frontpage)
    resource!: Resource
}
