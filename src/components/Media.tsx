import React, { RefObject } from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle, TouchableOpacity, ImageBackground, Alert, Platform } from 'react-native';
import { Typography, TypographyType } from './Typography';
import { scale } from 'react-native-size-matters';
import { themes } from '../themes';
import Icon from 'react-native-vector-icons/FontAwesome';
import { utils } from '../app';
import { navigation } from '../app/Navigators';
import { WebView } from 'react-native-webview';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';

export interface Props {
    title?: string;
    videoType?: VideoType;
    videoUrl?: string;
    videoPlayButtonSize?: number;
    playVideoDirectly?: boolean;
    coverImageUrl: string;
    aspectRatio?: number;
    roundCorners?: boolean;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    onPress?: Function;
}

export interface State {

}

export class Media extends React.Component<Props, State> {
    private vimeoWebViewRef: RefObject<WebView>;

    static defaultProps: Props = {
        videoType: 'youtube',
        videoUrl: '',
        videoPlayButtonSize: scale(70),
        playVideoDirectly: false,
        coverImageUrl: '',
        aspectRatio: 1.7,
        roundCorners: false,
        borderRadius: 10,
        titleStyle: {},
    };

    constructor(props: Props) {
        super(props);
        this.vimeoWebViewRef = React.createRef<WebView>();
        this.initState();
    }

    private initState() {
        let state: State = {

        };

        this.state = state;
    }

    private onTitlePress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    private onCoverImagePress() {
        if (!this.props.playVideoDirectly) {
            if (this.props.onPress) {
                this.props.onPress();
            }

            return;
        }

        // VIMEO ON IOS
        if (this.props.videoUrl && this.props.videoType === 'vimeo' && Platform.OS === 'ios') {
            this.vimeoWebViewRef.current?.injectJavaScript(`player.play(); true;`);

            return;
        }

        // VIDEO
        if (this.props.videoUrl) {
            const videoId = this.props.videoType === 'youtube' ? utils.getYoutubeId(this.props.videoUrl) : utils.getVimeoId(this.props.videoUrl);

            // Video article
            navigation.navigate('RootModalStackNavigator_VideoScreen', {
                videoId: videoId,
                videoType: this.props.videoType,
            });
        }

        // IMAGE
        if (!this.props.videoUrl) {
            if (this.props.onPress) {
                this.props.onPress();
            }
        }
    }

    private getVimeoHtml() {
        if (!this.props.videoUrl) return '';

        const videoId = utils.getVimeoId(this.props.videoUrl);

        return `
        <div style="padding:56.25% 0 0 0;position:relative;">
            <iframe
                src="https://player.vimeo.com/video/${videoId}?autoplay=0&loop=0&title=0&byline=0&portrait=0&controls=0"
                style="position:absolute;top:0;left:0;width:100%;height:100%;"
                frameborder="0"
                allow="autoplay; fullscreen"
                allowfullscreen
            ></iframe>
        </div>
        
        <script src="https://player.vimeo.com/api/player.js"></script>
        
        <script>
            var iframe = document.querySelector('iframe');
            var player = new Vimeo.Player(iframe);
            //document.write(\`<button style="font-size:50px" onclick="player.play()">Click me</button>\`);
        </script>
        `;
    }

    public render() {
        let getPlayIcon = () => {
            const size = this.props.videoPlayButtonSize ?? scale(60);

            return (
                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    width: size, height: size,
                    borderRadius: themes.percentageToDP('20%'),
                    position: 'absolute',
                }}>
                    <Icon
                        name={"play"}
                        style={{ color: 'white', marginLeft: size / 10, fontSize: size / 2 }}
                    />
                </View>
            );
        };

        return (
            <View style={[styles.container, this.props.style]}>
                {/* COVER IMAGE */}
                <TouchableOpacity
                    style={{ width: '100%', aspectRatio: this.props.aspectRatio }}
                    onPress={() => { this.onCoverImagePress() }}
                >
                    {this.props.playVideoDirectly && this.props.videoUrl && this.props.videoType === 'vimeo' && Platform.OS === 'ios' ? (
                        // VIMEO ON IOS
                        <>
                            <WebView
                                ref={this.vimeoWebViewRef}
                                style={[{ width: '100%', height: '100%' }, (this.props.roundCorners ? {overflow:'hidden', borderRadius:this.props.borderRadius} : {})]}
                                originWhitelist={['*']}
                                source={{ html: this.getVimeoHtml() }}
                            />

                            <View
                                style={[styles.coverImage, (this.props.roundCorners ? {overflow:'hidden', borderRadius:this.props.borderRadius} : {}), { position:'absolute', width: '100%', height:'100%' }]}
                            >
                                <FastImage
                                    source={{ uri: this.props.coverImageUrl }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />

                                {this.props.videoUrl ? getPlayIcon() : null}
                            </View>
                        </>
                    ) : (
                            // OTHER
                            <View
                                style={[styles.coverImage, (this.props.roundCorners ? {overflow:'hidden', borderRadius:this.props.borderRadius} : {}), { width: '100%', aspectRatio: this.props.aspectRatio }]}
                            >
                                <FastImage
                                    source={{ uri: this.props.coverImageUrl }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />

                                {this.props.videoUrl ? getPlayIcon() : null}
                            </View>
                        )}
                </TouchableOpacity>

                {/* TITLE */}
                {this.props.title ? (
                    <>
                        <View style={{ height: scale(10) }} />
                        <TouchableOpacity
                            onPress={() => { this.onTitlePress() }}
                        >
                            <Typography style={ this.props.titleStyle } type={TypographyType.headingSecondary}>
                                {this.props.title}
                            </Typography>
                        </TouchableOpacity>
                    </>
                ) : null}
            </View>
        );
    }
}

export interface VideoStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    // roundCorner: ViewStyle;
    coverImage: ViewStyle;
}

const styles = StyleSheet.create<VideoStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        // backgroundColor: 'orange',
        // padding: 15,
    },

    // roundCorner: {
    //     borderRadius: 10,
    //     overflow: 'hidden',
    // },

    coverImage: {
        // borderRadius: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    }
});

export type VideoType = 'youtube' | 'vimeo';