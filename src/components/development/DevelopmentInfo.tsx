import React, { Component, Children } from 'react'
import { scale } from 'react-native-size-matters';

// @ts-ignore
import HTML from 'react-native-render-html';
import { Dimensions, View } from 'react-native';

export interface Props {
    html: string
}

export class DevelopmentInfo extends Component<Props> {
    render() {
        return (
            <View style={{backgroundColor: '#F7F8FA', padding: 24, width: '100%'}}>
                <HTML
                    html={this.props.html}
                    baseFontStyle={{ fontSize: scale(17) }}
                    tagsStyles={htmlStyles}
                    imagesMaxWidth={Dimensions.get('window').width}
                    staticContentMaxWidth={Dimensions.get('window').width}
                />
            </View>
        )
    }
}


const htmlStyles = {
    p: { marginBottom: 3},
    li: {marginBottom: -15, marginLeft: 0},
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(3) },
};