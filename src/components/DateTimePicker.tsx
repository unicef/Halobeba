import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet , Text, TextStyle, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateTime } from 'luxon';

export interface Props {
    label?: string;
    type?: DateTimePickerType,
    value?: Date;
    /**
     * Search for icons [here](https://materialdesignicons.com).
     */
    icon?: string;
    style?: StyleProp<ViewStyle>;
    maximumDate?: Date;
    minimumDate?: Date;
    onChange?: (value:Date)=>void;
}

export interface State {
    value?: Date,
    valueString?: string;
    icon?: string;
    isDateTimePickerVisible: boolean;
}

export enum DateTimePickerType {
    date = 'date',
    time = 'time',
}

export class DateTimePicker extends React.Component<Props, State> {
    static defaultProps: Props = {
        type: DateTimePickerType.date,
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        var state: State = {
            isDateTimePickerVisible: false,
        };

        // value, valueString
        if (this.props.value) {
            state.value = this.props.value;
            state.valueString = this.getValueString(this.props.value);
        }

        // icon
        if (this.props.type === DateTimePickerType.date) {
            state.icon = 'calendar-month-outline';
        }
        if (this.props.type === DateTimePickerType.time) {
            state.icon = 'clock-outline';
        }

        this.state = state;
    }

    private getValueString(value:Date): string {
        let valueString: string = '';
        
        if (this.props.type === DateTimePickerType.date) {
            valueString = value.toLocaleDateString('en-US', {day:'2-digit', month:'2-digit', year:'numeric'})
        }

        if (this.props.type === DateTimePickerType.time) {
            valueString = value.toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit'})
        }

        return valueString;
    }

    private showDatePicker() {
        this.setState({
            isDateTimePickerVisible: true
        });
    }

    private onDateTimePickerConfirm(date:Date) {
        this.setState({
            value: date,
            valueString: this.getValueString(date),
            isDateTimePickerVisible: false
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(date);
            }
        });
    }

    private onDateTimePickerCancel() {
        this.setState({
            isDateTimePickerVisible: false
        });
    }

    public render() {

        return (
            <TouchableWithoutFeedback onPress={() => {this.showDatePicker()}}>
                <View style={[styles.container, this.props.style]}>
                    {this.state.icon ? (
                        <Icon
                            name={ this.props.icon ? this.props.icon : this.state.icon }
                            style={ styles.icon }
                        />
                    ) : null}

                    <View style={ styles.contentContainer }>
                        {this.props.label ? (
                            <Text style={ [styles.labelText, this.state.valueString ? styles.labelTextWithValue : {}] }>{this.props.label}</Text>
                        ) : null}

                        {this.state.valueString ? (
                            <Text style={ styles.valueText }>{this.state.valueString}</Text>
                        ) : null}
                    </View>

                    <DateTimePickerModal
                        isVisible={this.state.isDateTimePickerVisible}
                        date={this.state.value}
                        mode={ this.props.type }
                        removeClippedSubviews={true}
                        is24Hour={ true }
                        onConfirm={(date) => {this.onDateTimePickerConfirm(date)}}
                        onCancel={() => {this.onDateTimePickerCancel()}}
                        maximumDate={this.props.maximumDate}
                        minimumDate={this.props.minimumDate}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export interface RoundedTextInputStyles {
    container?: ViewStyle;
    contentContainer?: ViewStyle;
    icon?: TextStyle;
    labelText?: TextStyle;
    labelTextWithValue?: TextStyle;
    valueText?: TextStyle;
}

const styles = StyleSheet.create<RoundedTextInputStyles>({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        height: 60,
        borderRadius: 24,
        paddingLeft: 16,
    },

    contentContainer: {
        marginLeft: 10,
    },

    icon: {
        fontSize:20,
        lineHeight: 20,
        color:'#464646',
    },

    labelText: {
        fontSize: 17,
        lineHeight: 17,
        fontFamily: 'SFUIDisplay-Regular',
        color: '#8C8C8C',
    },

    labelTextWithValue: {
        fontSize: 15,
    },

    valueText: {
        fontSize: 17,
        lineHeight: 20,
    },
});
