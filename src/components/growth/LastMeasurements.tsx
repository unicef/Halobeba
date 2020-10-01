import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { translate } from '../../translations/translate';
import { scale, moderateScale } from 'react-native-size-matters';
import { toHumanSize } from 'i18n-js';


export interface Props {
    measureDate: string,
    measureMass: string,
    measureLength: string,
    onPress: Function,
}

export class LastMeasurements extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <View>
               
                    <Typography type={TypographyType.headingSecondary}>
                        {translate('lastMeasurementTitle')}
                    </Typography>
                    <Typography type={TypographyType.bodyRegular} style={styles.measureDateText}>
                        {this.props.measureDate}
                    </Typography>
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
                <RoundedButton
                    style={styles.button}
                    type={RoundedButtonType.purple}
                    showArrow={true}
                    onPress={() => this.props.onPress()}
                    text={translate('lastMeasureAddMeasurementBtn')}
                />
            </View>
        )
    }
}


export interface LastMeasurementsStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    measureDateContainer: ViewStyle,
    measureContainer: ViewStyle,
    measureDateContainerText: TextStyle,
    measureDateText: TextStyle,
    button: ViewStyle,
}

const styles = StyleSheet.create<LastMeasurementsStyles>({
    container: {
        width: '100%',
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
        marginBottom: scale(32),
    },
    measureDateContainer: {
        width: scale(88),
        marginRight: scale(42)
    },
    measureDateContainerText: {
        opacity: 0.5,
    },
    button: {
        marginBottom: scale(8),
    },
    measureDateText: {
        marginTop: moderateScale(-7),
        fontWeight: "bold",
    }
})