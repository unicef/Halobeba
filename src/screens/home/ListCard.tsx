import React from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle, Platform } from 'react-native';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { themes } from "../../themes/themes";
import { Surface, List, Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { RectButton } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
// @ts-ignore
import HTML from 'react-native-render-html';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';

const DEFAULT_PREVIEW_NUMBER_OF_ITEMS = 5;

export interface Props {
    mode?: ListCardMode,
    title?: string;
    subTitle?: string;
    items: ListCardItem[];
    previewNumberOfItems?: number;
    showAllText?: string;
    style?: StyleProp<ViewStyle>;
    onItemPress?: (item: ListCardItem) => void
}

export interface State {
    showAllItems: boolean;
}

export interface ListCardItem {
    id: number;
    type: 'article' | 'faq';
    title: string;
    /**
     * This is visible only for accordion mode.
     */
    bodyHtml?: string;
}

export enum ListCardMode {
    simpleList,
    accordionList
}

/**
 * Card with article titles that can be pressed, or FAQ questions that when
 * pressed will expand the answer.
 */
export class ListCard extends React.Component<Props, State> {
    private numberOfItemsToShow: number = 0;
    private showShowAllButton: boolean = false;

    static defaultProps: Props = {
        mode: ListCardMode.simpleList,
        items: [],
        previewNumberOfItems: DEFAULT_PREVIEW_NUMBER_OF_ITEMS,
        showAllText: translate('showAllResults'),
    };

    constructor(props: Props) {
        super(props);
        this.initState();
        this.setLocalValues();
    }

    private initState() {
        let state: State = {
            showAllItems: false,
        };

        this.state = state;
    }

    private setLocalValues() {
        this.showShowAllButton = this.props.items.length > (this.props.previewNumberOfItems ? this.props.previewNumberOfItems : DEFAULT_PREVIEW_NUMBER_OF_ITEMS);

        if (this.state.showAllItems) {
            this.numberOfItemsToShow = this.props.items.length;
        } else {
            this.numberOfItemsToShow = Math.min(
                this.props.previewNumberOfItems ? this.props.previewNumberOfItems : DEFAULT_PREVIEW_NUMBER_OF_ITEMS,
                this.props.items.length ? this.props.items.length : 0,
            );
        }
    }

    private onItemPress(item: ListCardItem) {
        if (this.props.onItemPress) {
            this.props.onItemPress(item);
        }
    }

    private toggleShowAllItems() {
        this.setState((prevState, props) => {
            let numberOfItemsToShow: number;

            if (prevState.showAllItems) {
                numberOfItemsToShow = this.props.previewNumberOfItems ? this.props.previewNumberOfItems : DEFAULT_PREVIEW_NUMBER_OF_ITEMS;
            } else {
                numberOfItemsToShow = this.props.items.length;
            }

            return {
                showAllItems: !prevState.showAllItems,
                numberOfItemsToShow,
            };
        });
    }

    private getSimpleListItems(themeContext: ThemeContextValue): JSX.Element[] {
        let items: JSX.Element[] = [];

        for (let i = 0; i < this.numberOfItemsToShow; i++) {
            let item = this.props.items[i];

            items.push((
                <List.Item
                    key={i}
                    title={item?.title}
                    right={props => <List.Icon {...props} style={{margin:0}} color={themeContext.theme.variables?.colors?.primary} icon="chevron-right" />}
                    onPress={() => { this.onItemPress(item) }}
                    style={{ paddingVertical: scale(3) }}
                    titleStyle={styles.item}
                    titleNumberOfLines={2}
                />
            ));
        }

        return items;
    }

    private getAccordionListItems(themeContext: ThemeContextValue): JSX.Element {
        let items: JSX.Element[] = [];

        for (let i = 0; i < this.numberOfItemsToShow; i++) {
            let item = this.props.items[i];

            items.push((
                <List.Accordion
                    id={i+1}
                    key={i+1}
                    title={item?.title}
                    titleStyle={styles.item}
                    titleNumberOfLines={3}
                    style={{paddingVertical:scale(2)}}
                >
                    <View style={{paddingHorizontal:scale(15), marginBottom:scale(20)}}>
                        <HTML
                            html={ item?.bodyHtml }
                            baseFontStyle={ { fontSize:scale(14) } }
                            tagsStyles={ {p:{marginBottom:15}, a:{fontWeight:'bold', textDecorationLine:'none'}} }
                            imagesMaxWidth={ Dimensions.get('window').width }
                            staticContentMaxWidth={ Dimensions.get('window').width }
                        />
                    </View>
                </List.Accordion>
            ));
        }

        return (<List.AccordionGroup>{items}</List.AccordionGroup>);
    }

    private onTestButtonPress() {
        console.log(JSON.stringify(this.props.items, null, 4));
    }

    public render() {
        this.setLocalValues();

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <Surface style={[styles.container, this.props.style]}>
                        {/* TITLE */}
                        {this.props.title ? (
                            <Typography
                                type={TypographyType.headingSecondary}
                                style={styles.title}

                            >
                                {this.props.title}
                            </Typography>
                        ) : null}

                        {/* TEST */}
                        {/* <Button onPress={() => {this.onTestButtonPress()}}>Test</Button> */}

                        {/* SUB TITLE */}
                        {this.props.subTitle ? (
                            <Typography
                                type={TypographyType.bodyRegular}
                                style={styles.subTitle}
                            >
                                {this.props.subTitle}
                            </Typography>
                        ) : null}

                        <View style={{ height: scale(10) }} />

                        {/* ITEMS */}
                        {
                            this.props.mode === ListCardMode.simpleList
                                ? this.getSimpleListItems(themeContext)
                                : this.getAccordionListItems(themeContext)
                        }

                        {/* SHOW ALL ITEMS BUTTON */}
                        {this.showShowAllButton ? (
                            <RectButton
                                style={{ alignItems: 'center' }}
                                onPress={() => { this.toggleShowAllItems() }}
                            >
                                <TextButton
                                    color={TextButtonColor.purple}
                                    style={{ marginTop: scale(10) }}
                                >
                                    {this.state.showAllItems ? translate('showLessResults') : translate('showAllResults') + ` (${this.props.items.length})`}
                                </TextButton>

                                {!this.state.showAllItems ? (
                                    <Icon
                                        name="chevron-down"
                                        style={{ fontSize: scale(20), color: themeContext.theme.variables?.colors?.primary }}
                                    />
                                ) : (
                                        <Icon
                                            name="chevron-up"
                                            style={{ fontSize: scale(20), color: themeContext.theme.variables?.colors?.primary }}
                                        />
                                    )}
                            </RectButton>
                        ) : null}
                    </Surface>
                )}
            </ThemeConsumer>
        );
    }
}

export interface ListCardStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    title: TextStyle;
    subTitle: TextStyle;
    item: TextStyle;
}

const styles = StyleSheet.create<ListCardStyles>({
    container: {
        alignSelf: 'stretch',

        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',

        backgroundColor: themes.getCurrentTheme().theme.variables?.colors?.surface,
        paddingVertical: scale(10),
        borderRadius: scale(7),

        elevation: Platform.OS === 'ios' ? 4 : 10,
    },

    title: {
        paddingHorizontal: scale(12),
        marginBottom: scale(5),
    },

    subTitle: {
        fontWeight: 'bold',
        paddingHorizontal: scale(12),
    },

    item: {
        fontFamily: 'SFUIDisplay-Regular',
        fontSize: moderateScale(17),
        lineHeight: moderateScale(18),
        color: '#262626',
    }
});
