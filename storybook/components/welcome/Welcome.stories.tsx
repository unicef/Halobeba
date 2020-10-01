import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Welcome } from "./Welcome";
import { displayName } from '../../../app.json';

storiesOf(displayName, module)

.add('welcome', () => <Welcome />)
;