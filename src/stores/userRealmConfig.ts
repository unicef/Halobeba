import Realm from 'realm';
import { VariableEntitySchema } from './VariableEntity';
import { ChildEntitySchema } from './ChildEntity';

export const userRealmConfig: Realm.Configuration = {
    // API: https://bit.ly/36WypWV
    path: 'user.realm',
    schema: [
        VariableEntitySchema,
        ChildEntitySchema,
    ],
};
