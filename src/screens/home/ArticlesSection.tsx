import React, { Fragment } from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle, Image, ScrollView, ImageBackground } from 'react-native';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { CategoryArticlesViewEntity } from '../../stores/CategoryArticlesViewEntity';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { CategoryArticlesScreenParams } from './CategoryArticlesScreen';
import { navigation } from '../../app/Navigators';
import { ArticleScreenParams } from './ArticleScreen';
import { BorderlessButton, RectButton, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity } from "react-native-gesture-handler";
import { StackActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ContentEntity } from '../../stores/ContentEntity';
import { content } from '../../app';
import { VocabulariesAndTermsResponse } from '../../stores/apiStore';
import { Media } from '../../components';
import { VideoType } from '../../components/Media';

export interface Props {
    data: ArticlesSectionData;
    hideTitleUnderline?: boolean;
    style?: StyleProp<ViewStyle>;
}

export interface State {

}

export interface ArticlesSectionData {
    title: string;
    featuredArticle?: ContentEntity;
    otherFeaturedArticles?: ContentEntity[];
    categoryArticles?: CategoryArticlesViewEntity[];
    vocabulariesAndTermsResponse?: VocabulariesAndTermsResponse;
}

/**
 * Used from HomeScreen and ArticleScreen (related articles).
 */
export class ArticlesSection extends React.Component<Props, State> {
    static defaultProps: Props = {
        data: { title: 'No articles' },
        // data: articlesSectionAllData,
        hideTitleUnderline: false,
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {

        };

        this.state = state;
    }

    private gotoCategoryArticlesScreen(categoryData: CategoryArticlesViewEntity) {
        let params: CategoryArticlesScreenParams = {
            categoryId: categoryData.categoryId,
            categoryName: categoryData.categoryName,
        };

        navigation.navigate('HomeStackNavigator_CategoryArticlesScreen', params);
    }

    private onArticlePress(article?: ContentEntity) {
        if (!article) return;
        // Text article
        const pushAction = StackActions.push({
            routeName: 'HomeStackNavigator_ArticleScreen',
            params: {
                article: article,
                categoryName: content.toContentViewEntity(article, this.props.data.vocabulariesAndTermsResponse).category?.name
            },
        });

        navigation.dispatch(pushAction);

        // if (!article.youTubeVideoId) {
        //     // Text article
        //     const pushAction = StackActions.push({
        //         routeName: 'HomeStackNavigator_ArticleScreen',
        //         params: {
        //             article: article
        //         },
        //     });

        //     navigation.dispatch(pushAction);
        // } else {
        //     // Video article
        //     navigation.navigate('RootModalStackNavigator_VideoScreen', {
        //         videoId: article?.youTubeVideoId
        //     });
        // }
    }

    public render() {
        let getPlayIcon = (themeContext: ThemeContextValue, size: number = scale(70)) => {
            return (
                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    width: size, height: size,
                    borderRadius: themeContext.percentageToDP('20%')
                }}>
                    <Icon
                        name={"play"}
                        style={{ color: 'white', marginLeft: size / 10, fontSize: size / 2 }}
                    />
                </View>
            );
        }
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <View style={[styles.container, this.props.style]}>
                        {/* SECTION TITLE */}
                        <Typography type={TypographyType.headingPrimary} style={{ marginBottom: 0 }}>{this.props.data.title}</Typography>

                        {/* DIVIDER */}
                        {this.props.hideTitleUnderline ? (
                            <View style={{ height: scale(10) }} />
                        ) : (
                                <View style={styles.divider} />
                            )}

                        {/* ----------------- */}
                        {/* FEATURED ARTICLES */}
                        {/* ----------------- */}
                        {this.props?.data?.featuredArticle || this.props?.data?.otherFeaturedArticles ? (
                            <View style={{ marginBottom: scale(20) }}>
                                {this.props?.data?.featuredArticle ? (
                                    <Media
                                        title={this.props?.data?.featuredArticle?.title}

                                        coverImageUrl={content.getCoverImageFilepath(this.props?.data?.featuredArticle)}
                                        videoType={this.props?.data?.featuredArticle.coverVideoSite as VideoType}
                                        videoUrl={this.props?.data?.featuredArticle.coverVideoUrl}

                                        roundCorners={true}
                                        aspectRatio={1.7}
                                        style={{ width: '100%' }}

                                        onPress={() => { this.onArticlePress(this.props?.data?.featuredArticle) }}
                                    />
                                ) : null}

                                {/* Featured articles */}
                                {this.props?.data?.otherFeaturedArticles && this.props?.data?.otherFeaturedArticles.length > 0 ? (
                                    <ScrollView horizontal={true}>
                                        {this.props?.data?.otherFeaturedArticles.map((article, index) => (
                                            <Media
                                                key={index}
                                                title={article?.title}

                                                coverImageUrl={content.getCoverImageFilepath(article)}
                                                videoType={article.coverVideoSite as VideoType}
                                                videoUrl={article.coverVideoUrl}

                                                roundCorners={true}
                                                aspectRatio={1}
                                                style={{ width: scale(180), marginRight: scale(15), marginBottom: scale(10) }}

                                                onPress={() => { this.onArticlePress(article) }}
                                            />
                                        ))}
                                    </ScrollView>
                                ) : null}
                            </View>
                        ) : null}

                        {/* ----------------- */}
                        {/* CATEGORY ARTICLES */}
                        {/* ----------------- */}
                        {this.props?.data?.categoryArticles && this.props?.data?.categoryArticles.length > 0 ? (
                            <View>
                                {this.props?.data?.categoryArticles.map((category, index) => (
                                    <View key={index} style={{ marginBottom: scale(15) }}>
                                        <View style={{ marginBottom: scale(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            {/* Category name */}
                                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1 }}>{category.categoryName}</Typography>

                                            {/* Show all articles */}
                                            <TextButton color={TextButtonColor.purple} style={{ padding: 0 }} onPress={() => { this.gotoCategoryArticlesScreen(category) }}>
                                                {translate('showAllArticles')}
                                            </TextButton>
                                        </View>

                                        {/* Category articles */}
                                        {category?.articles && category?.articles.length > 0 ? (
                                            <ScrollView horizontal={true}>
                                                {category?.articles.map((article, index) => (
                                                    <Media
                                                        key={index}
                                                        title={article?.title}

                                                        coverImageUrl={content.getCoverImageFilepath(article)}
                                                        videoType={article.coverVideoSite as VideoType}
                                                        videoUrl={article.coverVideoUrl}

                                                        roundCorners={true}
                                                        aspectRatio={1}
                                                        style={{ width: scale(180), marginRight: scale(15), marginBottom: scale(15) }}

                                                        onPress={() => { this.onArticlePress(article) }}
                                                    />
                                                ))}
                                            </ScrollView>
                                        ) : null}
                                    </View>
                                ))}
                            </View>
                        ) : null}
                    </View>
                )}
            </ThemeConsumer>
        );
    }
}

export interface ArticlesSectionStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    divider: ViewStyle;
    image: ImageStyle;
}

const styles = StyleSheet.create<ArticlesSectionStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        // backgroundColor: 'orange',
        // borderWidth: 10,
        // borderColor: 'green',
    },

    divider: {
        marginTop: scale(10),
        marginBottom: scale(20),
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8',
    },

    image: {
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    }
});
