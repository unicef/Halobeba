import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet, ViewStyle } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { ListCard, ListCardMode, ListCardItem } from './ListCard';
import { DidntFindAnswers } from './DidntFindAnswers';
import { utils } from '../../app';

export interface FaqCategoryScreenParams {
    title: string;
    listCardItems: ListCardItem[]; 
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, FaqCategoryScreenParams>;
}

export class FaqCategoryScreen extends React.Component<Props, object> {

    public constructor(props:Props) {
        super(props);

        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: FaqCategoryScreenParams = {
            title: '',
            listCardItems: [],
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
            utils.logAnalitic('faqHasOpened', {
                eventName: 'faqHasOpened',
                categoryName: this.props.navigation.state.params.title,
            });
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
            {(themeContext:ThemeContextValue) => (
                <ScrollView
                    style={{backgroundColor:themeContext.theme.screenContainer?.backgroundColor}}
                    contentContainerStyle={ [[styles.container], {padding:themeContext.theme.screenContainer?.padding}] }
                >
                    {/* GO BACK */}
                    <TextButton style={{padding:0}} icon="chevron-left" iconStyle={{color:'#AA40BF'}} textStyle={{fontSize:scale(16)}} color={TextButtonColor.purple} onPress={ () => {this.gotoBack()} }>
                        {translate('buttonBack')}
                    </TextButton>

                    <View style={{height:scale(15)}} />

                    {/* TITLE */}
                    <Typography type={TypographyType.headingPrimary}>
                        {screenParams.title}
                    </Typography>

                    {/* LIST CARD: FAQ category items */}
                    <ListCard
                        mode={ ListCardMode.accordionList }
                        items={ screenParams.listCardItems }
                        previewNumberOfItems={30}
                    />

                    {/* <View style={{height:scale(20)}} /> */}

                    {/* YOU DIDNT FIND ANSWER */}
                    <View style={{height:scale(40)}} />
                    <DidntFindAnswers />
                    <View style={{height:scale(40)}} />
                </ScrollView>
            )}
            </ThemeConsumer>
        );
    }

}

export interface FaqCategoryScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<FaqCategoryScreenStyles>({
    container: {
        // flex: 1,
    },
});
