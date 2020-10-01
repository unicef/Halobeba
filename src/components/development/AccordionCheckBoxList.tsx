import React, { Component } from 'react'
import { ViewStyle, StyleSheet, Dimensions, View } from 'react-native'
import { scale, moderateScale } from 'react-native-size-matters';
import { List } from "react-native-paper";
import { Checkbox } from 'react-native-paper';
// @ts-ignore
import HTML from 'react-native-render-html';
import { TextButton, Typography } from '..';
import { dataRealmStore, ContentEntity } from '../../stores';
import { StackActions, } from 'react-navigation';
import { navigation } from '../../app';
import { TextButtonColor } from '../TextButton';
import { translate } from '../../translations';

export interface MilestoneItem {
    checked: boolean;
    title: string;
    id: number,
    html?: string;
    relatedArticles: number[]
}

export interface Props {
    title?: string
    items: MilestoneItem[];
    onCheckboxPressed: Function
    roundedButton?: { title: string, onPress: Function }
}



export class AccordionCheckBoxList extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    private renderRealtedArticles(articles: number[]) {
        return articles.map(articleId => dataRealmStore.getContentFromId(articleId));
    }

    private change = (id: number) => {
        if (this.props.onCheckboxPressed) {
            this.props.onCheckboxPressed(id)
        }
    }

    private goToArticle(item: ContentEntity | undefined) {
        if (item) {
            let category = dataRealmStore.getCategoryNameFromId(item.id);
           
            const pushAction = StackActions.push({
                routeName: 'HomeStackNavigator_ArticleScreen',
                params: {
                    article: item,
                    categoryName: category,
                },
            });
            // this.props.navigation.push('HomeStackNavigator_ArticleScreen', {article: item});
            navigation.dispatch(pushAction)
        }
    }

    render() {
        return (
            <List.AccordionGroup>
                {
                    this.props.items.map((item, key) => (
                        <View>
                            <View style={styles.checkBoxContainer}>
                                <Checkbox.Android status={item.checked ? 'checked' : 'unchecked'} color="#2BABEE" style={{ width: 2 }} onPress={() => this.change(item.id)} />
                            </View>
                            <List.Accordion
                                id={key + 1}
                                key={key + 1}
                                title={item?.title}
                                expanded={false}
                                titleNumberOfLines={2}
                                titleStyle={{ fontSize: moderateScale(15) }}
                                style={styles.listStyle}
                            >
                                <View style={{paddingHorizontal:30}}>

                                    <HTML
                                        html={item.html}
                                        baseFontStyle={{ fontSize: moderateScale(15) }}
                                        tagsStyles={htmlStyles}
                                        imagesMaxWidth={Dimensions.get('window').width}
                                        staticContentMaxWidth={Dimensions.get('window').width}
                                    />

                                    {
                                        this.renderRealtedArticles(item.relatedArticles).length !== 0 ? 
                                        <View style={{paddingVertical: 10}}>
                                        <Typography style={{marginBottom: 10}}>{translate('readMore')}</Typography>
                                        {
                                            this.renderRealtedArticles(item.relatedArticles)?.map(item => (
                                                <TextButton color={TextButtonColor.purple} onPress={() => this.goToArticle(item)}>{item?.title}</TextButton>
                                            ))
                                        }
                                    </View>
                                    : null
                                    }
                                   


                                </View>

                            </List.Accordion>
                        </View>
                    ))
                }
            </List.AccordionGroup>
        )
    }
}


export interface MilestoneFormStyles {
    listStyle: ViewStyle,
    checkBoxContainer: ViewStyle
}

const styles = StyleSheet.create<MilestoneFormStyles>({
    listStyle: {
        paddingVertical: scale(2),
        paddingLeft: 30,
        borderBottomColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1,
    },
    checkBoxContainer: {
        width: 30,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
    }
})

const htmlStyles = {
    p: { marginTop: 15, marginBottom: 15 },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};