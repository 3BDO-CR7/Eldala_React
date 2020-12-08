import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    AsyncStorage,
    I18nManager as RNI18nManager
} from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Title,
    Button,
    Icon,
    Header,

    Left,
    Body,
    Right,
    Toast
} from 'native-base'

import { LinearGradient } from 'expo';
import I18n from "ex-react-native-i18n";
import {Bubbles} from "react-native-loader";
import axios from "axios";
import {connect} from "react-redux";
import {profile, userLogin} from "../actions";
const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';

class NewPassword extends Component {


    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
            lang              : 'ar',
            password          : '',
            cf_password       : '',
            user_id           : '',
            code              : '',
            device_id         : '',
            key               : '',
            phone             : '',
            isLoaded          : false,
            spinner           : false
        };

    }
  componentWillMount() {

        this.setState({
            user_id            : this.props.navigation.state.params.user_id,
            key                : this.props.navigation.state.params.key,
            phone              : this.props.navigation.state.params.mobile,
            lang               : this.props.lang,
        })


  }

    componentWillReceiveProps(newProps){


        if (newProps.auth !== null && newProps.auth.value === '1'){

            this.setState({ user_id: newProps.auth.data.id });
            this.props.profile({user_id :newProps.auth.data.id});
            AsyncStorage.setItem('plusUserData', JSON.stringify(newProps.auth.data));
            this.props.navigation.navigate('home');

        }

        if (newProps.auth !== null) {

            Toast.show({
                text: newProps.auth.msg,
                duration : 2000  ,
                type : (newProps.auth.value === '1'  || newProps.auth.value === '2' )? "success" : "danger",
                textStyle: {  color: "white",
                    fontFamily : 'CairoRegular' ,
                    textAlign:'center'
                } });

        }

        this.setState({spinner: false,isLoaded: false});
    }

    sendData()
    {
        const err = this.validate();
        if (!err) {
            this.setState({isLoaded: true,spinner: true});

            axios.post(`${CONST.url}resetPassword`, {
                lang            : this.state.lang ,
                password            : this.state.password,
                code        : this.state.code,
                user_id         : this.state.user_id,
            })
                .then( (response)=> {

                        if(response.data.value === '1')
                        {
                            this.setState({isLoaded: true,spinner: true});

                            const {phone, password, device_id , key,lang} = this.state;
                            this.props.userLogin({ phone, password, device_id, key ,lang } );
                            this.props.profile({  user_id:  this.state.user_id });

                        }

                        Toast.show({
                        text: response.data.msg,
                        duration : 2000  ,
                        type : (response.data.value === '1' )? "success" : "danger",
                        textStyle: {  color: "white",   fontFamily : 'CairoRegular' , textAlign:'center'
                        } });

                }).catch( (error)=> {
                this.setState({spinner: false,isLoaded: false});

            }).then(()=>{
                this.setState({spinner: false,isLoaded: false});

            });
         }
    }




    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.code.length <= 0 ) {
            isError = true;
            msg = I18n.t('codeValidation');
        }else if(this.state.password.length < 6)
        {   isError = true;
            msg = I18n.t('passwordRequired');

        }else if(this.state.password !== this.state.cf_password)
        {   isError = true;
            msg = I18n.t('cf_passwordRequired');
        }

        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }
        return isError;
    };

    renderSubmit()
    {

        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center' , marginTop:50}}>
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

  render() {
    return (
      <Container>


          <Header style={styles.header}>

              <Body>
              <Title style={styles.headerTitle}>{I18n.translate('newPass')}</Title>

              </Body>
              <Right>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>


        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>
        <View style={styles.bgImage}>


            <KeyboardAvoidingView behavior="padding"    style={{  flex: 1}} >

            <View style={styles.bgDiv}>


                <Form>

                  <Item floatingLabel style={styles.item}>
                    <Icon style={styles.icon} active type="MaterialCommunityIcons" name='barcode-scan' />
                    <Label style={styles.label}>{I18n.translate('code')}</Label>
                    <Input style={styles.input}  onChangeText={(code) => this.setState({code})}  value={ this.state.code } />
                  </Item>
                  <Item floatingLabel style={styles.item}>
                    <Icon style={styles.icon} active type="SimpleLineIcons" name='lock' />
                    <Label style={styles.label}>{I18n.translate('password')}</Label>
                    <Input style={styles.input}  onChangeText={(password) => this.setState({password})}  value={ this.state.password } />
                  </Item>
                  <Item floatingLabel style={styles.item}>
                    <Icon style={styles.icon} active type="SimpleLineIcons" name='lock' />
                    <Label style={styles.label}>{I18n.translate('verifyNewPass')}</Label>
                    <Input style={styles.input}   onChangeText={(cf_password) => this.setState({cf_password})}  value={ this.state.cf_password }/>
                  </Item>

                    { this.renderSubmit() }

                </Form>



            </View>
            </KeyboardAvoidingView>

        </View>
        </ScrollView>
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
        height: 85
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
    bgImage : {
      flex                  : 1,
      justifyContent        : 'center',
    },
    logo : {
      transform           : [{ scale: 0.6 }],  
      alignItems          : 'center', 
      justifyContent      : 'center', 
      alignSelf           : 'center',
      margin              : 10,
        width : 150 ,
        height : 150,
        borderRadius :65,
    },
    bgDiv : {
      padding             : 10,
      width               : "85%",
      alignItems          : 'center', 
      justifyContent      : 'center', 
      alignSelf           : 'center',
      top                 : '50%',
      position            : 'absolute',
      transform           : [{ translateY : -260 }]
    },
    icon : {
      color                 : '#bbb',
      position              : 'absolute',
      left                  : 0,
      top                   : 10,
      alignItems            : 'center',
      justifyContent        : 'center',
      fontSize              : 20
    },
    bgLiner:{
      borderRadius          : 5,
      width                 : 170,
      alignItems            : 'center',
      justifyContent        : 'center', 
      alignSelf             : 'center',
      marginTop             : 40,
        backgroundColor: CONST.color
    },
    textBtn : {
        textAlign           : 'center',
        color               : '#fff',
        fontSize            : 16,
        padding             : 0,
        fontFamily          : 'CairoRegular',
    },
    item : {
        width               : "100%",
        marginLeft          : 0,
        marginRight         : 0,
        marginTop           : 15,
        padding             : 0,
    },
    label : {
        width               : "100%",
        color               : '#bbb', 
        borderWidth         : 0,
        padding             : 0,
        top                 : -10,
        fontFamily          : 'CairoRegular',
        textAlign           : 'left',
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
        fontFamily          : 'CairoRegular'
    },
    textFont : {
        alignItems          : 'center',
        justifyContent      : 'center', 
        alignSelf           : 'center',
        color               : '#bbb',
        fontSize            : 17,
        marginBottom        : 20,
        textAlign           : 'center',
        fontFamily          : 'CairoRegular'
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
    }
});


const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(NewPassword);

