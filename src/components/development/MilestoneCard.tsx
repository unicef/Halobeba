import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle, Dimensions } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { scale, moderateScale } from 'react-native-size-matters';
import { ContentEntity } from '../../stores';
import { TextButton } from '..';
import { TextButtonColor } from '../TextButton';
import Icon from "react-native-vector-icons/FontAwesome";

// @ts-ignore
import HTML from 'react-native-render-html';

export interface Props {
    title?: string
    subTitle?: string
    html?: string
    roundedButton?: { title: string, onPress: Function, roundedButtonType?: RoundedButtonType, } | null
    textButton?: { title: string, onPress: Function, }
    articles?: ContentEntity[],
    completed?: boolean,
    isCurrentPeriod: boolean,
}


export class MilestoneCard extends Component<Props> {
    
    private renderIcon = (complete: boolean) => {
        if (complete) {
            return "check-circle"
        } else {
            return "exclamation-circle"
        }
    }

    private iconColor = () => {
        if(this.props.completed){
            return "#2CBA39"
        }else{
            if(this.props.isCurrentPeriod){
                return "#2BABEE"
            }else{
                return "#EB4747"
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    {
                        this.props.completed !== undefined ?
                        <Icon
                            name={this.renderIcon(this.props.completed)}
                            style={[styles.iconStyle, { color: this.iconColor()}]}
                        /> : null
                    }
                   
                    <View>
                    {this.props.title && (<Typography type={TypographyType.headingPrimary} style={styles.headerStyle}>{this.props.title}</Typography>)}
                    {this.props.subTitle && (<Typography type={TypographyType.headingSecondary} style={styles.subHeaderStyle}>{this.props.subTitle}</Typography>)}
                    </View>
                </View>
                {this.props.html && (
                    <View style={styles.contentStyle}>
                        <HTML
                            html={this.props.html}
                            baseFontStyle={{ fontSize: scale(17) }}
                            tagsStyles={htmlStyles}
                            imagesMaxWidth={Dimensions.get('window').width}
                            staticContentMaxWidth={Dimensions.get('window').width}
                        />
                    </View>
                )}
                {
                    this.props.roundedButton && (
                        <RoundedButton
                            text={this.props.roundedButton.title}
                            type={this.props.roundedButton.roundedButtonType}
                            showArrow={true}
                            style={styles.buttonStyle}
                            onPress={this.props.roundedButton.onPress}
                        />
                    )
                }
                {
                    this.props.textButton && (
                        <TextButton
                            color={TextButtonColor.purple}
                            style={styles.textButtonStyle}
                            onPress={this.props.textButton.onPress}
                        >
                            {this.props.textButton.title}
                        </TextButton>
                    )
                }
                {
                    this.props.articles ? 
                     this.props.articles.map(item => (
                        <TextButton
                            color={TextButtonColor.purple}
                            style={styles.articleLinkStyle}
                        >
                            {item.title}
                        </TextButton>
                    )) : null 
                }
            </View>
        )
    }
}


export interface MilestoneCardStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    headerStyle: TextStyle,
    buttonStyle: ViewStyle,
    textButtonStyle: ViewStyle,
    contentStyle: ViewStyle,
    articleLinkStyle: ViewStyle,
}

const styles = StyleSheet.create<MilestoneCardStyles>({
    container: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
    headerStyle: {
        marginBottom: 0,
        fontSize: moderateScale(22),
        lineHeight: moderateScale(31),
        paddingRight: 20
    },
    subHeaderStyle: {
        fontSize: moderateScale(17)
    },
    contentStyle: {
        marginTop: scale(10)
    },
    buttonStyle: {
        marginTop: scale(10),
        marginBottom: scale(20)
    },
    textButtonStyle: {
        justifyContent: "center",
        marginBottom: scale(20)
    },
    iconStyle: {
        marginRight: scale(10),
        marginTop: scale(3),
        fontSize: moderateScale(26),
        color: "#2CBA39",
    },
    articleLinkStyle: {
        marginTop: scale(10)
    }
})


const htmlStyles = {
    p: { marginBottom: 15 },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};
