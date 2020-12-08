import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView, I18nManager as RNI18nManager,
    Picker,
} from 'react-native';
import {
    Container,
    Form,
    Item,
    Input,
    Label,
    Icon,
    Title,
    Button,
    Toast, Header, Left, Body, Right
} from 'native-base'
import * as Permissions from 'expo-permissions'
import {ImagePicker } from 'expo';
import {connect} from "react-redux";
import I18n from "ex-react-native-i18n";
import axios from "axios";
import {Bubbles} from "react-native-loader";
import { profile ,updateProfile,logout ,tempAuth} from '../actions'
import CONST from '../consts';

class EditProfile extends Component {


    constructor(props) {

        super(props);

        RNI18nManager.forceRTL(true);


        this.state = {
            password     : '',
            cf_password  : '',
            phone        : '',
            countries    : [],
            codes    : [],
            key          : '',
            city_id      : '',
            cities       : [],
            country_id   : '',
            name         : '',
            spinner      : false,
            text         : '',
            pathname     : '',
            favourites   : [],
            image        : '',
            img          : '',
            lang         : 'ar'
        };


        if(!this.props.user) {
            this.props.navigation.navigate('login');
        }

        this.setState({lang: this.props.lang});

    }

    componentWillReceiveProps(newProps){

            this.setState({spinner: false});
            this.setState({isLoaded: false });
            if(newProps.Updated === 2)
            {
                if( JSON.stringify(this.props.user) !== JSON.stringify(newProps.user)){


                    if(newProps.result != null)
                    {
                        if(newProps.result.value === '1')
                        {
                            Toast.show({ text:  newProps.result.msg, duration : 2000  ,type :"success", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                            this.props.profile({  user_id: this.props.user.id,lang : this.props.lang  });
                            this.props.navigation.navigate('profile');
                        }else if(newProps.result.value === '2')
                        {

                            Toast.show({ text:  newProps.result.msg, duration : 2000  ,type :"warning", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

                            this.props.navigation.navigate('Confirmation_Page',{
                                user_id :newProps.userId
                            });


                        }else{
                            Toast.show({ text:  newProps.result.msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                        }
                    }else{
                    }

                }else{
                    console.log('change updated',newProps.Updated);
                }
            }




    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0 || this.state.phone.length < 9) {
            isError = true;
            msg = I18n.t('phoneValidation');
        }else if (this.state.name === '') {
            isError = true;
            msg = I18n.t('nameRequired');
        }else if(this.state.password.length > 0)
        {    isError = true;
            if(this.state.password.length < 6)
            {   isError = true;
                msg = I18n.t('passwordRequired');

            }else if(this.state.password !== this.state.cf_password)
            {   isError = true;
                msg = I18n.t('cf_passwordRequired');
            }else{
                isError = false;
            }
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }

        console.warn(isError,msg)
        return isError;
    };

    renderSubmit() {

        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center'  , marginVertical:40}}>
                    <Bubbles size={10} color="#2977B3"/>
                </View>
            )
        }


        return (

            <Button  onPress={() => this.sendData()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('save')}</Text>
            </Button>

        );
    }

    sendData() {

        const err = this.validate();
        if (!err){
             this.setState({spinner: true});
            this.setState({isLoaded: true});

            const data = {
                lang      : this.props.lang ,
                user_id   : this.props.user.id,
                phone     : this.state.phone ,
                files     : this.state.image,
                codes     : [],
                name      : this.state.name ,
                password  : this.state.password ,
                key       : this.state.key,
                country_id: this.state.country_id ,
                city_id   : this.state.city_id
            };


            this.props.updateProfile(data);
        }else{
            console.warn('error')
        }

    }

    componentWillMount() {

       if(this.props.lang) { this.setState({lang:    this.props.lang}); }

        if(this.props.auth) {

            if(this.props.user)
            {
                this.setState({

                    image     :this.props.user.avatar,
                    phone     :this.props.user.mobile,
                    city_id   :this.props.user.city_id,
                    key   :this.props.user.key,
                    country_id: this.props.user.country_id,
                    name      : this.props.user.name

                });

            }else{

                this.setState({
                    image     :this.props.auth.data.avatar,
                    phone     :this.props.auth.data.mobile,
                    city_id   :this.props.auth.data.city_id,
                    key           :this.props.auth.data.key,
                    country_id: this.props.auth.data.country_id,
                    name      : this.props.auth.data.name,
                    user_id: this.props.auth.data.id

                });

                this.props.profile({   });
            }

        }else{
            this.props.navigation.navigate('login');
        }

        this.setState({spinner: true});

          axios.post(`${CONST.url}countries`, { lang: this.props.lang  })
              .then( (response)=> {
                  this.setState({countries: response.data.data});

                  axios.post(`${CONST.url}cities`, { lang: this.props.lang , country_id: this.state.country_id })
                      .then( (response)=> {

                          this.setState({cities : response.data.data});


                          axios.post(`${CONST.url}codes`, { lang: this.props.lang })
                              .then( (response)=> {
                                  this.setState({codes:response.data.data})
                                  this.setState({key:response.data.data[0]})
                              })
                              .catch( (error)=> {
                                  this.setState({spinner: false});
                              }).then(()=>{
                              this.setState({spinner: false});
                          })

                      })

                      .catch( (error)=> {
                          this.setState({spinner: false});
                      })
              })
              .catch( (error)=> {
                  this.setState({spinner: false});
              });

          this.props.profile({  user_id: this.props.auth.data.id  });

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
    }

    _pickImage    = async () => {

        let result  = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          base64:      true,
          aspect: [4, 3],
        });

          this.setState({img: result.base64});

          if (!result.cancelled) {
              this.setState({ image: result.uri });
          }

    };

    changeFocusName(name)   { this.setState({name}) }

    changeFocusPhone(phone) { this.setState({phone}) }

    changeFocusPassword(password) { this.setState({password}) }

    changeFocusCfPassword(cf_password) {
        if(this.state.password !== cf_password)
        {
            this.setState({cf_password:cf_password})
            this.setState({is_password:false})
            return false;
        }
        else {
            this.setState({cf_password:cf_password})
            this.setState({is_password:true})
        }
    }

    onValueChangeCity(value) {
        this.setState({
            city_id: value
        });
    }

    onValueChange(value) {

        this.setState({ country_id: value});

        setTimeout(()=>{

            this.setState({spinner: true});
            axios.post(`${CONST.url}cities`, { lang:this.props.lang , country_id: this.state.country_id })
                .then( (response)=> {

                    this.setState({cities: response.data.data});
                    if(response.data.data.length > 0)
                    {
                        this.setState({city_id: response.data.data[0].id});
                    }

                    axios.post(`${CONST.url}country_codes`, { lang: this.props.lang , country_id : value })
                        .then( (response)=> {
                            this.setState({codes:response.data.data});
                            this.setState({key:response.data.data});
                        })
                        .catch( (error)=> {
                            this.setState({spinner: false});
                        }).then(()=>{
                        this.setState({spinner: false});
                    })

                })

                .catch( (error)=> {
                    this.setState({spinner: false});
                }).then(()=>{
                this.setState({spinner: false});

            });

        },1500);

    }

  render() {

    let { image } = this.state;

    return (
      <Container>


          <Header style={styles.header}>
              <Body>
              <Title style={[ styles.headerTitle , { paddingHorizontal : 20 } ]}>{I18n.translate('editAcc')}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={()=> this.props.navigation.navigate('profile')} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

              <View style={styles.imagePicker}>
                  <Button onPress={this._pickImage} style={styles.clickOpen}>
                      {this.state.image && <Image source={{ uri: image }} style={styles.imgePrive} />}
                  </Button>
              </View>


              <KeyboardAvoidingView behavior="padding" style={{  flex: 1 , marginHorizontal: 40}} >

                  <Item style={styles.item} >
                      <Icon style={styles.icon} active type="SimpleLineIcons" name='user' />
                      {/*<Label style={styles.label}>{ I18n.translate('username')}</Label>*/}
                      <Input
                          placeholderStyle={{color : 'black'}}
                          style={styles.input}
                          value={ this.state.name}
                          placeholderColor='#ddd'
                          placeholder={I18n.translate('username')}
                          onChangeText={(name)=> this.changeFocusName(name)}
                      />
                  </Item>


                  <Item style={[styles.item]} >
                     <Icon style={styles.icon} active type="AntDesign" name='phone' />
                     {/*<Label style={styles.label}>{ I18n.translate('phone')}</Label>*/}
                     <Input
                         placeholderStyle={{color : 'black'}}
                         style={[styles.input]}
                         value={ this.state.phone }
                         onChangeText={(phone)=> this.changeFocusPhone(phone)}
                         placeholderColor='#ddd'
                         placeholder={I18n.translate('phone')}
                     />
                 </Item>

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

                 <Item style={styles.item} >
                     <Icon style={styles.icon} active type="SimpleLineIcons" name='lock' />
                     {/*<Label style={styles.label}>{I18n.translate('password')}</Label>*/}
                     <Input
                         autoCapitalize='none'
                         secureTextEntry
                         style={styles.input}
                         value={this.state.password}
                         placeholderColor='#ddd'
                         placeholder={I18n.translate('password')}
                         onChangeText={(password)=> this.changeFocusPassword(password)}
                     />
                 </Item>

                 <Item style={styles.item} >
                     <Icon style={styles.icon} active type="SimpleLineIcons" name='lock' />
                     {/*<Label style={styles.label}>{I18n.translate('verifyNewPass')}</Label>*/}
                     <Input
                         autoCapitalize='none'
                         secureTextEntry
                         style={styles.input}
                         value={this.state.cf_password}
                         placeholderColor='#ddd'
                         placeholder={I18n.translate('verifyNewPass')}
                         onChangeText={(cf_password)=> this.changeFocusCfPassword(cf_password)}
                     />
                 </Item>

                 { this.renderSubmit() }

             </KeyboardAvoidingView>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    header : {
      backgroundColor       : "transparent",
      alignItems            : 'center',
      padding               : 10,
      paddingTop            : 25,
      borderWidth           : 1,
        height : 85,
      borderColor           : "#ECECEC",
    },
    text : {
      fontFamily            : 'CairoRegular',
      color                 : '#444',
      marginTop             : 7,
      fontSize              : 15,
    },
    icons : {
      fontSize              : 20,
      color                 :  CONST.color
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
    itemPiker_second : {
        borderWidth           : 0,
        borderColor           : '#FFF',
        borderBottomColor     : "#DDD" ,
        width                 : '100%',
        position              : 'relative',
        padding               : 10,
        height:40,
        fontSize              : 14,
        justifyContent: 'center',
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
        width               : "100%",
        marginLeft          : 0,
        marginRight         : 0,
        padding             : 0,
        marginTop           : 15
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
        color               : 'black',
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
        marginVertical           : 40,
        backgroundColor     :  CONST.color
    },
    Login : {
      fontFamily            : 'CairoRegular',
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      margin                : 25,
      color                 : "#444"
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
    textBtn : {
        textAlign           : 'center',
        color               : '#fff',
        fontSize            : 16,
        padding             : 0,
        fontFamily          : 'CairoRegular',
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
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
        color               : 'black',
        // borderRadius        : 5,
        borderColor         : '#e1e1e1',
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
        color               : "black"
    },
    iconPicker : {
        position            : 'absolute',
        right               : 5,
        color               : CONST.color,
        fontSize            : 16,
        top : 20
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



const mapStateToProps = ({ auth, lang ,profile }) => {
    return {
         auth       : auth.user,
         lang       : lang.lang,
         user       : profile.user,
         result     : profile.result,
         userId     : profile.user_id,
         Updated     : profile.updated,
    };
};
export default connect(mapStateToProps, {profile,updateProfile,logout,tempAuth})(EditProfile);
