import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    AsyncStorage,
    ScrollView, I18nManager as RNI18nManager,
    Picker, ActivityIndicator,
} from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Icon,
    Toast,
    Title,
    Button,
    Header,
    Left, Body, Right
} from 'native-base'
import {connect}         from "react-redux";
import { userLogin,profile,tempAuth,logout} from "../actions";
import I18n from "ex-react-native-i18n";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Spinner      from "react-native-loading-spinner-overlay";
import axios        from 'axios';
import {Bubbles}    from "react-native-loader";
import {NavigationEvents} from "react-navigation";
const  base_url     = 'http://plus.4hoste.com/api/';
import CONST from '../consts';

class Login extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
            lang      : this.props.lang,
            phone     : '',
            password  : '',
            token     : null,
            key       : null,
            codes     : [],
            isLoaded  : false,
            spinner: true
        };
    }

    validate = () => {
        let isError = false;
        let msg = '';
        console.warn(this.state.phone.length);

        if (this.state.phone.length <= 0 || this.state.phone.length < 9) {
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

    onValueChange(value) {
        this.setState({key : value});
    }

    async componentWillMount() {

        axios.post(`${CONST.url}codes`, { lang: this.props.lang  })
            .then( (response)=> {
                this.setState({codes: response.data.data});
                this.setState({key: response.data.data[0]});
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });

        RNI18nManager.forceRTL(true);

        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        let token = await Notifications.getExpoPushTokenAsync();

        this.setState({ token : token });
        AsyncStorage.setItem('deviceID', token);

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

                <Button  onPress={() => this.onLoginPressed()} style={styles.bgLiner}>
                    <Text style={styles.textBtn}>{I18n.translate('signIn')}</Text>
                </Button>

        );
    }

    componentWillReceiveProps(newProps){


        if( newProps.result === 2)
        {

            this.props.navigation.navigate('Confirmation_Page',{
                user_id : newProps.userId
            })
        }else{
            if (newProps.auth !== null && newProps.auth.value === '1'){

                this.setState({ user_id: newProps.auth.data.id });
                this.props.profile({user_id :newProps.auth.data.id , lang : this.props.lang});
                AsyncStorage.setItem('plusUserData', JSON.stringify(newProps.auth.data));
                this.props.navigation.navigate('home');

            }else if(newProps.auth !== null && newProps.auth.value === '2')
            {

                this.props.navigation.navigate('Confirmation',
                    {
                        phone: this.state.phone,
                        key : this.state.key,
                        password: this.state.password,
                        user_id :this.props.userId
                    });
            }else{
            }

            if (newProps.auth !== null) {

                if(newProps.auth.value === '0'){
                    this.props.logout({ token: null });
                    this.props.tempAuth();
                }
                Toast.show({
                    text: newProps.auth.msg,
                    duration : 2000  ,
                    type : (newProps.auth.value === '1'  || newProps.auth.value === '2' )? "success" : "danger",
                    textStyle: {  color: "white",
                        fontFamily : 'CairoRegular' ,
                        textAlign:'center'
                    } });

            }

        }




        this.setState({ isLoaded: false });
    }

    onLoginPressed() {

        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            const {phone, password, token , key,lang} = this.state;
            this.props.userLogin({ phone, password, token, key ,lang } );
        }
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
      return <Container>

          <NavigationEvents onWillFocus={() => this.onFocus()} />
          {this.renderLoader()}

          <Header style={styles.header}>
              <Body>
                <Title style={[ styles.headerTitle, { paddingHorizontal : 10 } ]}>{I18n.translate('signIn')}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

          <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>
              <View style={styles.bgImage}>
                  <View style={styles.bgDiv}>

                      <KeyboardAvoidingView behavior="padding" style={{  flex: 1}} >

                      <Form>

                          <View style={{flexDirection: 'row', width : '100%'}}>

                              <View style={{ flexBasis:'75%' }}>
                                  <Item  floatingLabel style={styles.item} >
                                      <Icon style={styles.icon} active type="SimpleLineIcons" name='phone' />
                                      <Label style={styles.label}>{ I18n.translate('phone')}</Label>
                                      <Input style={styles.input}  keyboardType={'number-pad'} placeholderTextColor="#bbb" onChangeText={(phone) => this.setState({phone})}  value={ this.state.mobile }    />
                                  </Item>
                              </View>
                              <View style={[ styles.position_R , { height : 50 , paddingHorizontal : 0, top : 20, flexBasis : '25%', borderWidth : 1, borderColor : '#DDD' }]} regular>
                                  <Picker
                                      mode               ="dropdown"
                                      style              ={{ color: '#9a9a9a',backgroundColor:'transparent' }}
                                      iosHeader= {I18n.translate('keyCountry')}
                                      headerBackButtonText={I18n.translate('goBack')}
                                      selectedValue       ={this.state.key}
                                      onValueChange      ={this.onValueChange.bind(this)}
                                      placeholderStyle={{ color: "#444", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 12 }}
                                      textStyle={{ color: "#444",fontFamily : 'CairoRegular', writingDirection: 'rtl',paddingLeft : 5, paddingRight: 5 }}
                                      itemTextStyle={{ color: '#444',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                  >

                                      {
                                          this.state.codes.map((code, i) => {
                                              return <Picker.Item   style={{color: "#444"}}  key={i} value={code} label={code} />
                                          })
                                      }

                                  </Picker>

                                  <Icon style={[ styles.position_A, { top : 18, right: 4, fontSize : 12 } ]} name='down' type="AntDesign" />

                              </View>
                          </View>

                              <Item floatingLabel style={styles.item}>
                                  <Icon style={styles.icon} active type="SimpleLineIcons" name='lock'/>
                                  <Label style={styles.label}>{I18n.translate('password')}</Label>
                                  <Input autoCapitalize='none' value={ this.state.password } onChangeText={(password) => this.setState({password})} secureTextEntry style={styles.input}/>
                              </Item>


                          <TouchableOpacity onPress={() => this.props.navigation.navigate('forgetpassword')}>
                              <Text style={styles.textFont}>{I18n.translate('forgetPass')}</Text>
                          </TouchableOpacity>


                          { this.renderSubmit() }

                          <TouchableOpacity onPress={() => this.props.navigation.navigate('register')}>
                              <Text style={styles.textFont}>
                                  {I18n.translate('newAccount')}
                              </Text>
                          </TouchableOpacity>

                      </Form>
                      </KeyboardAvoidingView>
                  </View>
              </View>
          </ScrollView>

      </Container>;
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
        borderColor           : "transparent",
        height                : 85
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

    },
    logo : {
      alignItems          : 'center',
      justifyContent      : 'center',
      alignSelf           : 'center',
        width : 100 ,
        height : 100,
      marginVertical           : 20,
    },
    bgDiv : {

      width               : "85%",
      justifyContent      : 'center',
      alignSelf           : 'center',
    },
    icon : {
      color                 : '#bbb',
      position              : 'absolute',
      left                  : 0,
      top                   : 10,
      alignItems            : 'center',
      justifyContent        : 'center',
      fontSize              : 16
    },
    item : {
      width               : "100%",
      marginLeft          : 0,
      marginRight         : 0,
      marginTop           : 15,
      padding             : 0,
      height:              55
    },

    label : {
      width               : "100%",
      color               : '#bbb',
      borderWidth         : 0,
      padding             : 0,
      top                 : -10,
      fontFamily          : 'CairoRegular',
      textAlign           : "left"
    },
    width_100 : {
        width               : 100
    },
    right_0 : {
        right                     : 0
    },
    top_20 : {
        top                     : 20
    },
    input : {
      borderColor         : '#e2b705',
      borderWidth         : 0,
      borderRadius        : 10,
      width               : "100%",
      color               : '#bbb',
      padding             : 0,
      textAlign           : 'right',
      paddingLeft         : 30
    },
    position_A : {
        position                : 'absolute',
        zIndex                  : 9999
    },
    position_R : {
        position                : 'relative',
        zIndex                  : 999
    },
    bgLiner:{
      borderRadius        : 5,
      width               : 170,
      alignItems          : 'center',
      justifyContent      : 'center',
      alignSelf           : 'center',
        backgroundColor:  CONST.color
    },
    textBtn : {
      textAlign           : 'center',
      color               : '#fff',
      fontSize            : 16,
      padding             : 0,
      fontFamily          : 'CairoRegular'
    },
    textFont : {
      alignItems          : 'center',
      justifyContent      : 'center',
      alignSelf           : 'center',
      color               : '#bbb',
      fontSize            : 14,
      margin              : 30,
      fontFamily          : 'CairoRegular'
    },
    itemPiker : {
        borderWidth           : 0,
        borderColor           : '#FFF',
        borderBottomColor     : "#DDD" ,
        width                 : '90%',
        position              : 'relative',
        padding               : 10,
        fontSize              : 14,
        justifyContent        : 'center',
        fontFamily            : 'CairoRegular',
    },
    Picker : {

        writingDirection      : 'rtl',
        borderWidth           : 0,
        paddingLeft           : 0,
        fontSize              : 14,
        fontFamily            : 'CairoRegular',

    },
    headerTitle:{
      color                 : '#444',
      fontFamily            : 'CairoRegular',
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


const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth     : auth.user,
        lang     : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, {logout, tempAuth, userLogin ,profile})(Login);
