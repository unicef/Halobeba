import { ObjectSchema } from "realm";

export type PollsEntity = {
    id: number,
    category: string,
    link: string,
    type: string,
    langcode: string,
    title: string,
    tags: number[],
    created_at: number,
    updated_at: number,
};

/**
 * Realm schema for pollsEntity.
 */
export const PollsEntitySchema: ObjectSchema = {
    name: 'PollsEntity',
    primaryKey: 'id', 
    properties: {
        id: {type: 'int'},
        category: {type: 'string'},
        link: {type: 'string'},
        type: {type: 'string'},
        langcode: {type: 'string'},
        title: {type: 'string'},
        tags: {type: 'int[]'},
        created_at: {type: 'int'},
        updated_at: {type: 'int'},
    }
};