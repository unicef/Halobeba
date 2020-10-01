import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { MilestoneForm, MilestoneItem } from './MilestoneForm';

const dummyHtml = `
        <p>
        U ovom periodu dete polako uči kako da akcijama utiče na svoje ponašanje. Pomozite detetu da nauči da se smiri - na primer, da sisa prstiće ili svoju šaku.
        </p>
        `

let dummyData: MilestoneItem[] = [
    { relatedArticles: [1], checked: false, html: dummyHtml, title: "Opušta se kada ga uzmete u naručje", id: 1 },
    { relatedArticles: [1], checked: true, html: dummyHtml, title: "Uzbudi se kada mu nešto govorite, uspori pokrete, sluša, prisustvuje", id: 2 },
    { relatedArticles: [1], checked: false, html: dummyHtml, title: "Gleda vas dok mu se smešite i pričate", id: 3 },
    { relatedArticles: [1], checked: true, html: dummyHtml, title: "Oglašava se", id: 4 },
]

const onPress = () => {

}

const onCheckBoxChange = (id: number) => {
    dummyData.map(item => {
        if (item.id === id) {
            item.checked = !item.checked
        }
    })
}

storiesOf('Milestone Form', module)
    .add('default', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <MilestoneForm
                title="Sposobnosti i veštine iz ovog perioda koje dete treba da osvoji:"
                items={dummyData}
                onCheckboxPressed={onCheckBoxChange}
                roundedButton={{ title: 'Sačuvajte podatke', onPress: onPress }}
            />
        </View>
    ));