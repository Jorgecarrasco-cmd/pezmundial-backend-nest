import { BaseClass } from "src/common/clases/base-class";
import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity('mp3_audios')
export class Audio extends BaseClass {
    @Column('text')
    url!: string

    @OneToOne(() => Resource, (resource) => resource.audio)
    resource!: Resource
}
