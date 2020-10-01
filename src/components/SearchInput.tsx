import React from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet, TextStyle, TextInput, NativeSyntheticEvent, TextInputChangeEventData, Platform } from 'react-native';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BorderlessButton } from "react-native-gesture-handler";
import { utils } from '../app';

export interface Props {
    value?: string;
    placeholder?: string;
    size?: SearchInputSize;
    alwaysShowClear?: boolean;
    style?: StyleProp<ViewStyle>;
    onChange?: (value: string) => void;
    onClearPress?: () => void;
    onSubmitEditing?: (value: string) => void;
}

export interface State {
    value: string;
    containerStyle: ViewStyle;
}

export enum SearchInputSize {
    normal,
    small,
}

export class SearchInput extends React.Component<Props, State> {
    static defaultProps: Props = {
        placeholder: '',
        size: SearchInputSize.normal,
        alwaysShowClear: false,
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            value: this.props.value ? this.props.value : '',
            containerStyle: {
                paddingLeft: scale(15),
                paddingRight: scale(15),
                borderRadius: scale(100),
            },
        };

        // size: normal
        if (this.props.size === SearchInputSize.normal) {
            state.containerStyle.height = scale(55);
        }

        // size: small
        if (this.props.size === SearchInputSize.small) {
            state.containerStyle.height = scale(30);
        }

        this.state = state;
    }

    private onTextChange(event: NativeSyntheticEvent<TextInputChangeEventData>) {
        const value = event.nativeEvent.text;

        this.setState({ value });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    private onClearButtonPress() {
        this.setState({ value: '' }, () => {
            if (this.props.onClearPress) {
                this.props.onClearPress();
            }
        });
    }

    private onSubmitEditing() {
        if (this.props.onSubmitEditing) {
            this.props.onSubmitEditing(this.state.value);
            utils.logAnalitic("logSearch", { eventName: "logSearch", query: this.state.value })
        }
    }

    public render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <View style={[styles.container, this.state.containerStyle, this.props.style]}>
                        {/* SEARCH ICON */}
                        <Icon
                            name={"magnify"}
                            style={[styles.searchIconStyle, this.props.size === SearchInputSize.small ? { fontSize: scale(20) } : {}]}
                        />

                        {/* TEXT INPUT */}
                        <TextInput
                            value={this.state.value}
                            placeholder={this.props.placeholder}
                            onChange={(event) => { this.onTextChange(event) }}
                            style={styles.textInputStyle}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus={true}
                            placeholderTextColor="#848588"
                            onSubmitEditing={() => { this.onSubmitEditing() }}
                        />

                        {/* CLEAR ICON */}
                        {this.state.value || this.props.alwaysShowClear ? (
                            <BorderlessButton onPress={() => { this.onClearButtonPress() }}>
                                <Icon
                                    name={"close"}
                                    style={styles.clearIconStyle}
                                />
                            </BorderlessButton>
                        ) : null}
                    </View>
                )}
            </ThemeConsumer>
        );
    }
}

export interface SearchInputStyles {
    container?: ViewStyle;
    searchIconStyle?: TextStyle;
    clearIconStyle?: TextStyle;
    textInputStyle?: TextStyle;
}

const styles = StyleSheet.create<SearchInputStyles>({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#E1E4E8',
        minWidth: scale(120),
    },

    searchIconStyle: {
        fontSize: scale(26),
        color: '#8E8F90',
        marginTop: Platform.OS === 'ios' ? scale(5) : 0, marginBottom: 0, marginLeft: 0, marginRight: scale(16),
    },

    clearIconStyle: {
        fontSize: scale(20),
        color: '#8E8F90',
        marginTop: 0, marginBottom: 0, marginLeft: scale(5), marginRight: 0,
    },

    textInputStyle: {
        padding: 0,
        flex: 1,
        fontSize: moderateScale(16),
        alignSelf: 'stretch',
    }
});
