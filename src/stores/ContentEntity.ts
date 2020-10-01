import { ObjectSchema } from "realm";

export type ContentEntityType = 'article' | 'faq';

export type ContentEntity = {
    id: number;
    type: ContentEntityType;
    langcode: string;
    title: string;
    summary?: string;
    body?: string;
    category?: number;
    predefinedTags: number[];
    keywords: number[];
    referencedArticles: number[];
    coverImageUrl?: string;
    coverImageAlt?: string;
    coverImageName?: string;
    coverVideoUrl?: string;
    coverVideoName?: string;
    coverVideoSite?: string;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Realm schema for ContentEntity.
 */
export const ContentEntitySchema: ObjectSchema = {
    name: 'ContentEntity',
    primaryKey: 'id',

    // API: https://bit.ly/3f7k9jq
    properties: {
        id: {type:'int'},
        type: {type:'string'},
        langcode: {type:'string'},
        title: {type:'string'},
        summary: {type:'string', optional:true},
        body: {type:'string', optional:true},
        category: {type:'int', optional:true},
        predefinedTags: {type:'int[]'},
        keywords: {type:'int[]'},
        referencedArticles: {type:'int[]'},
        coverImageUrl: {type:'string', optional:true},
        coverImageAlt: {type:'string', optional:true},
        coverImageName: {type:'string', optional:true},
        coverVideoUrl: {type:'string', optional:true},
        coverVideoName: {type:'string', optional:true},
        coverVideoSite: {type:'string', optional:true},
        createdAt: {type:'date'},
        updatedAt: {type:'date'},
    }
};