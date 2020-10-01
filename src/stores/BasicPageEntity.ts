import { ObjectSchema } from "realm";

export type BasicPageEntity = {
    id: number,
    type: string,
    langcode: string,
    title: string,
    created_at: Date,
    updated_at: Date,
    body: string,
};

/**
 * Realm schema for basicPageEntity.
 */
export const BasicPagesEntitySchema: ObjectSchema = {
    name: 'BasicPageEntity',
    primaryKey: 'id', 
    properties: {
        id: {type: 'int'},
        type: {type: 'string'},
        langcode: {type: 'string'},
        title: {type: 'string'},
        created_at: {type: 'date'},
        updated_at: {type: 'date'},
        body:  {type: 'string'},
    }
};