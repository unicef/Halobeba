import {ObjectSchema} from 'realm';

export type MilestoneEntity = {
    id: number,
    type: string,
    langcode: "en" | "sr",
    title: string,
    body: string,
    summary: string,
    created_at: Date,
    updated_at: Date,
    predefined_tags: number[],
    related_articles: number[],
};

/**
 * Realm schema for MilestoneEntity
 */
export const MilestoneEntitySchema: ObjectSchema = {
    name: 'MilestoneEntity',
    primaryKey: 'id',

    properties: {
        id: {type:'int'},
        type: {type:'string'},
        langcode: {type:'string'},
        title: {type:'string'},
        summary: {type:'string'},
        body: {type:'string'},
        predefined_tags: {type:'int[]'},
        related_articles: {type:'int[]'},
        created_at: {type:'date'},
        updated_at: {type:'date'},
    }
};