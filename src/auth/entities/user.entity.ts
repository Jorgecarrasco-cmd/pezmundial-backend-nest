import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'text', unique: true })
    email!: string

    @Column({ type: 'text', select: false })
    password!: string

    @Column('text')
    name!: string

    @Column('text')
    lastname!: string

    @Column({ type: 'bool', default: true })
    isActive!: boolean

    @Column({ array: true, type: 'text', default: ['user'] })
    roles!: string[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert()
    }
}