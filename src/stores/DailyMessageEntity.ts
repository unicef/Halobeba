import { ObjectSchema } from "realm";

export type DailyMessageEntity = {
    id: number;
    langcode: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Realm schema for DailyMessageEntity.
 */
export const DailyMessageEntitySchema: ObjectSchema = {
    name: 'DailyMessageEntity',
    primaryKey: 'id',

    // API: https://bit.ly/3f7k9jq
    properties: {
        id: {type:'int'},
        langcode: {type:'string'},
        title: {type:'string'},
        createdAt: {type:'date'},
        updatedAt: {type:'date'},
    }
};