import React from 'react';
import { Text, StyleProp, ViewStyle, StyleSheet, TextStyle, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { translate } from '../translations/translate';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { RectButton } from "react-native-gesture-handler";

export interface Props {
    title?: string;
    type?: FancyButtonType;
    iconPosition?: FancyButtonIconPosition;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress?: Function;
}

export interface State {
    text?: string,
    iconComponent?: JSX.Element,
    iconPosition?: FancyButtonIconPosition;
    containerStyle: ViewStyle;
    textStyle: TextStyle;
}

export enum FancyButtonType {
    home,
    growth,
    doctor,
    vaccination,
    development,
    food,
    health,
    safety,
    games,
    parents,
    responsive,
    faq,

    aboutUs,
    contact,
    settings,
}

export enum FancyButtonIconPosition {
    top,
    left,
}

export class FancyButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            text: '',
            iconComponent: undefined,
            iconPosition: this.props.iconPosition ? this.props.iconPosition : FancyButtonIconPosition.top,

            containerStyle: {
                backgroundColor: '#FBF1FD',
            },

            textStyle: {
                color: '#AA40BF',
                fontSize: 17,
                lineHeight: 20,
                fontFamily: 'SFUIDisplay-Semibold',
            },
        };

        if (this.props.type === FancyButtonType.home) {
            state.text = translate('drawerButtonHome');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'home' }
                    style={ {fontSize:24, lineHeight:24, color:'#AA40BF', marginBottom:13,} }
                />
            );
        }

        if (this.props.type === FancyButtonType.growth) {
            state.text = translate('drawerButtonGrowth');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'weight' }
                    style={ {fontSize:24, lineHeight:24, color:'#AA40BF', marginBottom:13,} }
                />
            );
        }

        if (this.props.type === FancyButtonType.doctor) {
            state.text = translate('drawerButtonDoctor');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'stethoscope' }
                    style={ {fontSize:24, lineHeight:24, color:'#AA40BF', marginBottom:13,} }
                />
            );
        }

        if (this.props.type === FancyButtonType.vaccination) {
            state.text = translate('drawerButtonVaccination');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'syringe' }
                    style={ {fontSize:24, lineHeight:24, color:'#AA40BF', marginBottom:13,} }
                />
            );
        }

        if (this.props.type === FancyButtonType.development) {
            state.text = translate('drawerButtonDevelopment');
            state.iconComponent = (
                <IconFontAwesome
                    name={ 'flag' }
                    style={ {fontSize:24, lineHeight:24, color:'#AA40BF', marginBottom:13,} }
                />
            );
        }

        if (this.props.type === FancyButtonType.food) {
            state.containerStyle.backgroundColor = '#FFFAE6';
            state.textStyle.color = '#EFA000';
            state.text = translate('drawerButtonFood');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'carrot' }
                    style={ {fontSize:24, lineHeight:24, color:'#EFA000', marginBottom:13,} }
                />
            );
            state.containerStyle.paddingBottom = 15;
        }

        if (this.props.type === FancyButtonType.health) {
            state.containerStyle.backgroundColor = '#ECFEEE';
            state.textStyle.color = '#2CBA39';
            state.text = translate('drawerButtonHealth');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'baby' }
                    style={ {fontSize:24, lineHeight:24, color:'#2CBA39', marginBottom:13,} }
                />
            );
            state.containerStyle.paddingBottom = 15;
        }

        if (this.props.type === FancyButtonType.safety) {
            state.containerStyle.backgroundColor = '#F0F0FF';
            state.textStyle.color = '#6967E4';
            state.text = translate('drawerButtonSafety');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'shield-alt' }
                    style={ {fontSize:24, lineHeight:24, color:'#6967E4', marginBottom:13,} }
                />
            );
            state.containerStyle.paddingBottom = 15;
        }

        if (this.props.type === FancyButtonType.games) {
            state.containerStyle.backgroundColor = '#FFF1E6';
            state.textStyle.color = '#F5893D';
            state.text = translate('drawerButtonGames');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'horse' }
                    style={ {fontSize:24, lineHeight:24, color:'#F5893D', marginBottom:13,} }
                />
            );
            state.containerStyle.paddingBottom = 15;
        }

        if (this.props.type === FancyButtonType.parents) {
            state.containerStyle.backgroundColor = '#FEEBEB';
            state.textStyle.color = '#EB4747';
            state.text = translate('drawerButtonParents');
            state.iconComponent = (
                <IconFontAwesome
                    name={ 'heart' }
                    style={ {fontSize:24, lineHeight:24, color:'#EB4747', marginBottom:13,} }
                />
            );
            state.containerStyle.paddingBottom = 15;
        }

        if (this.props.type === FancyButtonType.responsive) {
            state.containerStyle.backgroundColor = '#E4F8FF';
            state.textStyle.color = '#2BABEE';
            state.text = translate('drawerButtonResponsive');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'hand-holding-heart' }
                    style={ {fontSize:24, lineHeight:24, color:'#2BABEE', marginBottom:13,} }
                />
            );
            state.containerStyle.paddingBottom = 15;
        }

        if (this.props.type === FancyButtonType.faq) {
            // state.containerStyle.backgroundColor = '#E4F8FF';
            // state.textStyle.color = '#2BABEE';
            state.text = translate('drawerButtonFaq');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'question' }
                    style={ {fontSize:24, lineHeight:24, color:'#AA40BF', marginBottom:13,} }
                />
            );
            state.containerStyle.paddingBottom = 15;
        }

        if (this.props.type === FancyButtonType.settings) {
            state.text = translate('drawerButtonSettings');
            state.iconComponent = (
                <IconFontAwesome5
                    name={ 'cog' }
                    style={ {fontSize:24, lineHeight:24, color:'#AA40BF', marginBottom:0, marginRight:13} }
                />
            );
        }

        if (state.iconComponent) {
            state.containerStyle.paddingTop = 15;
        }

        this.state = state;
    }

    private onPress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    public render() {
        return (
            <RectButton
                style={ [styles.container, this.state.containerStyle, this.props.style] }
                onPress={ () => {this.onPress()} }
            >
                <View style={{flexDirection:(this.state.iconPosition === FancyButtonIconPosition.top ? 'column' : 'row'), justifyContent: 'center',alignItems: 'center',}}>
                    {this.state.iconComponent}
                    <Text style={ [{textAlign:'center'}, this.state.textStyle, this.props.textStyle] }>{ this.props.title ? this.props.title : this.state.text }</Text>
                </View>
            </RectButton>
        );
    }
}

export interface FancyButtonStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<FancyButtonStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:7, marginBottom:8,
        paddingTop:18, paddingBottom:18, paddingLeft:10, paddingRight:10,
        
        overflow: 'visible',
        borderRadius: 5,
        elevation: 3,
        shadowOffset: {width:2, height:2},
        shadowOpacity: 0.2,
    },
});
