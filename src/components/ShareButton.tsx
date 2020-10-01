import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale } from 'react-native-size-matters';

export interface Props {
    style?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
    onPress?: Function;
}

export class ShareButton extends React.Component<Props> {
    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);
    }

    private onPress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    public render() {
        return (
            <TouchableOpacity
                style={ [styles.container, this.props.style] }
                onPress={ () => {this.onPress()} }
            >
                <Icon
                    name={ "share-alt" }
                    style={ [styles.iconStyle, this.props.iconStyle] }
                />
            </TouchableOpacity>
        );
    }
}

export interface ShareButtonStyles {
    container?: ViewStyle;
    iconStyle?: TextStyle;
}

const styles = StyleSheet.create<ShareButtonStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AA40BF',
        width:scale(52), height:scale(52),
        borderRadius: scale(26),
        elevation: 10,
        shadowOffset: {width:3, height:3},
        shadowOpacity: 0.3,
    },

    iconStyle: {
        color: 'white',
        fontSize: scale(20),
    },
});
