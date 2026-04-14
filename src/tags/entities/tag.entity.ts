import { BaseClass } from "src/common/clases/base-class";
import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity('tags')
export class Tag extends BaseClass {
    @Column('text')
    title!: string
    @ManyToMany(() => Resource, (resource) => resource.tags)
    resources!: Resource[]
}


export interface ResourceResponse {
    id:          string;
    title:       string;
    spotifyUrl:  string;
    youtubeUrl:  string;
    description: string;
    resume:      string;
    private:     boolean;
    date:        Date;
    bibleBook:   BibleBook;
    serie:       BibleBook;
    author:      Author;
    frontpage:   Audio;
    audio:       Audio;
    tags:        Tag[];
}

export interface Audio {
    url: string;
}

export interface Author {
    id:   string;
    name: string;
}

export interface BibleBook {
    id:    string;
    title: string;
}
export interface Tag {
    id:    string;
    title: string;
}
