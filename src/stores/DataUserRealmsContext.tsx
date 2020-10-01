import React from 'react';
import { debounce } from 'lodash';
import { DataRealmConsumer, DataRealmContextValue } from './DataRealmContext';
import { UserRealmConsumer, UserRealmContextValue } from './UserRealmContext';
import { Message, IconType } from '../components/HomeMessages';
import { RoundedButtonType } from '../components/RoundedButton';
import { homeMessages } from '../app';

const messages: Message[] = [
    {
        text: 'Hello world 01',
        subText: 'Some text',
        textStyle: { fontWeight: 'bold' },
        iconType: IconType.growth,
    },

    {
        text: 'Set data',
        iconType: IconType.doctor,
        button: {
            text: 'Click me',
            type: RoundedButtonType.purple,
            onPress: () => { }
        }
    },

    {
        text: 'Hello world 02',
        iconType: IconType.doctor,
    },

    {
        text: 'Hello world 03',
        iconType: IconType.heart,
    },

    {
        text: 'Hello world 04',
        iconType: IconType.checked,
    },

    {
        text: 'Hello world 05',
        iconType: IconType.celebrate,
    },

    {
        text: 'Hello world 06',
        iconType: IconType.syringe,
    },

    {
        text: 'Hello world 07',
        iconType: IconType.user,
    },
];

export interface DataUserRealmsContextValue {
    dataRealm: Realm | null;
    userRealm: Realm | null;
    homeMessages: Message[];
}

interface DataUserRealmsProviderState {
    homeMessages: Message[];
}

export const DataUserRealmsContext = React.createContext<DataUserRealmsContextValue>({} as DataUserRealmsContextValue);

export class DataUserRealmsProvider extends React.PureComponent<object, DataUserRealmsProviderState> {
    public state: Readonly<DataUserRealmsProviderState> = {
        homeMessages: [],
    };

    constructor(props: object) {
        super(props);
        this.loadHomeMessages = this.loadHomeMessages.bind(this);
        this.getContextValue = this.getContextValue.bind(this);
    }

    private getContextValue(dataRealm: Realm | null, userRealm: Realm | null): DataUserRealmsContextValue {
        this.loadHomeMessages();

        return {
            homeMessages: this.state.homeMessages,
            dataRealm,
            userRealm,
        };
    }

    private loadHomeMessages() {
        console.log('loadHomeMessagesWithDebounce');
        
        let messages: Message[] = [];
        
        try {
            // messages = homeMessages.getMessages();
        } catch(e) {
            console.log(e);
        }
        
        console.log(messages);

        // this.setState({
        //     homeMessages: messages
        // });
    }

    public render() {
        return (
            <DataRealmConsumer>
                {(dataRealmContext: DataRealmContextValue) => (
                    <UserRealmConsumer>
                        {(userRealmContext: UserRealmContextValue) => (
                            <DataUserRealmsContext.Provider value={this.getContextValue(dataRealmContext.realm, userRealmContext.realm)}>{this.props.children}</DataUserRealmsContext.Provider>
                        )}
                    </UserRealmConsumer>
                )}
            </DataRealmConsumer>
        );
    }
}

export const DataUserRealmsConsumer = DataUserRealmsContext.Consumer;