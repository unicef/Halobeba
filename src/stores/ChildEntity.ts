import { ObjectSchema } from "realm";

export type Measures = {
    isChildMeasured: boolean;

    /**
     * Grams.
     */
    weight: string;

    /**
     * Centimeters.
     */
    length: string;

    /**
     * Timestamp in milliseconds.
     */
    measurementDate?: number;

    /**
     * Month in number for child Development title 
     */
    titleDateInMonth?: number;

    didChildGetVaccines: boolean;

    /**
     * All received vaccines.
     */
    vaccineIds?: string[];

    doctorComment?: string;

    measurementPlace: string;
};

export type Reminder = {
    date: number; // timestamp in milliseconds
    time: number; // timestamp in milliseconds
    uuid: string;
};

export type ChildEntity = {
    uuid: string;
    name: string;
    gender: ChildGender,
    photoUri?: string;
    createdAt: Date;
    updatedAt: Date;
    plannedTermDate?: Date;
    birthDate?: Date | undefined;
    babyRating?: number;
    measures: string;
    comment?: string;
    checkedMilestones?: number[];
    reminders?: string;
    measurementPlace: string;
};

/**
 * Realm schema for ChildEntity.
 */

export const ChildEntitySchema: ObjectSchema = {
    name: 'ChildEntity',
    primaryKey: 'uuid',

    // API: https://bit.ly/3f7k9jq
    properties: {
        uuid: { type: 'string' },
        name: { type: 'string' },
        gender: { type: 'string' },
        photoUri: { type: 'string', optional: true },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        plannedTermDate: { type: 'date', optional: true },
        birthDate: { type: 'date', optional: true },
        babyRating: { type: 'int', optional: true },
        measures: { type: 'string', optional: true },
        comment: { type: 'string', optional: true },
        checkedMilestones: { type: 'int[]', optional: true },
        reminders: {type: 'string', optional: true},
    }
};

export type ChildGender = 'boy' | 'girl';
