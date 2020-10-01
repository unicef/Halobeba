import React, { Fragment, RefObject } from 'react';
import { SafeAreaView, FlatList, View, Text, Button, StyleSheet, ViewStyle, ScrollView, Image, ImageStyle, ImageBackground, ActivityIndicator } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ArticleScreenParams } from './ArticleScreen';
import { TouchableOpacity } from "react-native-gesture-handler";
import { CategoryArticlesViewEntity } from '../../stores/CategoryArticlesViewEntity';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ContentViewEntity } from '../../stores/ContentViewEntity';
import { DataRealmConsumer, DataRealmContextValue } from '../../stores/DataRealmContext';
import { ContentEntity, ContentEntitySchema } from '../../stores/ContentEntity';
import { content } from '../../app';
import { Media } from '../../components';
import { VideoType } from '../../components/Media';
import { dataRealmStore } from '../../stores';

const DIVIDER_HEIGHT = scale(25);

export interface CategoryArticlesScreenParams {
    categoryName: string;
    categoryId: number;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, CategoryArticlesScreenParams>;
}

export interface State {
    listData?: ContentEntity[];
}

/**
 * Shows articles of some specific category.
 */
export class CategoryArticlesScreen extends React.Component<Props, State> {

    private readonly list: RefObject<FlatList<ContentEntity>>;

    public constructor(props: Props) {
        super(props);

        this.list = React.createRef();
        this.setDefaultScreenParams();
        this.initState();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: CategoryArticlesScreenParams = {
            // data: { categoryId: 0, categoryName: 'No category', articles: [] }
            categoryId: 0,
            categoryName: 'No category',
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private initState() {
        let listData = this.getListData();

        this.state = {
            listData: listData ? listData : []
        };
    }

    private getListData() {
        if (!dataRealmStore.realm) return;
        const screenParams = this.props.navigation.state.params!;

        return content.getCategoryScreenArticles(dataRealmStore.realm, screenParams.categoryId);
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private gotoArticleScreen(article?: ContentEntity) {
        if (!article) return;

        const screenParams = this.props.navigation.state.params!;

        // Text article
        let params: ArticleScreenParams = {
            article: article,
            categoryName: screenParams.categoryName,
        };

        this.props.navigation.navigate('HomeStackNavigator_ArticleScreen', params);
    }

    private listKeyExtractor = (item: ContentEntity, index: number): string => {
        return item.id + '';
    };

    private getListRenderItem = ({ item, index }: { item: ContentEntity, index: number }) => {
        return (
            <Media
                key={item.id}
                title={item.title}

                coverImageUrl={content.getCoverImageFilepath(item)}
                videoType={item.coverVideoSite as VideoType}
                videoUrl={item.coverVideoUrl}
                playVideoDirectly={false}

                roundCorners={true}
                borderRadius={5}
                aspectRatio={1.8}
                style={{ width: '100%' }}
                titleStyle={{paddingLeft:scale(15)}}

                onPress={() => { this.gotoArticleScreen(item) }}
            />
        );
    };

    private getListItemSeparatorComponent = (props: any) => {
        return (
            <View style={{ height: DIVIDER_HEIGHT }} />
        );
    };

    private getListEmptyComponent = (props: any) => {
        let emptyComponent: JSX.Element;

        if (this.state.listData === undefined) {
            // Show activity indicator when data array is undefined
            emptyComponent = <ActivityIndicator animating={true} style={{ height: scale(70) }} />;
        } else {
            // Show NO_ITEMS_TEXT when data array is empty array
            emptyComponent = (
                <View style={{ height: scale(70), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: scale(15) }}>
                    <Text
                        numberOfLines={1}
                        style={{ flex: 1, color: '#212121', fontSize: 17, textAlign: 'center', lineHeight: moderateScale(20) }}
                    >No items</Text>
                </View>
            )
        }

        return emptyComponent;
    };

    private getListItemLayout = (data: ContentEntity[] | null | undefined, index: number) => {
        let itemHeight = scale(300) + DIVIDER_HEIGHT;
        return { length: itemHeight, offset: itemHeight * index, index };
    };

    private getListHeaderComponent = (props: any) => {
        const screenParams = this.props.navigation.state.params!;

        return (
            <View
                // style={{ borderWidth: 2, borderColor: 'blue' }}
            >
                {/* GO BACK */}
                <TextButton style={{ padding: 0 }} icon="chevron-left" iconStyle={{ color: '#AA40BF' }} textStyle={{ fontSize: scale(16) }} color={TextButtonColor.purple} onPress={() => { this.gotoBack() }}>
                    {translate('buttonBack')}
                </TextButton>

                <View style={{ marginBottom: scale(15) }} />

                {/* CATEGORY NAME */}
                <Typography type={TypographyType.headingPrimary}>
                    {screenParams.categoryName}
                </Typography>
            </View>
        );
    };

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <View style={[styles.container, { backgroundColor: themeContext.theme.screenContainer?.backgroundColor }]}>
                        <FlatList
                            ref={this.list}
                            data={this.state.listData}
                            keyExtractor={this.listKeyExtractor}
                            style={{padding: themeContext.theme.screenContainer?.padding}}
                            contentContainerStyle={{paddingBottom:scale(40)}}

                            // Sub components
                            renderItem={this.getListRenderItem}
                            ItemSeparatorComponent={this.getListItemSeparatorComponent}
                            ListEmptyComponent={this.getListEmptyComponent}
                            ListHeaderComponent={this.getListHeaderComponent}

                            // Performance related
                            // getItemLayout={this.getListItemLayout}
                            // removeClippedSubviews={true} /* Default: false */
                            initialNumToRender={5} /* Default: 10 */
                            maxToRenderPerBatch={10} /* Default: 10 */
                            windowSize={21}  /* Default: 21 */
                        />
                    </View>
                )}
            </ThemeConsumer>
        );
    }

}

export interface CategoryArticlesScreenStyles {
    container?: ViewStyle;
    image?: ImageStyle;
}

const styles = StyleSheet.create<CategoryArticlesScreenStyles>({
    container: {
        flex: 1,
        // borderWidth: 2,
        // borderColor: 'red',
    },

    image: {
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    }
});
