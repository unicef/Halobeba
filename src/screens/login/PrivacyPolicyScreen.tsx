import React from 'react';
import { ScrollView, ViewStyle, StyleSheet, Linking, Dimensions, View } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale } from 'react-native-size-matters';
import { TextButton, TextButtonColor } from '../../components/TextButton';
// @ts-ignore
import HTML from 'react-native-render-html';
import { dataRealmStore } from '../../stores';
import { Typography } from '../../components';
import { TypographyType } from '../../components/Typography';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { themes } from '../../themes';


export interface PrivacyPolocyScreenParams {
    showSearchInput?: boolean;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, PrivacyPolocyScreenParams>;
}

export interface State {
    title: string,
    body: string,

}

/**
 * Describes who created the application.
 */
export class PrivacyPolocyScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
        this.initState();
    }

    private initState() {
        const privacyData = dataRealmStore.getBasicPage(5911);

        if (privacyData) {
            let state: State = {
                title: privacyData.title,
                body: privacyData.body,
            };

            this.state = state;
        };
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: PrivacyPolocyScreenParams = {
            showSearchInput: false,
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

    public render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ flex: 1, backgroundColor: 'white' }}
                        contentContainerStyle={[styles.container, { padding: themeContext.theme.screenContainer?.padding }]}
                    >
                        <View style={{ width: '100%', marginTop: 30, flexDirection: 'row', alignItems: 'center' }}  >
                            <Typography type={TypographyType.headingPrimary} style={{ textAlign: 'center', marginTop: 30 }}>
                                {this.state.title}
                            </Typography>
                            <Icon
                                name={"close"}
                                onPress={() => this.props.navigation.goBack()}
                                style={{ paddingLeft: 5, fontSize: 26, marginTop: 20, textAlign: "right", position: "absolute", right: 10, top: 20 }}
                            />

                        </View>
                        <HTML
                            html={this.state.body}
                            baseFontStyle={{ fontSize: scale(18) }}
                            tagsStyles={htmlStyles}
                            imagesMaxWidth={Dimensions.get('window').width}
                            staticContentMaxWidth={Dimensions.get('window').width}
                            onLinkPress={(event: any, href: string) => {
                                Linking.openURL(href);
                            }}
                        />


                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface PrivacyPolocyScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<PrivacyPolocyScreenStyles>({
    container: {
        // flex: 1,
    },
});
const htmlStyles = {
    p: { marginBottom: 15 },
    ol: { display: 'flex', flexDirection: "column" },
    li: { width: '100%' },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};