import Realm from 'realm';
import { ContentEntitySchema } from './ContentEntity';
import { VariableEntitySchema } from './VariableEntity';
import { BasicPagesEntitySchema } from './BasicPageEntity';
import { MilestoneEntitySchema } from './MilestoneEntity';
import { DailyMessageEntity, DailyMessageEntitySchema } from './DailyMessageEntity';
import { PollsEntitySchema } from './PollsEntity';

export const dataRealmConfig: Realm.Configuration = {
    // API: https://bit.ly/36WypWV
    path: 'data.realm',
    schema: [
        ContentEntitySchema,
        VariableEntitySchema,
        PollsEntitySchema,
        BasicPagesEntitySchema,
        MilestoneEntitySchema,
        DailyMessageEntitySchema,
    ],
};  
