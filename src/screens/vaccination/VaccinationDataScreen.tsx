import React, { Component } from 'react'
import { StyleSheet, ViewStyle, View } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { Typography, TypographyType } from '../../components/Typography';
import { DateTimePicker } from '../../components/DateTimePicker';
import { AccordionCheckBoxList, MilestoneItem } from '../../components/development/AccordionCheckBoxList';
import { RadioButtons } from '../../components/RadioButtons';
import { RoundedTextArea } from '../../components/RoundedTextArea';
import { RoundedButtonType, RoundedButton, } from '../../components/RoundedButton';

const dummyDataOne: MilestoneItem[] = [
    { relatedArticles:[1], id: 0, title: 'Vakcina protiv difterije, tetanusa, velikog kašlja, dečije paralize, hemofilus influence tipa B', checked: false },
    { relatedArticles:[1], id: 1, title: 'Vakcina protiv velikih boginja', checked: false },
]

const dummyDataTwo: MilestoneItem[] = [
    { relatedArticles:[1], id: 2, title: 'Vakcina protiv hemofilus influence tipa B, tuberkuloze, zarazne žutice', checked: false },
    { relatedArticles:[1], id: 3, title: '[sve vakcine iz prethodnog perioda koje nisu evidentirane]', checked: false },
]


export interface VaccinationDataScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

export interface State {
    previousVaccinations: MilestoneItem[],
    nextVaccinations: MilestoneItem[],
}

export class VaccinationDataScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
        this.initState()
    }

    private initState = () => {
        let state: State;

        state = {
            previousVaccinations: dummyDataOne,
            nextVaccinations: dummyDataTwo,
        }

        this.state = state;
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: VaccinationDataScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private change = (id: number, dataName: string) => {
        let data = dataName === "previousVaccinations" ? this.state.previousVaccinations : this.state.nextVaccinations;
        let index = data.findIndex((x: MilestoneItem) => x.id === id);

        data[index].checked = !data[index].checked;

        this.setState({
            [`${dataName}`]: data
        } as Pick<State, keyof State>)
    }

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        <View style={{ marginTop: 20 }}>
                            <DateTimePicker label={translate("NewDoctorVisitScreenDatePickerLabel")} />
                        </View>
                        <View style={styles.listContainer}>
                            <Typography type={TypographyType.headingSecondary} style={{ fontSize: 18 }}>Vakcinacije iz prethodnog perioda</Typography>
                            <AccordionCheckBoxList
                                items={this.state.previousVaccinations}
                                onCheckboxPressed={(id: number) => this.change(id, 'previousVaccinations')}
                            />
                        </View>

                        <View style={styles.listContainer}>
                            <Typography type={TypographyType.headingSecondary} style={{ fontSize: 18 }}>Vakcine planirane u 3. mesecu</Typography>
                            <AccordionCheckBoxList
                                items={this.state.nextVaccinations}
                                onCheckboxPressed={(id: number) => this.change(id, 'nextVaccinations')}

                            />
                        </View>

                        <View style={[styles.listContainer, { alignItems: 'flex-start' }]}>
                            <Typography >Da li je dete izmereno?</Typography>
                            <RadioButtons
                                buttons={[
                                    { text: translate('newMeasureScreenVaccineOptionYes'), value: 'yes' },
                                    { text: translate('newMeasureScreenVaccineOptionNo'), value: 'no' }
                                ]}
                                buttonStyle={{ width: 120 }}
                                style={{ marginTop: scale(16) }}
                            />
                        </View>

                        <View style={styles.commentContainer}>
                            <RoundedTextArea />
                        </View>

                        <View style={styles.buttonContainer}>
                            <RoundedButton type={RoundedButtonType.purple} text="Sačuvajte podatke" />
                        </View>
                    </ScrollView>
                )}
            </ThemeConsumer>
        )
    }
}

export interface VaccinationDataScreenStyles {
    container: ViewStyle,
    listContainer: ViewStyle,
    buttonContainer: ViewStyle,
    commentContainer: ViewStyle,
}

const styles = StyleSheet.create<VaccinationDataScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    },
    listContainer: {
        marginTop: scale(32),
    },
    buttonContainer: {
        marginTop: scale(40),
        marginBottom: scale(40),
    },
    commentContainer: {
        marginTop: scale(24),
    }
})

