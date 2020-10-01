import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Google } from "./Google";
import { Facebook } from "./Facebook";
import { RealmDemo } from './RealmDemo';
import { Debug } from './Debug';

storiesOf('Services', module)

.add('debug', () => (
    <Debug />
))

.add('google', () => (
    <Google />
))

.add('facebook', () => (
    <Facebook />
))

.add('realm', () => (
    <RealmDemo />
))
;