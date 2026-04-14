import { User } from "src/auth/entities/user.entity";
import { CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseClass {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @UpdateDateColumn({ select: false })
    updatedAt?: Date

    @CreateDateColumn({ select: false })
    createdAt!: Date

    @ManyToOne(() => User, { nullable: true, eager: false })
    createdBy!: User

    @ManyToOne(() => User, { nullable: true, eager: false })
    editedBy!: User
}