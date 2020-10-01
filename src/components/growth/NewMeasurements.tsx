import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { translate } from '../../translations/translate';
import Icon from "react-native-vector-icons/AntDesign";
import { scale, moderateScale } from 'react-native-size-matters';
import { IconProps } from 'react-native-paper/lib/typescript/src/components/MaterialCommunityIcon';

interface Props{
    onPress: () => void
}

export class NewMeasurements extends Component<Props> {

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <Icon
                        name={"pluscircleo"} // Can't find same icon in font-awesome 
                        style={styles.iconStyle}
                    />
                    <View style={{ flexDirection: "column" }}>
                        <Typography type={TypographyType.headingSecondary}>
                            {translate('newMeasureTitle')}
                        </Typography>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <RoundedButton
                        type={RoundedButtonType.purple}
                        text={translate('newMeasureAddMeasurementBtn')}
                        showArrow={true}
                        onPress={this.props.onPress}
                    />
                </View>
            </View>
        )
    }
}


export interface NewMeasurementsStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    iconStyle: IconProps,
    buttonContainer: ViewStyle,
}

const styles = StyleSheet.create<NewMeasurementsStyles>({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
    buttonContainer: {
        marginTop: scale(24),
    },
    iconStyle: {
        marginRight: scale(15),
        marginTop: scale(3),
        fontSize: moderateScale(21),
        color: "#AA40BF",
        lineHeight: moderateScale(21),
    }
})