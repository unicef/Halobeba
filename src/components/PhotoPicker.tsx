import React from 'react';
import { Dimensions, View, StyleProp, ViewStyle, StyleSheet, TouchableWithoutFeedback, ImageBackground, TextStyle, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker, { Image as ImageObject } from 'react-native-image-crop-picker';
import { DocumentDirectoryPath, copyFile, exists, unlink, mkdir } from "react-native-fs";
import { UnknownError } from '../app/errors';

const CROPPED_IMAGE_WIDTH = 800;
const CROPPED_IMAGE_HEIGHT = 800;

export interface Props {
    /**
     * File path or URL.
     */
    imageUri?: string;
    style?: StyleProp<ViewStyle>;
    onChange?: (image:ImageObject)=>void
}

export interface State {
    imageUri?: string;
    windowWidth: number;
    windowHeight: number;
}

export class PhotoPicker extends React.Component<Props, State> {
    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            windowWidth: Dimensions.get('screen').width,
            windowHeight: Dimensions.get('screen').height,
        };

        // Set imageUri only if that file exists
        if (this.props.imageUri) {
            exists(this.props.imageUri).then((fileExists) => {
                if (fileExists) {
                    this.setState({
                        imageUri: this.props.imageUri,
                    });
                }
            });
        }

        this.state = state;
    }

    private onPhotoPress() {
        // API: https://bit.ly/2AdeTLf
        ImagePicker.openPicker({
            includeBase64: false,
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,

            cropping: true,
            width: CROPPED_IMAGE_WIDTH, // Width of result image when used with cropping option
            height: CROPPED_IMAGE_HEIGHT,
            freeStyleCropEnabled: true,
            showCropGuidelines: true,
        }).then((image:ImageObject | ImageObject[]) => {
            if (!Array.isArray(image)) {
                this.setState({
                    imageUri: image.path
                }, () => {
                    if (this.props.onChange && image.path) {
                        this.props.onChange(image);
                    }
                });
            }
        }).catch((error) => {
            if (error.message != 'User cancelled image selection') {
                throw( new UnknownError(error) );
            }
        });
    }

    public render() {
        const cameraIcon = (color:string = '#AA40BF') => {
            let iconStyle: ViewStyle = {};
            let iconContainerStyle: ViewStyle = {};

            if (this.state.imageUri) {
                iconStyle.shadowOpacity = 0.5;
                iconStyle.shadowOffset = {width:2, height:2};
                iconStyle.elevation = 2;

                iconContainerStyle.position = 'absolute';
                iconContainerStyle.right = 15;
                iconContainerStyle.bottom = 15;

                iconContainerStyle.shadowOpacity = 0.5;
                iconContainerStyle.shadowOffset = {width:2, height:2};
                iconContainerStyle.elevation = 2;
            }

            return (
                <View style={[{width:55, height:55, borderWidth:2, borderColor:color, borderRadius:5, justifyContent:'center', alignItems:'center'}, iconContainerStyle]}>
                    <Icon
                        name='camera'
                        style={[{ fontSize:20, color:color }, iconStyle]}
                    />
                </View>
            )
        };

        return (
            <TouchableWithoutFeedback onPress={ () => {this.onPhotoPress()} }>
                <View style={ [styles.container, this.props.style] }>
                    {/* NO PHOTO */}
                    {!this.state.imageUri ? (
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Icon
                                name='baby'
                                style={{ position:'absolute', fontSize:(this.state.windowWidth*0.6), color:'#EBEBEB', paddingTop:5 }}
                            />
                            { cameraIcon() }
                        </View>
                    ) : null}

                    {/* SHOW PHOTO */}
                    {this.state.imageUri ? (
                        <View style={{flex:1}}>
                            <ImageBackground
                                source={ {uri: this.state.imageUri} }
                                style={{ width:'100%', height:'100%' }}
                                resizeMode="cover"
                            >
                                { cameraIcon('white') }
                            </ImageBackground>
                        </View>
                    ) : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export interface PhotoPickerStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<PhotoPickerStyles>({
    container: {
        width: '100%',
        aspectRatio: 1.3,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#D8D8D8'
    },
});
