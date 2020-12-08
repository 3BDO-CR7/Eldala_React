import React  from 'react';
import {
    StyleSheet,
    ScrollView,
    Platform,
    TouchableOpacity,
    ImageEditor,
    Image,
    ImageStore,
    Dimensions,Alert,
    KeyboardAvoidingView, I18nManager as RNI18nManager,
    Picker,
} from 'react-native';
import {
    Container,
    Icon,
    Content,
    ActionSheet,
    Body,
    Button,
    Title,
    Text,
    View,
    Item,
    Input,
    Textarea,
    CheckBox,
    ListItem,
    Toast
}
 from 'native-base';


import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import MapView from 'react-native-maps'
import axios    , { post }   from "axios";
import {Bubbles}   from "react-native-loader";
import {connect}   from "react-redux";
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import I18n from "ex-react-native-i18n";
import {CameraBrowser} from 'expo-multiple-imagepicker';
import { ImageBrowser } from 'expo-multiple-media-imagepicker';
import marker from '../../assets/marker.png'
import CONST from '../consts';

let BUTTONS = [
    { text: I18n.translate('gallery_photo') ,i : 0 },
    // { text: I18n.translate('camera_photo'),i : 1},
    { text: I18n.translate('gallery_video') ,i : 2},
    { text: I18n.translate('cancel'),   color: "#ff5b49" }
];
let     DESTRUCTIVE_INDEX   = 3;
let     CANCEL_INDEX        = 3;
let     Base64_             = [];
let     base_64             = [];
let     data                = new FormData();

