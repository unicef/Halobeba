import React from 'react';
import { View, StyleSheet, ViewStyle, } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Typography, TypographyType } from '../../components/Typography';
import { DateTimePicker, DateTimePickerType } from '../../components/DateTimePicker';
import { RateAChild } from '../../components/RateAChild';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedTextArea } from '../../components/RoundedTextArea';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { userRealmStore, dataRealmStore } from '../../stores';
import { Measures } from '../../stores/ChildEntity';
import { currentLocale } from 'i18n-js';
import { DateTime } from 'luxon';
import { utils } from '../../app';

export interface BirthDataScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, BirthDataScreenParams>;
}

export interface State {
    plannedTermDate: DateTime | undefined,
    birthDate: DateTime | undefined,
    babyRating: number | undefined,
    weight: string,
    length: string,
    comment: string | undefined,
    dateError: boolean,
    lengthError: boolean,
    weightError: boolean
}

export class BirthDataScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
        this.initState();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: BirthDataScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private initState = () => {
        let state: State;

        const currentChild = userRealmStore.getCurrentChild();

        if (currentChild) {

            let weight: string = "";
            let length: string = "";

            if(currentChild.measures && currentChild.measures !== ""){
                let measures = JSON.parse(currentChild.measures);
                
                if(measures[0]?.weight === undefined){
                    weight = ""
                }else{
                    weight = measures[0].weight;
                }

                if(measures[0]?.length === undefined){
                    length = ""
                }else{
                    length = measures[0].length;
                }
            };

            let birthDate = currentChild.birthDate ? DateTime.fromJSDate(currentChild.birthDate) : undefined;
            let planetBirthDate = currentChild.plannedTermDate ? DateTime.fromJSDate(currentChild.plannedTermDate) : undefined;

            state = {
                babyRating: currentChild.babyRating,
                birthDate: birthDate ? birthDate : undefined,
                comment: currentChild.comment,
                weight: weight === undefined ? "" : weight.toString(),
                plannedTermDate: planetBirthDate ? planetBirthDate: undefined,
                length: length === undefined ? "" : length.toString(),
                lengthError: false,
                weightError: false,
                dateError: false,
            };

            this.state = state;
        };
    };

    private gotoBack() {
        this.props.navigation.goBack();
    };

    private checkData = () => {
        let check = true;
        if(!this.state.birthDate){
            this.setState({dateError: true});
            check = false;
        };

        if(this.state.weight === ""){
            this.setState({weightError: true});
            check = false;
        };

        if(this.state.length === ""){
            this.setState({lengthError: true})
            check = false;
        };

        return check;
    };

    private submit = () => {
        const { comment, length, weight, babyRating, plannedTermDate, birthDate } = this.state;

        const currentChild = userRealmStore.getCurrentChild();
        if (!currentChild) return;

        if(this.checkData()){
            let measures: Measures[] = [];
            let birthDateTimeStamp = birthDate?.toMillis()
            let planetBirthDateTimeStamp = plannedTermDate?.toMillis()
    
            let isChildMeasured: boolean = true;

            if (currentChild.measures !== null && currentChild.measures !== "" && currentChild.measures !== "[]") {
                measures = JSON.parse(currentChild.measures);
    
                if(weight !== ""){
                    measures[0] = {...measures[0], weight: weight}
                }
    
                if(length !== ""){
                    measures[0] = {...measures[0], length: length};
                }
    
                measures[0].measurementDate = birthDateTimeStamp;
            } else {
                if(weight !== "" && length !== "")
                    measures.push({ measurementPlace: "doctor", length: length, weight: weight, measurementDate: birthDateTimeStamp, isChildMeasured: isChildMeasured,  didChildGetVaccines: false})
            }
    
            userRealmStore.realm?.write(() => {
                currentChild.comment = comment;
                currentChild.babyRating = babyRating;
                currentChild.plannedTermDate = planetBirthDateTimeStamp ? new Date(planetBirthDateTimeStamp) : new Date();
                currentChild.birthDate = birthDateTimeStamp ? new Date(birthDateTimeStamp) : new Date();
                currentChild.measures = JSON.stringify(measures);
                // This will just trigger the update of data realm
                dataRealmStore.setVariable('randomNumber', Math.floor(Math.random() * 6000) + 1);
    
            });
            utils.logAnalitic('onChildAgeSave', {eventName: 'onChildAgeSave'});
            const parentRoutes = this.props.navigation?.dangerouslyGetParent()?.state.routes;
            const measurementParent = parentRoutes?.find(route => route.routeName === "HomeStackNavigator_GrowthScreen");
            
            if (measurementParent) {
                this.props.navigation.push(measurementParent.routeName)
            } else {
                this.props.navigation.goBack();
            };
        }
    }

    private setPlannedTerm = (date: Date) => {
        let dateTime = DateTime.fromJSDate(date);
        this.setState({
            plannedTermDate: dateTime
        })
    }

    private setBirthDate = (date: Date) => {
        let dateTime = DateTime.fromJSDate(date);
        this.setState({
            birthDate: dateTime
        })
    }

    private setChildWeight = (value: string) => {
        this.setState({
            weight: value
        })
    }

    private setChildLength = (value: string) => {
        this.setState({
            length: value
        })
    }

    private setChildRaiting = (value: number) => {
        this.setState({
            babyRating: value
        })
    }

    private setComment = (value: string) => {
        this.setState({
            comment: value
        })
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <KeyboardAwareScrollView
                        // themeContext.theme.screenContainer?.backgroundColor
                        style={{ backgroundColor: 'white' }}
                        contentContainerStyle={[styles.container]}
                        keyboardShouldPersistTaps='always'
                    >
                        <View style={{ alignItems: 'flex-start', padding: themeContext.theme.screenContainer?.padding }}>

                            {/* DESCRIPTION TEXT */}
                            <Typography type={TypographyType.bodyRegular}>
                                {translate('birthDataDescription')}
                            </Typography>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* PLANNED TERM */}
                            <DateTimePicker
                                label={translate('fieldLabelPlannedTerm')} type={DateTimePickerType.date}
                                style={{ alignSelf: 'stretch' }}
                                value={this.state.plannedTermDate ? new Date(this.state.plannedTermDate?.toString()) : undefined}
                                onChange={(date) => this.setPlannedTerm(date)}
                                maximumDate={new Date()}
                                
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />

                            {/* BIRTH DATE */}
                            <DateTimePicker
                                label={translate('fieldLabelBirthDate')} type={DateTimePickerType.date}
                                style={[{ alignSelf: 'stretch', }, this.state.dateError ? {borderColor: 'red', borderWidth: 1} : null]}
                                value={this.state.birthDate ? new Date(this.state.birthDate?.toString()) : undefined}
                                onChange={(date) => this.setBirthDate(date)}
                                maximumDate={new Date()}
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* BABY RATING ON BIRTH */}
                            <Typography type={TypographyType.bodyRegular} style={{ marginBottom: scale(5) }}>
                                {translate('fieldLabelBabyRatingOnBirth')}
                            </Typography>

                            <RateAChild onChange={(value) => this.setChildRaiting(value)} value={this.state.babyRating} />
                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* BABY MEASUREMENTS */}
                            <Typography type={TypographyType.bodyRegular} style={{ marginBottom: scale(8) }}>
                                {translate('fieldLabelMeasurementsOnBirth')}
                            </Typography>

                            <RoundedTextInput
                                label={translate('fieldLabelWeight')}
                                suffix="g"
                                icon="weight"
                                style={[{ width: scale(150) }, this.state.weightError ? {borderWidth: 1, borderColor: "red"} : null]}
                                onChange={(value) => this.setChildWeight(value)}
                                value={this.state.weight}
                                keyboardType="numeric"
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />

                            <RoundedTextInput
                                label={translate('fieldLabelLength')}
                                suffix="cm"
                                icon="weight"
                                style={[{ width: scale(150), }, this.state.lengthError ? {borderWidth: 1, borderColor: "red"} : null]}
                                onChange={(value) => this.setChildLength(value)}
                                value={this.state.length}
                                keyboardType="numeric"

                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* DOCTOR COMMENTS */}
                            <RoundedTextArea
                                label={translate('fieldLabelCommentFromDoctor')} onChange={(value) => this.setComment(value)}
                                style={{ alignSelf: 'stretch' }}
                                value={this.state.comment}
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* SUBMIT BUTTON */}
                            <RoundedButton
                                text={translate('buttonSaveData')}
                                type={RoundedButtonType.purple}
                                onPress={() => this.submit()}
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />
                        </View>

                    </KeyboardAwareScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface BirthDataScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<BirthDataScreenStyles>({
    container: {

    },
});
