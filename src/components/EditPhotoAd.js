import React  from 'react';
import {
    StyleSheet,
    ScrollView,
    I18nManager,
    Platform,
    TouchableOpacity,
    ImageEditor,
    Image,
    ImageStore,
    Dimensions,
    KeyboardAvoidingView, I18nManager as RNI18nManager,
    Picker, ActivityIndicator,
} from 'react-native';
import {
    Container,
    Icon,
    Content,
    ActionSheet,
    Button,
    Title,
    Text,
    View,
    Item,
    Toast
}
    from 'native-base';
import axios       from "axios";
import {Bubbles}   from "react-native-loader";
import {connect}   from "react-redux";
import MapView from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import { ImagePicker} from 'expo';
import I18n from "ex-react-native-i18n";
import {ImageBrowser,CameraBrowser} from 'expo-multiple-imagepicker';

let    base64   = [];
import marker from '../../assets/marker.png'
import {NavigationEvents} from "react-navigation";

import CONST from '../consts';

let BUTTONS = [
    { text: I18n.translate('gallery_photo') ,i : 0 },
    { text: I18n.translate('camera_photo'),i : 1},
    { text: I18n.translate('cancel'),   color: "#ff5b49" }
];
let DESTRUCTIVE_INDEX = 3;
let CANCEL_INDEX = 3;


class EditPhotoAd extends React.Component {


