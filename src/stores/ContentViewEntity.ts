import { ContentEntityType } from "./ContentEntity";

export type ContentViewEntity = {
    id: number;
    type: ContentEntityType;
    langcode: string;
    title: string;
    body?: string;
    coverImageUrl?: string;
    coverImageAlt?: string;
    updatedAt: Date;

    category?: {id:number, name:string};
    predefinedTags: {id:number, name:string}[];
    keywords: {id:number, name:string}[];
    coverImageFilepath: string;
};