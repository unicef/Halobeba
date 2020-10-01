import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, ImageBackground, ImageSourcePropType, View, TextStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SceneView } from 'react-navigation';
import { scale } from 'react-native-size-matters';

export interface Props {
    type?: WalkthroughBackgroundType,
    style?: StyleProp<ViewStyle>,
}

export interface State {
    imageSource: ImageSourcePropType,
}

export enum WalkthroughBackgroundType {
    walkthrough1,
    walkthrough2,
    walkthrough3,
    walkthrough4,
    walkthrough5,
}

export class WalkthroughBackground extends React.Component<Props, State> {
    static defaultProps: Props = {
        type: WalkthroughBackgroundType.walkthrough1
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            imageSource: require('./assets/01.png'),
        };

        if (this.props.type === WalkthroughBackgroundType.walkthrough1) {
            state.imageSource = require('./assets/01.png');
        }

        if (this.props.type === WalkthroughBackgroundType.walkthrough2) {
            state.imageSource = require('./assets/02.png');
        }

        if (this.props.type === WalkthroughBackgroundType.walkthrough3) {
            state.imageSource = require('./assets/03.png');
        }

        if (this.props.type === WalkthroughBackgroundType.walkthrough4) {
            state.imageSource = require('./assets/04.png');
        }

        if (this.props.type === WalkthroughBackgroundType.walkthrough5) {
            state.imageSource = require('./assets/05.png');
        }

        this.state = state;
    }

    public render() {
        return (
            <ImageBackground
                source={this.state.imageSource}
                style={[styles.container, this.props.style]}
                resizeMode="cover"
            >
                <View style={{ height: '47%', }}></View>
                <View style={{ height: '53%', flex: 0, paddingTop: scale(25) }}>
                    <ScrollView>

                        <View style={styles.contentWrapper}>
                            {this.props.children}
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}

export interface WalkthroughBackgroundStyles {
    container?: ViewStyle;
    contentWrapper?: ViewStyle;
}

const styles = StyleSheet.create<WalkthroughBackgroundStyles>({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },

    contentWrapper: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 20
    },
});