    constructor(props) {

        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
            lang             : this.props.lang,
            blog             : '',
            city_id          : null,
            user_id          : this.props.auth.data.id,

            country_id       : null,
            sub_category_id       : null,
            category_id       : null,
            imageBrowserOpen : false,
            isLoaded         : false,
            cameraBrowserOpen: false,
            spinner: true,
            photos           : [],
            countries        : [],
            categories        : [],
            sub_categories        : [],
            codes            : [],
            images           : [],
            base64           : [],
            cities           : [],
            region           : {
                latitudeDelta    : 0.0922,
                longitudeDelta   : 0.0421,
                latitude         : null,
                longitude        : null
            }
        };

    }

    async componentWillMount() {
        axios.post(`${CONST.url}countries`, { lang: this.state.lang  })
            .then( (response)=> {
                this.setState({countries: response.data.data});
                axios.post(`${CONST.url}cities`, { lang:this.state.lang , country_id: this.state.countries[0].id })
                    .then( (response)=> {
                        this.setState({cities: response.data.data});
                        axios.post(`${CONST.url}codes`, { lang: this.state.lang  })
                            .then( (response)=> {
                                this.setState({codes: response.data.data});
                                this.setState({key: response.data.data[0]});




                                axios.post(`${CONST.url}BlogDetails`, { lang: this.state.lang , id : this.props.navigation.state.params.id })
                                    .then( (response)=> {


                                        console.log('blog    ..  ', response.data.data)
                                        this.setState({blog      : response.data.data});
                                        this.setState({country_id: response.data.data.country_id});
                                        this.setState({city_id   : response.data.data.city_id});
                                        this.setState({title     : response.data.data.title});
                                        this.setState({price     : response.data.data.price});
                                        this.setState({description: response.data.data.description});
                                        this.setState({mobile: response.data.data.mobile});
                                        this.setState({category_id: response.data.data.category_id});
                                        this.setState({sub_category_id: response.data.data.sub_category_id});
                                        this.setState({is_chat: response.data.data.is_chat});
                                        this.setState({is_phone: response.data.data.is_phone});
                                        this.setState({is_refresh: response.data.data.is_refresh});
                                       // this.setState({images: response.data.data.images});
                                        this.setState({
                                            region: {
                                                latitude:  response.data.data.latitude,
                                                longitude: response.data.data.longitude,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421,
                                            }
                                        });


                                        axios.post(`${CONST.url}categories`, { lang: this.state.lang  })
                                            .then( (response)=> {
                                                this.setState({categories : response.data.data})

                                                axios.post(`${CONST.url}sub_categories`, { lang: this.state.lang  ,id : this.state.category_id })
                                                    .then( (response)=> {

                                                        this.setState({sub_categories : response.data.data})

                                                    }).catch( (error)=> {
                                                    this.setState({spinner: false});
                                                });


                                            }).catch( (error)=> {
                                            this.setState({spinner: false});
                                        }).then(()=>{
                                            this.setState({spinner: false});
                                        });


                                    })
                                    .catch( (error)=> {
                                        this.setState({spinner: false});
                                    })

                            })
                            .catch( (error)=> {
                                this.setState({spinner: false});
                            })
                    })

                    .catch( (error)=> {
                        this.setState({spinner: false});
                    })
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            })
    }

    onFocus() {
        this.componentWillMount()
    }

    renderMap() {
        if(this.state.region.latitude !== null)
        {
            return (
                <View style={styles.map}>
                    <MapView
                        style={styles.map}
                        showsBuildings={true}
                        minZoomLevel={7}

                        initialRegion={this.state.region}
                        onRegionChangeComplete={this.onRegionChange}

                    />
                    <View style={styles.markerFixed}>
                        <Image style={styles.marker} source={marker} />
                    </View>

                </View>
            )
        }
    }

    onRegionChange = region => {
        this.setState({
            region
        })
    };

    onValueChange(value) {

        this.setState({country_id: value});

        setTimeout(()=>{

            this.setState({spinner: true});
            axios.post(`${CONST.url}cities`, { lang:this.state.lang , country_id: this.state.country_id })
                .then( (response)=> {

                    this.setState({cities: response.data.data});
                    this.setState({city_id: response.data.data[0].id});
                })

                .catch( (error)=> {
                    this.setState({spinner: false});
                }).then(()=>{
                this.setState({spinner: false});
            });

        },1000);
    }

    open() {
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                title: I18n.translate('image_video')
            },
            buttonIndex => {
                this.images_video(BUTTONS[buttonIndex])

            }
        )
    }

    async  images_video(i) {
        if(i.i === 0) {
            this.setState({imageBrowserOpen: true});
        }else if(i.i === 1)
        {
            this.setState({cameraBrowserOpen: true});

        }else if(i.i === 2)
        {

            let result = await ImagePicker.launchImageLibraryAsync({
                aspect: [4, 3],
                base64: true,
                mediaTypes:'Videos',

            });
            if (!result.cancelled) {
                this.setState({
                    video: result.uri,
                    image: result.uri,
                    type: result.type,
                });
            }
        }
    }

    validate = () => {
        let isError = false;
        let msg = '';


        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }
        return isError;
    };

    onLoginPressed() {
        const err = this.validate();
        if (!err){

            this.setState({ isLoaded: true });

            axios.post(`${CONST.url}editPhotoAd`,

                {
                    id              : this.props.navigation.state.params.id,
                    country_id      : this.state.country_id,
                    latitude        : this.state.region.latitude,
                    longitude       : this.state.region.longitude,
                    user_id         : this.state.user_id,
                    city_id         : this.state.city_id,
                    category_id     : this.state.category_id,
                    sub_category_id : this.state.sub_category_id,
                    files           : base64[0]
                }

            )
                .then( (response)=> {
                    if(response.data.value === '1' )
                    {
                        Toast.show({ text:response.data.msg, duration : 2000  ,type :"success", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                        this.props.navigation.navigate('MyAds');
                    }else {
                        Toast.show({ text:response.data.msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                    }
                })

                .catch( (error)=> {
                    console.log(error);
                    this.setState({isLoaded: false});
                }).then(()=>{
                this.setState({isLoaded: false});
            });


        }
    }

    renderSubmit() {

        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center', marginVertical: 30}}>
                    <Bubbles  size={10} color="#2977B3"/>
                </View>
            )
        }


        return (

            <Button  onPress={() => this.onLoginPressed()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </Button>

        );
    }

    onValueChangeCity(value) {
        this.setState({
            city_id: value
        });
    }

    onValueChange_category(value) {
        this.setState({category_id : value});
        setTimeout(()=>{
            axios.post(`${CONST.url}sub_categories`, { lang: this.state.lang  ,id : this.state.category_id })
                .then( (response)=> {

                    this.setState({sub_categories : response.data.data})

                }).catch( (error)=> {
                this.setState({spinner: false});
            });
        },1000);
    }

    onValueChange_sub(value) {
        this.setState({sub_category_id : value});

    }

    imageBrowserCallback = ( callback  ) => {

        callback.then((photos) => {

                this.setState({
                    cameraBrowserOpen: false,
                    imageBrowserOpen: false,
                    photos: this.state.photos.concat(photos)
                });

                const imgs = this.state.photos;


                for (let i =0; i < imgs.length; i++){

                    const imageURL = imgs[i].file;
                    Image.getSize(imageURL, (width, height) => {

                        let imageSize = {
                            size: {
                                width,
                                height
                            },
                            offset: {
                                x: 0,
                                y: 0,
                            },
                        };

                        ImageEditor.cropImage(imageURL, imageSize, (imageURI) => {
                            ImageStore.getBase64ForTag(imageURI, (base64Data) => {
                                base64.push(base64Data);
                            }, (reason) => console.log(reason) )
                        }, (reason) => console.log(reason) )
                    }, (reason) => console.log(reason))
                }

            }
        ).catch((e) => console.log(e))
    };

    delete_img(i) {
        this.state.photos.splice(i,1);
        base64.splice(i,1);
        this.setState({photos: this.state.photos})
    }

    renderImage(item, i) {
        return(
            <View key={i}>

                <Image
                    style={{height: 70, width: 70 , marginHorizontal: 10 , borderRadius: 25}}
                    source={{uri: item.file}}
                    key={i}
                />
                <TouchableOpacity onPress={()=> {this.delete_img(i)}} style={{position:'absolute' , right: 15 , top :0 , backgroundColor:'#F00' , borderRadius:65 , width: 35 }}>

                    <Icon name="close" style={{ color : 'white' , textAlign:'center', fontSize:32}} ></Icon>

                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {


        await Permissions.askAsync(Permissions.CAMERA);
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    };

    renderLoader(){
        if (this.state.spinner){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color="#444" />
                </View>
            );
        }
    }

    render() {
        const { width } = Dimensions.get('window');


        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser base64={true}  max={1}  callback={this.imageBrowserCallback}/>);
        }else if (this.state.cameraBrowserOpen) {

            return(<CameraBrowser base64={true}   max={1} callback={this.imageBrowserCallback}/>);
        }

        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />
                {this.renderLoader()}


                <View style={styles.header}>
                    <View>
                        <Title style={[ styles.text, { paddingHorizontal : 20 } ]}>{I18n.translate('editProduct')}</Title>
                    </View>
                    <View>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </View>
                </View>

                <Content>

                    <View style={styles.upload}>
                         <View >
                            <TouchableOpacity onPress={()=> this.open()}>
                                <View style={styles.blockUpload}>
                                    <Icon style={styles.iconUpload} active type="AntDesign" name='pluscircleo' />
                                    <Text style={styles.textes}>
                                        {I18n.translate('image_video')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <ScrollView showsHorizontalScrollIndicator={false}    horizontal={true} style={{marginHorizontal: 20}}>
                        {this.state.photos.map((item,i) => this.renderImage(item,i))}

                    </ScrollView>

                    <KeyboardAvoidingView behavior="padding" style={{  flex: 1}} >

                        <View style={styles.block_section}>

                            <Item style={styles.itemPiker_second} regular>

                                <Picker
                                    iosHeader={I18n.translate('categories')}
                                    headerBackButtonText={I18n.translate('goBack')}
                                    mode="dropdown"
                                    placeholderStyle={{ color: "#c5c5c5", writingDirection: 'rtl' }}
                                    placeholderIconColor="#444"
                                    style={{width: '100%',left :3,backgroundColor:'transparent'}}
                                    selectedValue={this.state.category_id}
                                    itemTextStyle={{ color: '#c5c5c5' }}
                                    onValueChange={this.onValueChange_category.bind(this)}>
                                    {this.state.categories.map((city, i) => {
                                        return <Picker.Item   style={{color: "#444",marginHorizontal: 20}}  key={i} value={city.id} label={city.name} />
                                    })}

                                </Picker>
                                <Icon style={{color: "#acabae", right: '90%',fontSize:18}} name='down' type="AntDesign"/>

                            </Item>


                            {
                                (this.state.category_id !== 17)

                                    ?
                                    <Item style={styles.itemPiker_second} regular>

                                        <Picker
                                            iosHeader={I18n.translate('sub_categories')}
                                            headerBackButtonText={I18n.translate('goBack')}
                                            mode="dropdown"
                                            placeholderStyle={{ color: "#c5c5c5", writingDirection: 'rtl' }}
                                            placeholderIconColor="#444"
                                            style={{width: '100%',left :3,backgroundColor:'transparent'}}
                                            selectedValue={this.state.sub_category_id}
                                            itemTextStyle={{ color: '#c5c5c5' }}
                                            onValueChange={this.onValueChange_sub.bind(this)}>
                                            {this.state.sub_categories.map((city, i) => {
                                                return <Picker.Item   style={{color: "#444",marginHorizontal: 20}}  key={i} value={city.id} label={city.name} />
                                            })}

                                        </Picker>
                                        <Icon style={{color: "#acabae", right: '90%',fontSize:18}} name='down' type="AntDesign"/>

                                    </Item>

                                    :
                                    <View/>
                            }


                            <Item style={styles.itemPiker_second} regular>

                                <Picker
                                    iosHeader={I18n.translate('choose_country')}
                                    headerBackButtonText={I18n.translate('goBack')}
                                    mode="dropdown"
                                    placeholderStyle={{ color: "#c5c5c5", writingDirection: 'rtl' }}
                                    placeholderIconColor="#444"
                                    style={{width: '100%',left :3,backgroundColor:'transparent'}}
                                    selectedValue={this.state.country_id}
                                    itemTextStyle={{ color: '#c5c5c5' }}
                                    onValueChange={this.onValueChange.bind(this)}>
                                    {this.state.countries.map((city, i) => {
                                        return <Picker.Item   style={{color: "#444",marginHorizontal: 20}}  key={i} value={city.id} label={city.name} />
                                    })}

                                </Picker>
                                <Icon style={{color: "#acabae", right: '90%',fontSize:18}} name='down' type="AntDesign"/>

                            </Item>


                            <Item style={styles.itemPiker_second} regular>
                                <Picker
                                    mode="dropdown"
                                    iosHeader={I18n.translate('myCity')}
                                    headerBackButtonText={I18n.translate('goBack')}
                                    style={{width: '100%',left :3,backgroundColor:'transparent'}}
                                    placeholderStyle={{ color: "#c5c5c5", writingDirection: 'rtl' }}
                                    selectedValue={this.state.city_id}
                                    onValueChange={this.onValueChangeCity.bind(this)}
                                    textStyle={{ color: "#acabae" }}
                                    // placeholder={I18n.translate('choose_city')}
                                    itemTextStyle={{ color: '#c5c5c5' }}>
                                    {this.state.cities.map((city, i) => {
                                        return <Picker.Item   style={{color: "#444" ,marginHorizontal: 20}}  key={i} value={city.id} label={city.name} />
                                    })}
                                </Picker>
                                <Icon style={{color: "#acabae", right: '90%',fontSize:18}} name='down' type="AntDesign"/>

                            </Item>

                        </View>

                        <Text style={[styles.text , styles.textsetting]}>{I18n.translate('configurations')}</Text>

                        { this.renderMap() }

                        { this.renderSubmit() }
                    </KeyboardAvoidingView>
                </Content>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header : {
        backgroundColor       : "transparent",
        justifyContent        : 'space-between',
        flexDirection         : 'row',
        paddingTop            : 25,
        paddingRight          : 10,
        paddingLeft           : 10,
        borderWidth           : 0,
        borderColor           : "#DDD",
        height                : 85,
        borderBottomWidth     : 1
    },
    text : {
        fontFamily            : 'CairoRegular',
        color                 : '#444',
        marginTop             : 7,
        fontSize              : 15,
        marginLeft            : 15
    },
    icons : {
        fontSize              : 20,
        color                 :  CONST.color
    },
    block_section : {
        margin                : 15,
        padding               : 5,
        borderRadius          : 5,
        backgroundColor       : '#fff',
        shadowColor           : '#444',
        shadowOffset          : { width: 0 , height : 0 },
        shadowOpacity         : 0.2,
        elevation             : 5,
        alignItems            : 'center',
    },
    move : {
        flexDirection           : 'row-reverse',
        justifyContent          : 'space-between',
        width                   : '100%'
    },
    block_up : {
        flexDirection           : 'row-reverse',
        margin                  : 5,
    },
    icon_up : {
        marginTop               : 3,
        marginRight             : 5,
        color                   : '#444',
        fontSize                : 20,
    },
    icon : {
        color                   : '#444',
        fontSize                : 20,
        alignItems              : 'center',
        justifyContent          : 'center',
        alignSelf               : 'center',
        lineHeight              : 40,
    },
    upload : {
        backgroundColor         : '#fafafa',
        padding                 : 10,
        margin                  : 10,
        borderRadius            : 5,
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center',
        alignSelf               : 'center',
        width                   : '90%'
    },
    textes : {
        fontFamily              : 'CairoRegular',
        fontSize                : 12,
        color                   : '#bbbb'
    },
    iconUpload : {
        color                   : '#bbbb'
    },
    blockUpload : {
        margin                  : 15,
        borderColor             : '#bbbb',
        borderStyle             : "dashed",
        borderWidth             : 1,
        borderRadius            : 5,
        padding                 : 10,
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center',
        alignSelf               : 'center',
    },
    form : {
        padding                 : 10
    },
    item : {
        padding                 : 0,
        borderColor             : '#DDD',
        width : '100%'
    },
    input : {
        textAlign               : 'right',
        color                   : '#444',
        borderColor             : '#DDD',
        fontFamily              : 'CairoRegular',
        fontSize                : 13
    },
    textarea : {
        textAlign               : 'right',
        color                   : '#444',
        borderColor             : '#DDD',
        fontFamily              : 'CairoRegular',
        fontSize                : 13,
        borderLeftColor         : '#ffffff',
        borderRightColor        : '#ffffff',
        borderBottomColor       : '#DDD',
        borderTopWidth : 0,
        borderWidth             : 0.5,
        width                   : '100%',
        padding                 : 0
    },
    blocksetting : {
        flexDirection           : 'row',
        justifyContent          : 'space-between',
        padding                 : 15,
        position                : 'relative',

    },
    listitem : {
        backgroundColor         : '#FFF',
        paddingTop              : 20,
        paddingBottom           : 20,
        width                   : 95,
        height                  : 140,
        position                : 'relative',
    },
    chickbox : {
        position                : 'absolute',
        top                     : -5,
        left                    : -7,
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center',
        alignSelf               : 'center',
    },
    textsetting : {
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center',
        alignSelf               : 'center',
    },
    iconsetting : {
        color                   : '#FFF',
        fontSize                : 22,
    },
    blockIcon : {
        width                   : 40,
        height                  : 40,
        lineHeight              : 40,
        borderRadius            : 100,
        backgroundColor         : '#DDD',
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center',
        alignSelf               : 'center',
        margin                  : 10
    },
    tesetting : {
        textAlign               : 'center',
        fontSize                : 13,
        fontFamily              : 'CairoRegular'
    },

    bgLiner:{
        borderRadius          : 5,
        width                 : 170,
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        margin                : 15,
        backgroundColor       :  CONST.color
    },
    textBtn : {
        textAlign             : 'center',
        color                 : '#fff',
        fontSize              : 16,
        padding               : 3,
        fontFamily            : 'CairoRegular',
    },
    itemPiker_second : {
        borderWidth           : 0,
        borderColor           : '#FFF',
        borderBottomColor     : "#DDD" ,
        width                 : '100%',
        position              : 'relative',
        padding               : 10,
        fontSize              : 14,
        justifyContent: 'center',
    },
    map : {
        width                 : '90%',
        height                : 150,
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        margin                : 5,
        borderRadius          : 10,
    },

    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 48,
        width: 48
    },
    flexCenter : {
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
    },
    loading : {
        position                : 'absolute',
        top                     : 0,
        right                   : 0,
        width                   : '100%',
        height                  : '100%',
        zIndex                  :  99999,
        backgroundColor         : "#fff",
    },
});

const mapStateToProps = ({ auth, lang ,profile}) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{})(EditPhotoAd);




