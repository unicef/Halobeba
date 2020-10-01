import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { MilestoneCard } from './MilestoneCard';
import { ContentEntityType } from '../../stores/ContentEntity'
import { ScrollView } from 'react-native-gesture-handler';

const onPres = () => {

}

const html1 = `
    <p>Kupanje, spavanje i igra treba da predstavljaju svakodnevnu rutinu. 
    Stavljajte bebu da spava na leđima ili na stranu.</p>
    <p>Vaša beba je u razvojnom periodu upoznavanja. Popunite kratki upitnik za ovaj razvojni period, saznajte više o podršci razvoju svog deteta i pratite kako se vaše dete razvija.</p>
`

const html2 = `
    <p>Održavajte svakodnevnu rutinu: Hranjenje, kupanje, spavanje i igra</p>
`

const html3 = `
    <p>
    Održavajte dnevnu rutinu, to je vrlo važno za dete. Uredite kućni prostor tako da bude siguran za kretanje deteta kako biste što ređe koristili reč "ne". recite "ne" samo onda kada postoji opasnost da će vaše dete povrediti sebe ili druge.
`

storiesOf('Milestone Card', module)
    .add('default', () => (
        <ScrollView contentContainerStyle={{ padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <View style={{marginTop: 20}}>
                <MilestoneCard
                    title="Period upoznavanja"
                    subTitle="1. mesec "
                    html={html1}
                    isCurrentPeriod={false}
                    roundedButton={{ title: 'Popunite upitnik', onPress: onPres }}
                    textButton={{ title: 'Vise o razvoju u ovom periodu', onPress: onPres }}
                />
            </View>
            <View style={{marginTop: 20}}>
                <MilestoneCard
                    title="Period uspostavljanja rutine i usklađivanja"
                    subTitle="2. mesec "
                    html={html2}
                    isCurrentPeriod={false}
                    textButton={{ title: 'Vise o razvoju u ovom periodu', onPress: onPres }}
                />
            </View>
            <View style={{marginTop: 20}}>
                <MilestoneCard
                    title="Vreme za nova otkrića"
                    isCurrentPeriod={false}
                    subTitle="od 7. do 9. meseca "
                    html={html3}
                    articles={[
                        { id: 1, createdAt: new Date(), keywords: [1, 2, 3], langcode: "sr", predefinedTags: [1, 2], referencedArticles: [1, 2, 3], title: 'Kako umiriti razdraženo dete?', updatedAt: new Date(), type: "article" },
                        { id: 2, createdAt: new Date(), keywords: [1, 2, 3], langcode: "sr", predefinedTags: [1, 2], referencedArticles: [1, 2, 3], title: 'Da li je dobro da dete sisa prst?', updatedAt: new Date(), type: "article" },
                        { id: 3, createdAt: new Date(), keywords: [1, 2, 3], langcode: "sr", predefinedTags: [1, 2], referencedArticles: [1, 2, 3], title: 'Da li postoji gornja granica kada dete treba da prekine da sisa prst? ', updatedAt: new Date(), type: "article" }
                    ]}
                />
            </View>
        </ScrollView>
    ));