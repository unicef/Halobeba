import React, { Component } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { Tag, TagColor } from '../Tag';
import { translate } from '../../translations/translate';
import { scale, moderateScale } from 'react-native-size-matters';

interface Props{
    addNewMeasures: Function
}

export class NoMeasurements extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.tagContainer}>
                    <Tag color={TagColor.orange}>
                        {translate('noMeasurementsTagWarrning')}
                    </Tag>
                </View>
                <View style={styles.textContainer}>
                    <Typography type={TypographyType.bodyRegular}>
                        {translate('noMeasurementsDescription')}
                    </Typography>
                </View>
                <RoundedButton
                    type={RoundedButtonType.purple}
                    showArrow={true}
                    onPress={() => this.props.addNewMeasures()}
                    text={translate('noMeasurementsDescriptionAddMeasureBtn')} 
                />
            </View>
        )
    }
}


export interface NoMeasurementsStyles {
    [index: string]: ViewStyle,
    container: ViewStyle,
    tagContainer: ViewStyle,
    textContainer: ViewStyle,
}

const styles = StyleSheet.create<NoMeasurementsStyles>({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
    textContainer: {
        marginBottom: scale(30)
    },
    tagContainer: {
        marginTop: scale(8),
        marginBottom: moderateScale(16),
        width: moderateScale(200),
        height: scale(30),
    }
})