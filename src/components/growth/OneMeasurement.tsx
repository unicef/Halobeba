import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { translate } from '../../translations/translate';
import Icon from "react-native-vector-icons/FontAwesome";
import { scale, moderateScale } from 'react-native-size-matters';
import { IconProps } from 'react-native-paper/lib/typescript/src/components/MaterialCommunityIcon';
import { Background } from 'victory-native';

export interface Props {
    measureDate: string,
    measureMass: string,
    measureLength: string,
    title: string,
    isVerticalLineVisible?: boolean
}

export class OneMeasurements extends Component<Props> {
    render() {
        return (
            <View>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon
                            name={"check-circle"}
                            style={styles.iconStyle}
                        />
                        <View style={{ flexDirection: "column" }}>
                            <Typography type={TypographyType.headingSecondary}>
                                {this.props.title}
                            </Typography>
                            <Typography type={TypographyType.bodyRegular} style={styles.measureDateText}>
                                {this.props.measureDate}
                            </Typography>
                        </View>

                    </View>
                    <View style={styles.measureContainer}>
                        <View style={styles.measureDateContainer}>
                            <Typography style={styles.measureDateContainerText}>
                                {translate('measurementMass')}
                            </Typography>
                            <Typography type={TypographyType.headingSecondary}>
                                {this.props.measureMass} kg
                        </Typography>
                        </View>
                        <View style={styles.measureDateContainer}>
                            <Typography style={styles.measureDateContainerText}>
                                {translate('measurementLength')}
                            </Typography>
                            <Typography type={TypographyType.headingSecondary}>
                                {this.props.measureLength} cm
                        </Typography>
                        </View>
                    </View>
                </View>
                {this.props.isVerticalLineVisible ? <View style={styles.verticalLine}/> : null} 
            </View>
        )
    }
}


export interface OneMeasurementsStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    measureDateContainer: ViewStyle,
    measureContainer: ViewStyle,
    measureDateContainerText: TextStyle,
    measureDateText: TextStyle,
    iconStyle: IconProps,
    verticalLine: ViewStyle
}

const styles = StyleSheet.create<OneMeasurementsStyles>({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
    measureContainer: {
        flexDirection: 'row',
        marginTop: scale(24),
        marginBottom: scale(16),
        marginLeft: scale(37),
    },
    measureDateContainer: {
        width: scale(88),
        marginRight: scale(42)
    },
    measureDateContainerText: {
        opacity: 0.5,
    },
    measureDateText: {
        marginTop: scale(-7),
        fontWeight: "bold",
    },
    iconStyle: {
        marginRight: scale(15),
        marginTop: scale(3),
        fontSize: moderateScale(21),
        color: "#2CBA39",
        lineHeight: moderateScale(21),
    },
    verticalLine:{
        width: 3,
        height: moderateScale(24),
        backgroundColor: '#979797',
        borderWidth: 1.5,
        borderColor: '#979797',
        marginLeft: moderateScale(24)
    }
})