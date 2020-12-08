import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    AsyncStorage,
    Alert,
    View,
    Image,
    KeyboardAvoidingView,
    I18nManager as RNI18nManager,
    Picker, ActivityIndicator,
} from 'react-native';
import {Container, Content, Form, Item, Input, Label, Icon, Title, Button, Toast} from 'native-base'
import {ImagePicker} from 'expo';

import * as Permissions from 'expo-permissions'
import Constants from "expo-constants";
import I18n from "ex-react-native-i18n";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import {Bubbles} from "react-native-loader";
import {connect} from "react-redux";
 const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";

class Register extends Component {
    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

         this.state  = {
            en_message   : 'please complete all required data',
            ar_message   : 'برجآء تأكد من إدخال جميع البيانات',
            key : null,
            cities: [],
             codes: [],
            countries : [],
            is_password: false,
            cf_password:null ,
            is_email: false,
            email :null ,
            spinner: false,
            phone : '',
            lang : this.props.lang,
            country_id: 1,
            password : '',
            city_id : null ,
            name : '' ,
            files : null,
            isLoaded : false,
            text: null,
            selected2   : undefined,
            image  : null};
     }

  componentWillMount() {
      this.setState({spinner: true});
      axios.post(`${CONST.url}countries`, { lang: this.props.lang  })
          .then( (response)=> {
              this.setState({countries  : response.data.data});
              this.setState({country_id : response.data.data[0].id});

              axios.post(`${CONST.url}cities`, { lang: this.props.lang , country_id: this.state.country_id })
                  .then( (response)=> {

                      this.setState({cities: response.data.data});
                      this.setState({city_id: response.data.data[0].id})

                      axios.post(`${CONST.url}country_codes`, { lang: this.state.lang , country_id : this.state.country_id })
                          .then( (response)=> {

                              this.setState({key: response.data.data});
                          }).then(()=>{
                          this.setState({spinner: false});
                      });
                  }).then(()=>{
                  this.setState({spinner: false});
              });

          })
          .catch( (error)=> {
              this.setState({spinner: false});
          })

  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64:      true,
      aspect: [4, 3],
    });

    this.setState({files: result.base64});

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  onValueChange(value) {
    this.setState({ country_id: value});

    setTimeout(()=>{

          this.setState({spinner: true});
          axios.post(`${CONST.url}cities`, { lang: this.props.lang , country_id: this.state.country_id })
              .then( (response)=> {

                  this.setState({cities: response.data.data});
                  this.setState({city_id: response.data.data[0].id});


                  axios.post(`${CONST.url}country_codes`, { lang: this.state.lang , country_id : this.state.country_id })
                      .then( (response)=> {

                          this.setState({key: response.data.data});
                      })
                      .catch( (error)=> {
                          this.setState({spinner: false});
                      }).then(()=>{
                      this.setState({spinner: false});
                  });

              })

              .catch( (error)=> {
                  this.setState({spinner: false});
              })

      },500);

  }

    onValueChangeCity(value) {
        this.setState({
          city_id: value
        });
    }

    changeFocusName(name)   { this.setState({name}) }

    changeFocusPassword(password) { this.setState({password}) }

    validate = () => {
        let isError = false;
        let msg = '';

        if(this.state.name.length <= 0)
        {
            isError = true;
            msg = I18n.t('nameValidation');
        }
        else if (this.state.phone.length <= 0 ) {
            isError = true;
            msg = I18n.t('phoneValidation');
        }else if (this.state.password.length <= 0) {
            isError = true;
            msg = I18n.t('passwordRequired');
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
        }
        return isError;
    };

    sendData() {
        const err = this.validate();
        if (!err) {
            this.setState({isLoaded: true});
            this.setState({spinner: true});
            axios.post(`${CONST.url}signUp`, {
                lang: this.state.lang ,
                phone : this.state.phone ,
                files :  this.state.files,
                name : this.state.name ,
                password : this.state.password ,
                key : this.state.key,
                country_id: this.state.country_id ,
                city_id : this.state.city_id
            }).then( (response)=> {
                this.setAsyncStorage(response);
            }).catch( (error)=> {
                console.log(error.message);
                this.setState({spinner: false});
                this.setState({isLoaded: false});
            }).then(()=>{
                this.setState({spinner: false});
                this.setState({isLoaded: false});
            }).then(()=>{
                this.setState({spinner: false});
                this.setState({isLoaded: false});
            });
        }
    }

    async setAsyncStorage(response) {
        if(response.data.value === '1')
      {
          Toast.show({ text: response.data.msg, duration : 2000  ,textStyle: { color: "yellow",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
          //await AsyncStorage.setItem('plusUserId', JSON.stringify(response.data.user_id));

           this.props.navigation.navigate('Confirmation',
                 {
                     phone: this.state.phone,
                     key : this.state.key,
                     password: this.state.password,
                     user_id :response.data.user_id
              });


      }else if(response.data.value === '2')
       {
           Alert.alert(
               `${I18n.currentLocale() === 'en' ? 'Sign In' : 'سجل دخول'}`,
               `${I18n.currentLocale() === 'en' ? 'User exists , Login Now ?' : 'هذا الحساب مسجل بالفعل ، تسجيل دخول ؟'}`,
               [
                   {
                       text: `${I18n.currentLocale() === 'en' ? 'Sign In' : 'سجل دخول'}`,
                       onPress: () => this.props.navigation.navigate('login')
                   },
                   {
                       text: `${I18n.currentLocale() === 'en' ? 'Cancel' : 'إلغاء'}`,
                       onPress: () => console.log('Cancel Pressed'),
                       style: 'cancel',
                   }
               ],
               {cancelable: false},
           );
       }else{
            Toast.show({ text: response.data.msg, duration : 2000  ,textStyle: { color: "yellow",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
        }
    }

    renderSubmit() {

        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center'}}>
                    <Bubbles size={10} color="#2977B3"/>
                </View>
            )
        }

        return (

            <Button  onPress={() => this.sendData()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </Button>

        );
    }

    onFocus() {
        this.componentWillMount();
    }

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
    let { image } = this.state;
    return (
      <Container>

          <NavigationEvents onWillFocus={() => this.onFocus()} />
          {this.renderLoader()}

          <View style={styles.header}>
              <View>
                  <Title style={[ styles.text , {  paddingHorizontal : 20 } ]}>{I18n.translate('signUP')}</Title>
              </View>
              <View>
                  <Button transparent onPress={() => this.props.navigation.goBack()}>
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </View>
          </View>

        <Content contentContainerStyle={{ flexGrow: 1 }}>

            <View style={styles.imagePicker}>
              <Button onPress={this._pickImage} style={styles.clickOpen}>
                <Icon style={styles.iconImage} active type="FontAwesome" name='image' />
              </Button>
              {image && <Image source={{ uri: image }} style={styles.imgePrive} />}
            </View>


            <View style={styles.bgDiv}>

   <KeyboardAvoidingView behavior="padding"    style={{ flex: 1, width : '100%'}} >
         <Form style={{ width : '100%' }} >
              <View style={styles.item} >
                <Icon style={styles.icon} active type="SimpleLineIcons" name='user' />
                {/*<Label style={styles.label}>{ I18n.translate('username')}</Label>*/}
                <Input style={styles.input}
                       placeholder={I18n.translate('username')}
                       placeholderColor='#ddd'
                       value={ this.state.name}
                       onChangeText={(name)=> this.changeFocusName(name)}
                />
              </View>
             <View style={{flex:1, flexDirection: 'row'}}>
                 <View style={{flex:1}}>
                     <View  style={[styles.item , {flexDirection : 'row'}]} >
                         <Icon style={styles.icon} active type="SimpleLineIcons" name='phone' />
                         {/*<Label style={styles.label}>{ I18n.translate('phone')}</Label>*/}
                         <Input style={[styles.input]}
                                keyboardType={'number-pad'}
                                placeholderColor='#ddd'
                                placeholder={I18n.translate('phone')}
                                onChangeText={(phone) => this.setState({phone})}  value={ this.state.mobile }     />
                     </View>
                 </View>
             </View>
             <View style={[ styles.position_R, {  padding : 0,marginBottom : 10, marginTop : 10,width : '100%', borderBottomColor : '#DDD', borderBottomWidth:  1} ]} regular>
                 <Icon style={[ styles.iconPicker ]} name='down' type="AntDesign"/>
                 <Picker
                     iosHeader={I18n.translate('choose_country')}
                     headerBackButtonText={I18n.translate('goBack')}
                     mode="dropdown"
                     placeholder={I18n.translate('choose_country')}
                     placeholderStyle={{ color: "#363636", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular' }}
                     placeholderIconColor="#444"
                     style={{backgroundColor:'transparent',color: '#363636', width : '100%', writingDirection: 'rtl',fontFamily : 'CairoRegular'}}
                     selectedValue={this.state.country_id}
                     itemTextStyle={{ color: '#363636', width : '100%', writingDirection: 'rtl',fontFamily : 'CairoRegular' }}
                     textStyle={{ color: "#363636" , width : '100%', writingDirection: 'rtl',fontFamily : 'CairoRegular',paddingLeft : 10, paddingRight: 10 }}
                     onValueChange={this.onValueChange.bind(this)}
                 >
                     {this.state.countries.map((city, i) => {
                         return <Picker.Item style={{color: "#363636", width : '100%',fontFamily : 'CairoRegular'}}  key={i} value={city.id} label={city.name} />
                     })}
                 </Picker>
             </View>
             <View style={[ styles.position_R, {  padding : 0,marginBottom : 10, marginTop : 10,width : '100%', borderBottomColor : '#DDD', borderBottomWidth:  1} ]} regular>
                 <Icon style={[ styles.iconPicker ]} name='down' type="AntDesign"/>
                 <Picker
                     mode="dropdown"
                     iosHeader={I18n.translate('myCity')}
                     headerBackButtonText={I18n.translate('goBack')}
                     style={{width: '100%',backgroundColor:'transparent',color: '#363636', writingDirection: 'rtl',fontFamily : 'CairoRegular'}}
                     placeholderStyle={{ color: "#363636", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular' }}
                     selectedValue={this.state.city_id}
                     onValueChange={this.onValueChangeCity.bind(this)}
                     textStyle={{ color: "#363636" , width : '100%', writingDirection: 'rtl',fontFamily : 'CairoRegular',paddingLeft : 10, paddingRight: 10 }}
                     placeholder={I18n.translate('myCity')}
                     itemTextStyle={{ color: '#363636', width : '100%', writingDirection: 'rtl',fontFamily : 'CairoRegular' }}>
                     {this.state.cities.map((city, i) => {
                         return <Picker.Item   style={{color: "#363636" , width : '100%',fontFamily : 'CairoRegular'}}  key={i} value={city.id} label={city.name} />
                     })}
                 </Picker>
             </View>
             <View style={[styles.item]}  >
                 <Icon style={styles.icon} active type="SimpleLineIcons" name='lock' />
                 {/*<Label style={styles.label}>{I18n.translate('password')}</Label>*/}
                 <Input style={styles.input}
                        placeholderColor='#ddd'
                        placeholder={I18n.translate('password')}
                        value={this.state.password}  secureTextEntry onChangeText={(password)=> this.changeFocusPassword(password)} />
             </View>
             { this.renderSubmit() }
              <Text onPress={() => this.props.navigation.navigate('login')} style={styles.Login}>{I18n.translate('have_account')}</Text>
            </Form>

             </KeyboardAvoidingView>
            </View>
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
    },
    icons : {
      fontSize              : 20,
      color                 : CONST.color
    },
    bgImage : {
      flex                  : 1,
      justifyContent        : 'center',
    },
    logo : {
        transform           : [{ scale: 0.5 }],
        top                 : 50,
    },
    bgDiv : {
      padding               : 10,
      width                 : "85%",
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
    },
    icon : {
      color                 : '#bbb',
      position              : 'absolute',
      left                  : 0,
      top                   : 15,
      alignItems            : 'center',
      justifyContent        : 'center',
      fontSize              : 16
    },
    item : {
        padding                 : 0,
        width                   : '100%',
        marginVertical          : 10,
        marginLeft              : 0,
        borderBottomWidth             : 1 ,
        borderBottomColor : '#DDD'

    },
    label : {
        width               : "100%",
        color               : '#bbb',
        borderWidth         : 0,
        padding             : 0,
        top                 : -10,
        fontFamily          : 'CairoRegular',
        textAlign           : 'left',
        fontSize            : 14
    },
    input : {
        borderColor         : '#e2b705',
        borderWidth         : 0,
        borderRadius        : 10,
        width               : "100%",
        color               : '#bbb',
        padding             : 0,
        textAlign           : 'right',
        paddingLeft         : 30,
        fontFamily          : 'CairoRegular',
        fontSize            : 14
    },
    textFont : {
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        color               : '#bbb',
        fontSize            : 15,
        marginBottom        : 20,
        textAlign           : 'center',
        fontFamily          : 'CairoRegular'
    },
    bgLiner:{
        borderRadius        : 5,
        width               : 170,
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        marginTop           : 40,
        backgroundColor : CONST.color
    },
    textBtn : {
        textAlign           : 'center',
        color               : '#fff',
        fontSize            : 16,
        padding             : 0,
        fontFamily          : 'CairoRegular',
    },
    Login : {
      fontFamily            : 'CairoRegular',
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      margin                : 25,
      color                 : "#444"
    },
    Picker : {

      writingDirection      : 'rtl',
      borderWidth           : 0,
      paddingLeft           : 0,
      fontSize              : 14,
      fontFamily            : 'CairoRegular',

    },
    itemPiker : {
      borderWidth           : 0,
      borderColor           : '#FFF',
      borderBottomColor     : "#DDD" ,
      width                 : '90%',
      position              : 'relative',
      padding               : 10,
      fontSize              : 14,
      justifyContent: 'center',
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
      fontFamily            : 'CairoRegular',
    },
    iconPicker : {
      position              : 'absolute',
      right                 : 5,
        fontSize : 12,
        top : 20
    },
    imagePicker : {
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      margin                : 20,
      width                 : 90,
      height                : 90,
      borderWidth           : 1,
      borderColor           : "#DDD",
      borderRadius          : 100,
      overflow              : 'hidden'
    },
    clickOpen : {
      width                 : 90,
      height                : 90,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      borderRadius          : 100,
      backgroundColor       : "transparent",
      padding               : 0,
      overflow              : 'hidden'
    },
    iconImage : {
      color                 : "#DDD"
    },
    imgePrive : {
      position              : 'absolute',
      width                 : 90,
      height                : 90,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      top                   : 0
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
const mapStateToProps = ({ lang}) => {

    return {

        lang   : lang.lang,

    };
};
export default connect(mapStateToProps,{})(Register);




