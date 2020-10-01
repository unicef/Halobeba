import React, { Component, Fragment } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle, ImageStyle, Text } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { translate } from '../../translations/translate';
import { scale, moderateScale } from 'react-native-size-matters';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { TextButton, RoundedButton } from '..';
import { RoundedButtonType } from '../RoundedButton';
import { TextButtonColor } from '../TextButton';

export interface Props {
    ordering?: number;
    title: string;
    subTitle?: string;
    titleIcon?: DoctorVisitTitleIconType;
    showVerticalLine?: boolean;
    items: DoctorVisitCardItem[];
    buttons?: DoctorVisitCardButton[];
}

export interface State {
    
}

export class DoctorVisitCard extends Component<Props, State> {
    static defaultProps: Props = {
        ordering: 0,
        title: '',
        items: [],
        buttons: [],
        showVerticalLine: true,
    };

    constructor(props: Props) {
        super(props);
    }

    private getTitleIcon(iconType: DoctorVisitTitleIconType | undefined): JSX.Element | null {
        let rval: JSX.Element | null = null;

        if (iconType === undefined) return null;

        // Checked icon
        if (this.props.titleIcon === DoctorVisitTitleIconType.Checked) {
            rval = (
                <Icon
                    name={"check-circle"}
                    style={[styles.titleIcon, { color: '#2CBB39' }]}
                />
            );
        }

        // Add icon
        if (this.props.titleIcon === DoctorVisitTitleIconType.Add) {
            rval = (
                <Icon
                    name={"plus-circle-outline"}
                    style={[styles.titleIcon, { color: '#AA40BF' }]}
                />
            );
        }

        // Info icon
        if (this.props.titleIcon === DoctorVisitTitleIconType.Info) {
            rval = (
                <Icon
                    name={"information"}
                    style={[styles.titleIcon, { color: '#2BABEF' }]}
                />
            );
        }

        return rval;
    }

    render() {
        return (
            <View>
                {/* CARD */}
                <View style={styles.card}>
                    {/* TITLE & SUBTITLE */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: scale(15) }}>
                        {/* Title icon */}
                        {this.getTitleIcon(this.props.titleIcon)}

                        <View style={{ flex: 1 }}>
                            {/* Title */}
                            <Typography
                                style={styles.title}
                                type={TypographyType.headingSecondary}
                            >
                                {this.props.title}
                            </Typography>

                            {/* Subtitle */}
                            <Typography type={TypographyType.bodyRegular} style={{ fontWeight: 'bold' }}>
                                {this.props.subTitle}
                            </Typography>
                        </View>
                    </View>

                    {/* ITEMS */}
                    {this.props.items.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', marginBottom: (index !== this.props.items.length - 1 ? scale(12) : 0) }}>
                            <FontAwesome5Icon
                                name={item.icon}
                                style={styles.itemIcon}
                            />

                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1 }}>
                                {item.text}
                            </Typography>
                        </View>
                    ))}

                    {/* BUTTONS */}
                    {this.props.buttons?.map((button, index) => (
                        <Fragment>
                            {/* Text button */}
                            {button.type === DoctorVisitCardButtonType.Text ? (
                                <TextButton
                                    color={TextButtonColor.purple}
                                    textStyle={{ flex: 1, textAlign: 'center' }}
                                    style={{ paddingVertical: styles.button.marginBottom }}
                                    onPress={button.onPress}
                                >
                                    {button.text}
                                </TextButton>
                            ) : null}

                            {/* Purple button */}
                            {button.type === DoctorVisitCardButtonType.Purple ? (
                                <RoundedButton
                                    type={RoundedButtonType.purple}
                                    text={button.text}
                                    style={styles.button}
                                    onPress={button.onPress}
                                />
                            ) : null}

                            {/* Hollow purple button */}
                            {button.type === DoctorVisitCardButtonType.HollowPurple ? (
                                <RoundedButton
                                    type={RoundedButtonType.hollowPurple}
                                    text={button.text}
                                    style={styles.button}
                                    onPress={button.onPress}
                                />
                            ) : null}
                        </Fragment>
                    ))}

                    {this.props.buttons && this.props.buttons?.length === 0 ? (
                        <View style={{height:scale(18)}} />
                    ) : null}
                </View>

                {/* VERTICAL LINE */}
                {this.props.showVerticalLine ? (
                    <View style={styles.verticalLine} />
                ) : (
                        <View style={{ height: scale(30) }} />
                    )}
            </View>
        )
    }
}

export interface DoctorVisitCardStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    card: ViewStyle;
    title: TextStyle;
    titleIcon: TextStyle;
    itemIcon: TextStyle;
    button: ViewStyle;
    verticalLine: ViewStyle;
}

const styles = StyleSheet.create<DoctorVisitCardStyles>({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        paddingHorizontal: scale(16),
        paddingTop: scale(16),
    },

    title: {
        fontSize: scale(22),
        lineHeight: scale(25),
        marginBottom: scale(3),
    },

    titleIcon: {
        lineHeight: scale(25),
        paddingRight: scale(14),
        fontSize: scale(20),
    },

    itemIcon: {
        color: '#272727',
        paddingRight: scale(14),
        fontSize: scale(20),
        opacity: 0.7,
    },

    button: {
        marginBottom: scale(18),
    },

    verticalLine: {
        backgroundColor: '#939395',
        width: scale(3),
        height: scale(25),
        marginLeft: scale(20),
    },
});

export enum DoctorVisitTitleIconType {
    Checked,
    Info,
    Add,
}

export type DoctorVisitCardItem = {
    icon: DoctorVisitCardItemIcon;
    text: string;
}

export enum DoctorVisitCardItemIcon {
    Syringe = 'syringe',
    Weight = 'weight',
    Stethoscope = 'stethoscope',
}

export type DoctorVisitCardButton = {
    type: DoctorVisitCardButtonType;
    text: string;
    onPress: Function;
}

export enum DoctorVisitCardButtonType {
    Text,
    Purple,
    HollowPurple,
}