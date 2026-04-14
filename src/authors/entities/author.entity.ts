import { User } from "src/auth/entities/user.entity"
import { Resource } from "src/resources/entities/resource.entity"
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity('authors')
export class Author {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column('text')
    name!: string

    @OneToMany(() => Resource, (resource) => resource.author)
    resources!: Resource[]
}
