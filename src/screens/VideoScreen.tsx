import React from 'react';
import { Text, SafeAreaView, View, StyleSheet, ViewStyle, LayoutChangeEvent, StatusBar } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import { IconButton, Colors, ActivityIndicator } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';
// @ts-ignore
import YoutubePlayer, { getYoutubeMeta } from 'react-native-youtube-iframe';
import { VideoType } from '../components/Media';
import { WebView } from 'react-native-webview';
import Orientation from 'react-native-orientation-locker';

export interface VideoScreenParams {
    videoId: string;
    videoType: VideoType;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, VideoScreenParams>;
}

export interface State {
    orientation: 'portrait' | 'landscape';
    containerWidth?: number;
    containerHeight?: number;
    aspectRatio?: number;
}

export class VideoScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
        this.initState();
    }

    public componentDidMount() {
        Orientation.lockToLandscape();
    }

    public componentWillUnmount() {
        Orientation.lockToPortrait();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: VideoScreenParams = {
            videoId: 'Wzrw7WTBVuk',
            videoType: 'youtube',
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private initState() {
        let windowWidth = Dimensions.get('window').width;
        let windowHeight = Dimensions.get('window').height;

        let state: State = {
            orientation: windowWidth > windowHeight ? 'landscape' : 'portrait',
            containerWidth: windowWidth,
            containerHeight: windowHeight,
            aspectRatio: 1.7,
        };

        this.state = state;
    }

    private onContainerLayout = (event: LayoutChangeEvent) => {
        let layout = event.nativeEvent.layout;

        let orientation: 'portrait' | 'landscape' = layout.width > layout.height ? 'landscape' : 'portrait';
        let containerWidth: number = layout.width;
        let containerHeight: number = layout.height;

        this.setState({
            orientation: orientation,
            containerWidth: containerWidth,
            containerHeight: containerHeight,
        });
    };

    private goBack() {
        this.props.navigation.goBack();
    }

    private getVimeoHtml() {
        const screenParams = this.props.navigation.state.params!;

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body style="background-color:black">
            <div style="padding:56.25% 0 0 0;position:relative;">
                <iframe
                    src="https://player.vimeo.com/video/${screenParams.videoId}?autoplay=1&muted=0&loop=0&title=0&byline=0&portrait=0&controls=1"
                    style="position:absolute;top:0;left:0;width:100%;height:100%;"
                    frameborder="0"
                    allow="autoplay; fullscreen"
                    allowfullscreen
                ></iframe>
            </div>
            
            <style>
            .vertical-center {
              margin: 0;
              position: absolute;
              top: 50%;
              -ms-transform: translateY(-50%);
              transform: translateY(-50%);
            }
            </style>

            <script src="https://player.vimeo.com/api/player.js"></script>
            
            <script>
                var iframe = document.querySelector('iframe');
                var player = new Vimeo.Player(iframe);

                player.on('ended', () => {
                    window.ReactNativeWebView.postMessage("close_window");
                });

                function playVideo() {
                    player.play();
                    let backdrop = document.getElementById("backdrop");
                    backdrop.style.display = 'none';
                }

                // document.write(\`<button id="playButtonId" style="font-size:50px" onclick="player.play()">Click me</button>\`);
                // document.write(\`
                //     <div id="backdrop" onclick="playVideo()" style="position:absolute; top:0; left:0; bottom:0; right:0; background-color:rgba(0, 0, 0, 0.3);;">
                //         <div class="vertical-center" style="width:100%">
                //             <p style="color:white; font-size:30px; text-align:center; width:100%;">
                //                 Press to play
                //             </p>
                //         </div>
                //     </div>
                // \`);
            </script>
        </body>
        </html>
        `;
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <View style={[styles.container, themeContext.theme.contentContainer]}>
                        {/* STATUS BAR */}
                        <StatusBar hidden={true} animated={true} />

                        <View onLayout={this.onContainerLayout} style={{ backgroundColor: 'black', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            {this.state.containerWidth && this.state.containerHeight && this.state.aspectRatio ? (screenParams.videoType === 'youtube' ? (
                                <YoutubePlayer
                                    width={this.state.containerWidth}
                                    height={this.state.containerWidth / this.state.aspectRatio}
                                    videoId={screenParams.videoId}
                                    play={true}
                                    // volume={50}
                                    // webViewStyle={{borderWidth:3, borderColor:'red'}}
                                    // @ts-ignore
                                    webViewProps={{ allowsFullscreenVideo: false }}
                                    webViewStyle={{}}
                                    initialPlayerParams={{
                                        preventFullScreen: true,
                                        cc_lang_pref: "us",
                                        showClosedCaptions: false,
                                    }}
                                />
                            ) : (
                                    <WebView
                                        containerStyle={{
                                            // width: '80%',
                                            height: this.state.containerHeight,
                                            aspectRatio: 1.75,
                                            alignSelf: 'center',
                                            // aspectRatio: this.state.aspectRatio,
                                            // borderWidth: 5, borderColor: 'blue',
                                        }}
                                        originWhitelist={['*']}
                                        source={{ html: this.getVimeoHtml() }}
                                        onMessage={(event) => {
                                            if (event.nativeEvent.data === 'close_window') {
                                                this.goBack();
                                            }
                                        }}
                                    />
                                )) : null}

                            <IconButton
                                icon="close"
                                color={Colors.white}
                                size={scale(30)}
                                onPress={() => { this.goBack() }}
                                style={{ position: 'absolute', top: scale(0), right: scale(0), backgroundColor: 'black' }}
                            />
                        </View>
                    </View>
                )}
            </ThemeConsumer>
        );
    }

}

export interface VideoScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<VideoScreenStyles>({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});
