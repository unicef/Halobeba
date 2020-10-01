import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { ListCard, ListCardMode, ListCardItem } from './ListCard';
import { listCardFaqYourChildDummyData, listCardFaqPerAgeDummyData, listCardFaqMamaDummyData } from '../../dummy-data/listCardDummyData';
import { DidntFindAnswers } from './DidntFindAnswers';
import { FaqCategoryScreenParams } from './FaqCategoryScreen';
import { FaqScreenDataResponse, dataRealmStore, FaqScreenArticlesResponseItem } from '../../stores/dataRealmStore';

export interface FaqScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, FaqScreenParams>;
}

export type State = {
    data: FaqScreenDataResponse;
};

export class FaqScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.initState();
        this.setDefaultScreenParams();
    }

    private initState() {
        const state: State = {
            data: dataRealmStore.getFaqScreenData(),
        };

        this.state = state;
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: FaqScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private gotoFaqCategoryScreen(faqSection:FaqScreenArticlesResponseItem, listCardItem: ListCardItem) {
        let params: FaqCategoryScreenParams = {
            title: listCardItem.title,
            listCardItems: dataRealmStore.getFaqCategoryScreenData(faqSection.tagType, listCardItem.id),
        };

        this.props.navigation.navigate('HomeStackNavigator_FaqCategoryScreen', params);
    }

    private onTestClick = () => {

    };

    public render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={[[styles.container], { padding: themeContext.theme.screenContainer?.padding }]}
                    >
                        {/* GO BACK */}
                        <TextButton style={{ padding: 0 }} icon="chevron-left" iconStyle={{ color: '#AA40BF' }} textStyle={{ fontSize: scale(16) }} color={TextButtonColor.purple} onPress={() => { this.gotoBack() }}>
                            {translate('buttonBack')}
                        </TextButton>

                        <View style={{ height: scale(15) }} />

                        {/* TITLE */}
                        <Typography type={TypographyType.headingPrimary}>
                            {translate('faq')}
                        </Typography>

                        {/* TEST BUTTON */}
                        {/* <Button title="Test" onPress={this.onTestClick}></Button> */}

                        {/* SECTIONS */}
                        {this.state.data.map(faqSection => (
                            <>
                                <ListCard
                                    mode={ListCardMode.simpleList}
                                    title={faqSection.title}
                                    items={faqSection.items}
                                    onItemPress={(item) => { this.gotoFaqCategoryScreen(faqSection, item) }}
                                />
                                <View style={{ height: scale(20) }} />
                            </>
                        ))}

                        {/* YOU DIDNT FIND ANSWER */}
                        <View style={{ height: scale(40) }} />
                        <DidntFindAnswers />
                        <View style={{ height: scale(40) }} />
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface FaqScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<FaqScreenStyles>({
    container: {

    },
});
