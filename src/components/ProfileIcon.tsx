import React from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet, Image } from 'react-native';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { themes } from '../themes/themes';
import { GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale } from 'react-native-size-matters';

export interface Props {
    /**
     * Image URL or image data string.
     */
    image?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: Function;
}

export interface State {
    
}

export class ProfileIcon extends React.Component<Props, State> {
    static defaultProps: Props = {
        
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

    private onPhotoIconPress = (e:GestureResponderEvent) => {
        if (this.props.onPress) {
            this.props.onPress();
        }
    };

    public render() {
        const colors = themes.getCurrentTheme().theme.variables?.colors;
        let icon: JSX.Element;
        
        if (this.props.image) {
            // WITH PHOTO
            icon = (
                <TouchableOpacity
                    style={ { overflow:'hidden', borderRadius:moderateScale(18), backgroundColor:"transparent", width:moderateScale(36), height:moderateScale(36), justifyContent:'center', alignItems:'center'} }
                    onPress={ this.onPhotoIconPress }
                >
                    <Image
                        source={ {uri: this.props.image }}
                        style={{ width:'100%', height:'100%' }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            );
        } else {
            // NO PHOTO
            icon = (
                <TouchableOpacity
                    style={ { overflow:'hidden', borderRadius:moderateScale(18), backgroundColor:"transparent", borderWidth:moderateScale(2), borderColor:colors?.headerIcon, width:moderateScale(25), height:moderateScale(25), justifyContent:'center', alignItems:'center'} }
                    onPress={ this.onPhotoIconPress }
                >
                    <Icon
                        name={ "account-outline" }
                        style={{ color:colors?.headerIcon, fontSize:moderateScale(19), position:'absolute', }}
                    />
                </TouchableOpacity>
            );
        }

        return (
            <ThemeConsumer>
            {(themeContext:ThemeContextValue) => icon}
            </ThemeConsumer>
        );
    }
}

export interface ProfileIconStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<ProfileIconStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        // backgroundColor: 'orange',
        padding: 5,
        margin:0
    },
});