class AddE3lan extends React.Component {
    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
            lang: this.props.lang,
            video: '',
            formData :  new FormData(),
            title: '',
            price: '',
            video_base64: '',
            description: '',
            type: '',
            Base64: [],
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT85f2luKM-VWgsg4LCfyqIqH14bbGedCbuQ527jcL9qWebZOZ3',
            city_id: null,
            key: null,
            mobile: null,
            user_id: this.props.auth.data.id,
            is_chat: false,
            is_phone: false,
            is_refresh: false,
            country_id: null,
            imageBrowserOpen: false,
            isLoaded: false,
            cameraBrowserOpen: false,
            photos: [],
            countries: [],
            codes: [],
            images: [],
            base_64: [],
            cities: [],
            region: {
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                latitude: 31.037933,
                longitude: 31.381523
            },


        };


        axios.post(`${CONST.url}countries`, {lang: this.state.lang})
            .then((response) => {
                this.setState({countries: response.data.data});
                this.setState({country_id: response.data.data[0].id});


                axios.post(`${CONST.url}cities`, {lang: this.state.lang, country_id: this.state.countries[0].id})
                    .then((response) => {

                        this.setState({cities: response.data.data});
                        this.setState({city_id: response.data.data[0].id});


                        axios.post(`${CONST.url}codes`, {lang: this.state.lang})
                            .then((response) => {
                                this.setState({codes: response.data.data});
                                this.setState({key: response.data.data[0]});
                            })
                            .catch((error) => {
                                this.setState({spinner: false});
                            }).then(() => {
                            this.setState({spinner: false});
                        });

                    }).catch((error) => {
                        this.setState({spinner: false});
                    }).then(() => {
                    this.setState({spinner: false});
                });
            }).catch((error) => {
                this.setState({spinner: false});
            })
    }

    delete_img_s(i) {
        this.state.Base64.splice(i, 1);
        Base64_.splice(i, 1);
        this.setState({photos: this.state.Base64})
    }

    async componentWillMount() {
         let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Toast.show({
                text: 'Permission to access location was denied',
                duration: 4000,
                type: 'danger',
                textStyle: {color: "white", textAlign: 'center'}
            });
        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge: 15000
            }).then((position) => {

                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                });

            }).catch(err =>{
                this.setState({
                    region: {
                        latitude:24.774265,
                        longitude: 46.738586,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                });
            }) ;

        }
    }

    renderMap() {
        if (this.state.region.latitude !== null) {
            return (
                <View >
                    <MapView
                        style={styles.map}
                        showsBuildings={true}
                        minZoomLevel={10}
                        zoomEnabled
                        initialRegion={this.state.region}
                        onRegionChangeComplete={this.onRegionChange}

                    />
                    <View style={styles.markerFixed}>
                        <Image style={styles.marker} source={marker}/>
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

    onValueChange_key(key) {
        this.setState({key});
    }

    onValueChange(value) {

        this.setState({country_id: value});
            this.setState({spinner: true});
            axios.post(`${CONST.url}cities`, {lang: this.props.lang, country_id:  value})
                .then((response) => {

                    this.setState({cities: response.data.data});
                    this.setState({city_id: response.data.data[0].id});

                    axios.post(`${CONST.url}codes`, {lang: this.state.lang , country_id : value})
                        .then((response) => {
                            this.setState({codes: response.data.data});
                            this.setState({key: response.data.data[0]});
                        })
                        .catch((error) => {
                            this.setState({spinner: false});
                        }).then(() => {
                        this.setState({spinner: false});
                    });

                })

                .catch((error) => {
                    this.setState({spinner: false});
                }).then(() => {
                this.setState({spinner: false});
            });

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

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.title === '') {
            isError = true;
            msg = I18n.t('titleValidation');
        } else if (this.state.price === '') {
            isError = true;
            msg = I18n.t('priceRequired');
        }  else if (this.state.description === '') {
            isError = true;
            msg = I18n.t('descriptionRequired');
        }
        if (msg !== '') {
            Toast.show({
                text: msg,
                duration: 2000,
                type: "danger",
                textStyle: {color: "white", fontFamily: 'CairoRegular', textAlign: 'center'}
            });

        }
        return isError;
    };

    async onLoginPressed() {

        const err = this.validate();

        console.log('base_64', base_64.concat(Base64_).length);

        if (!err) {

            this.setState({isLoaded: true});

            axios.post(`${CONST.url}uploadAd`,
                {
                    title: this.state.title,
                    mobile: this.state.key,
                    key: this.state.mobile,
                    price: this.state.price,
                    description: this.state.description,
                    country_id: this.state.country_id,
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude,
                    user_id: this.state.user_id,
                    city_id: this.state.city_id,
                    section_id: this.props.navigation.state.params.section_id,
                    category_id: this.props.navigation.state.params.category_id,
                    sub_category_id: (this.props.navigation.state.params.sub_category_id) ? this.props.navigation.state.params.sub_category_id : null,
                    type: '1',
                    is_refreshed: this.state.is_refresh,
                    is_mobile: this.state.is_phone,
                    is_chat: this.state.is_chat,
                    images: base_64.concat(Base64_)
                }
            ).then((response) => {
                    if (response.data.value === '1') {

                        Toast.show({
                            text: I18n.translate('imgVo'),
                            duration: 2000,
                            type: "info",
                            textStyle: {
                                color: "white",
                                fontFamily: 'CairoRegular',
                                textAlign: 'center'
                            }
                        });

                        this.state.formData.append('id',response.data.ad_id);

                        axios.post(`${CONST.url}uploadVideo`, this.state.formData)
                            .then((response) => {

                                Toast.show({
                                    text: I18n.translate('imgVoim'),
                                    duration: 2000,
                                    type: "success",
                                    textStyle: {
                                        color: "white",
                                        fontFamily: 'CairoRegular',
                                        textAlign: 'center'
                                    }
                                });
                                this.props.navigation.navigate('home');

                                this.setState({isLoaded: false});

                            }).catch((error) => {
                                console.log(error)
                        });


                    } else if (response.data.value === '2') {

                        this.state.formData.append('id',response.data.ad_id);

                        Toast.show({
                            text: I18n.translate('imgVo'),
                            duration: 2000,
                            type: "danger",
                            textStyle: {
                                color: "white",
                                fontFamily: 'CairoRegular',
                                textAlign: 'center'
                            }
                        });

                        axios.post(`${CONST.url}uploadVideo`, this.state.formData)
                            .then((response) => {

                                Toast.show({
                                    text: I18n.translate('imgVoim'),
                                    duration: 2000,
                                    type: "success",
                                    textStyle: {
                                        color: "white",
                                        fontFamily: 'CairoRegular',
                                        textAlign: 'center'
                                    }
                                });

                                this.props.navigation.navigate('home');

                                this.setState({isLoaded: false});

                            }).catch((error) => {
                                console.log(error)
                            });

                    } else {

                        Toast.show({
                            text: response.data.msg,
                            duration: 2000,
                            type: "danger",
                            textStyle: {
                                color: "white",
                                fontFamily: 'CairoRegular',
                                textAlign: 'center'
                            }
                        });

                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({isLoaded: false});
                })


        }
    }

    renderSubmit() {

        if (this.state.isLoaded) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 30}}>
                    <Bubbles size={10} color="#2977B3"/>
                </View>
            )
        }


        return (

            <Button onPress={() => this.onLoginPressed()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </Button>

        );
    }

    onValueChangeCity(value) {
        this.setState({
            city_id: value
        });
    }

    images_video = async (i) => {

        if (i.i === 0) {
            this.setState({imageBrowserOpen: true});

        } else if (i.i === 1) {

            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect: [4, 3],
                quality : .5,

            });
            if (!result.cancelled) {
                this.setState({
                    Base64: this.state.Base64.concat(result.uri)
                });
                Base64_.push(result.base64);

                data.append("images[]",{
                    uri : result.uri,
                    type : 'image/jpeg',
                    name : result.filename || `temp_image_${result.height}.jpg`
                });

            }

        } else if (i.i === 2) {

            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                mediaTypes: 'Videos',
                quality : .5,
            });

            if (!result.cancelled) {
                this.setState({video: result.uri ,video_base64:result.base64, image: result.uri});
            }

            let localUri = result.uri;
            let filename = localUri.split('/').pop();

            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `video/${match[1]}` : video;
            this.state.formData.append('media', {
                uri: localUri, name: filename, type
            });
        }
    };

    imageBrowserCallback = (callback) => {

        callback.then((photos) => {
                photos.map((item,index) => {
                    data.append("images[]",{
                        uri : item.localUri,
                        type : 'image/jpeg',
                        name : item.filename || `temp_image_${index}.jpg`
                    });
                });

                this.setState({
                    imageBrowserOpen: false,
                    cameraBrowserOpen: false,
                    photos: this.state.photos.concat(photos)
                });
                console.log('photos', this.state.photos.length)
                console.log('photos uri', this.state.photos)
                const imgs = this.state.photos;
                for (let i = 0; i < imgs.length; i++) {
                    const imageURL = imgs[i].localUri;
                    FileSystem.readAsStringAsync(imageURL, { encoding: 'base64' }).then(imgBase64 => Base64_.push(imgBase64))
                }
            }
        ).catch((e) =>{
            console.log('cash ==================');
            console.log(e)
        })
    };

    delete_img(i) {
        this.state.photos.splice(i, 1);
        base_64.splice(i, 1);
        this.setState({photos: this.state.photos})
    }

    delete_video(i) {
        this.setState({image: null, video: ''})
    }

    renderImage(item, i) {
        return (
            <View key={i}>

                <Image
                    style={{height: 70, width: 70, marginHorizontal: 10}}
                    source={{uri: item.file}}
                    key={i}
                />
                <TouchableOpacity onPress={() => {
                    this.delete_img(i)
                }} style={{
                    position: 'absolute',
                    right: 15,
                    top: 5,
                    backgroundColor: '#444',
                     width: 25
                }}>
                    <Icon name="close" style={{color: 'white', textAlign: 'center', fontSize: 22}}/>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }else {
            throw new Error('Location permission not granted');
        }
    };

  render() {

      if (this.state.imageBrowserOpen) {
          return(<ImageBrowser base64={true}  max={8}  callback={this.imageBrowserCallback}/>);
      }else if (this.state.cameraBrowserOpen) {
          return(<CameraBrowser   base64={true}   max={8} callback={this.imageBrowserCallback}/>);
      }

      return (
      <Container>


        <View style={styles.header}>
            <View>
                <Title style={[ styles.text, { paddingHorizontal : 20 } ]}>{I18n.translate('add_ads')}</Title>
            </View>
            <View>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                </Button>
            </View>
        </View>

        <Content>

            <View style={styles.upload}>
                <Text style={styles.textes}>{I18n.translate('add_photo')}</Text>
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


            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginHorizontal: 20}}>
                {
                    this.state.photos.map((item,i) => {
                        return(
                            <View key={i} style={{height: 70, width: 70, margin: 10, overflow : 'hidden', borderRadius : 5 }}>

                                <Image
                                    style={{height: '100%', width: '100%' }}
                                    source={{uri: item.uri}}
                                    key={i}
                                />
                                <TouchableOpacity onPress={() => {
                                    this.delete_img_s(i)
                                }} style={{
                                    position        : 'absolute',
                                    right           : 0,
                                    top             : 0,
                                    backgroundColor : 'rgba(0,0,0,0.5)',
                                    width           : '100%',
                                    height          : '100%',
                                    alignItems      : 'center',
                                    justifyContent  : 'center'
                                }}>

                                    <Icon name="close" style={{color: 'white', textAlign: 'center', fontSize: 22}}/>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </ScrollView>

            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginHorizontal: 20}}>
                {
                    (this.state.video !== '')
                        ?
                        <View style={{height: 70, width: 70, margin: 10, overflow : 'hidden', borderRadius : 5 }}>
                            <Image source={{uri: this.state.image}} style={{height: '100%', width: '100%' }}/>
                            <TouchableOpacity onPress={()=> {this.delete_video()}} style={{
                                position            : 'absolute',
                                right               : 0,
                                top                 : 0,
                                backgroundColor     : 'rgba(0,0,0,0.5)',
                                width               : '100%',
                                height              : '100%',
                                alignItems          : 'center',
                                justifyContent      : 'center'
                            }}>

                                <Icon name="close" style={{ color : 'white' , textAlign:'center', fontSize:22}}/>

                            </TouchableOpacity>
                        </View>
                        :
                        <View/>
                }
            </ScrollView>

            <KeyboardAvoidingView behavior="padding"  style={{  flex: 1}} >

            <View style={styles.block_section}>

                <View style={[styles.viewPiker,{flex:1,width: '100%'}]}>
                    <Item style={[styles.itemPiker,{width                 : '100%'}]} regular>
                        <Picker

                            iosHeader={I18n.translate('choose_country')}
                            headerBackButtonText={I18n.translate('goBack')}
                            mode="dropdown"
                            style={styles.Picker}
                            onValueChange={this.onValueChange.bind(this)}
                            placeholderStyle={{ color: "#bbb", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                            selectedValue={this.state.country_id}
                            textStyle={{ color: "#bbb",fontFamily : 'CairoRegular', writingDirection: 'rtl',width: '100%' }}
                            placeholder={I18n.translate('choose_country')}
                            itemTextStyle={{ color: '#bbb',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>

                            <Picker.Item style={styles.itemPicker} label={I18n.translate('choose_country')} value={null} />

                            {
                                this.state.countries.map((country, i) => (
                                    <Picker.Item style={styles.itemPicker} key={i} label={country.name} value={country.id} />
                                ))
                            }

                        </Picker>
                    </Item>
                    <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                </View>

                <View style={[styles.viewPiker,{flex:1,width: '100%'}]}>
                    <Item style={[styles.itemPiker,{width : '100%'}]} regular>
                        <Picker
                            iosHeader={I18n.translate('choose_city')}
                            headerBackButtonText={I18n.translate('goBack')}
                            mode="dropdown"
                            style={styles.Picker}
                            selectedValue={this.state.city_id}
                            onValueChange={this.onValueChangeCity.bind(this)}
                            placeholderStyle={{ color: "#bbb", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                            textStyle={{ color: "#bbb",fontFamily : 'CairoRegular', writingDirection: 'rtl' ,width                 : '100%'}}
                            placeholder={I18n.translate('choose_city')}
                            itemTextStyle={{ color: '#bbb',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>

                            <Picker.Item style={styles.itemPicker} label={I18n.translate('choose_city')} value={null} />

                            {
                                this.state.cities.map((country, i) => (
                                    <Picker.Item style={styles.itemPicker} key={i} label={country.name} value={country.id} />
                                ))
                            }

                        </Picker>
                    </Item>
                    <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                </View>

                    <Item style={styles.item}>
                        <Input  value = {this.state.title} onChangeText={(title)=>{ this.setState({title})}} style={styles.input} placeholder={I18n.translate('title')} />
                    </Item>
                    <Item style={styles.item}>
                        <Input value={this.state.price} style={styles.input}   onChangeText={(price)=>{ this.setState({price})}} placeholder={I18n.translate('price')} />
                    </Item>
                    <Item style={styles.item}>
                        <Textarea value={this.state.description}  style={styles.textarea}  onChangeText={(description)=>{ this.setState({description})}}  rowSpan={5} bordered placeholder={I18n.translate('description')} />
                    </Item>

                <View style={{flex:1, flexDirection: 'row'}}>

                    <View style={{flex:2}}>
                        <Item  style={styles.item} >
                            <Icon style={styles.icon} active type="FontAwesome" name='whatsapp' />
                            <Input style={styles.input}   onChangeText={(mobile) => this.setState({mobile})}  value={ this.state.mobile } placeholder={ I18n.translate('whatsapp')}   />
                        </Item>
                    </View>

                    <View style={{flex:1}}>

                        <Item style={[ styles.itemPiker_second,{overflow:'hidden', height: 51} ]} regular>
                            <Picker
                                // iosHeader={I18n.translate('myCity')}
                                headerBackButtonText={I18n.translate('goBack')}
                                mode="dropdown"
                                style={styles.Picker}
                                selectedValue={this.state.key}
                                onValueChange={this.onValueChange_key.bind(this)}
                                placeholderStyle={{ color: "#444", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 14 }}
                                textStyle={{ color: "#444",fontFamily : 'CairoRegular', writingDirection: 'rtl',paddingLeft : 5, paddingRight: 5 }}
                                // placeholder={I18n.translate('myCity')}
                                itemTextStyle={{ color: '#444',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>

                                {/*<Picker.Item style={styles.itemPicker} label={I18n.translate('all_cities')} value={null} />*/}

                                {
                                    this.state.codes.map((code, i) => {
                                        return <Picker.Item   style={{color: "#444",marginHorizontal: 20}}  key={i} value={code} label={code} />
                                    })
                                }

                            </Picker>
                            <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                        </Item>


                    </View>

                </View>
            </View>

            <Text style={[styles.text , styles.textsetting]}>{I18n.translate('configurations')}</Text>

            <ListItem  onPress={() => this.setState({ is_phone: !this.state.is_phone })}>
                <CheckBox
                    checked={this.state.is_phone}
                    value={this.state.is_phone}

                />
                <Body>
                <Text style={{fontFamily              : 'CairoRegular'}}>{I18n.translate('with_phone')}</Text>
                </Body>
            </ListItem>

            <ListItem  onPress={() => this.setState({ is_refresh: !this.state.is_refresh })}>
                <CheckBox
                    checked={this.state.is_refresh}



                />
                <Body>
                <Text style={{fontFamily              : 'CairoRegular'}}>{I18n.translate('renew')}</Text>
                </Body>
            </ListItem>

            <ListItem   onPress={() => this.setState({ is_chat: !this.state.is_chat })}>
                <CheckBox
                    checked={this.state.is_chat}
                    value={this.state.is_chat}


                />
                <Body>
                <Text style={{fontFamily              : 'CairoRegular'}}>{I18n.translate('private')}</Text>
                </Body>
            </ListItem>

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
        paddingRight          : 5,
        paddingLeft           : 5,
        borderWidth           : 1,
        borderColor           : "#ECECEC",
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
        color                 : CONST.color
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
        marginVertical                  : 15,
        borderColor             : '#bbbb',
        borderStyle             : "dashed",
        borderWidth             : 1,
        borderRadius            : 5,
        padding                 : 30,
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
        color : '#262161'
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
    viewPiker : {
        position            : 'relative',
        marginTop           : 5,
        marginBottom        : 5,
        flexBasis           : "33%",
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        backgroundColor     : "#fff",
        borderRadius        : 5,
        borderColor         : '#aaaaaa',
        borderWidth         : .5
    },
    Picker : {
        width               : '100%',
        backgroundColor     : 'transparent',
        borderWidth         : 0,
        paddingLeft         : 0,
        marginRight         : 0,
        borderRadius        : 10,
        height              : 40,
    },
    itemPiker : {
        borderWidth         : 0,
        borderColor         : '#FFF',
        width               : '100%',
        position            : 'relative',
        fontSize            : 18,
        fontFamily          : 'CairoRegular',
        borderRadius        : 5,
        borderLeftWidth     : 0,
        borderBottomWidth   : 0,
        borderTopWidth      : 0,
        borderRightWidth    : 0,
        color               : "#FFF"
    },
    iconPicker : {
        position            : 'absolute',
        right               : 5,
        color               : CONST.color,
        fontSize            : 16
    },
    filter : {
        flexDirection       : "row",
        justifyContent      : "space-between",
        marginBottom        : 5,
        marginHorizontal     : 10
    },
    clickFunction : {
        backgroundColor     : "#fff",
        alignItems          : 'center',
        justifyContent      : 'space-between',
        alignSelf           : 'center',
        borderRadius        : 5,
        color               : CONST.color,
        padding             : 8,
        flexBasis           : "33%",
        flexDirection       : "row",
        borderColor         : '#444',
        borderWidth         : .5
    }

    ,
    textFun : {
        color               : '#444',
        fontFamily          : "CairoRegular",
        fontSize            : 14,
    },
    iconFun : {
        color               : CONST.color,
        fontSize            : 16,
    }
});

const mapStateToProps = ({ auth, lang ,profile}) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{})(AddE3lan);




