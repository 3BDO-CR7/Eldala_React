import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Image,
    KeyboardAvoidingView, I18nManager as RNI18nManager, ActivityIndicator
} from 'react-native';
import {Container, Content, Form, Item, Input, Label, Icon, Title, Button, Toast} from 'native-base'

import { LinearGradient } from 'expo';
import I18n from "ex-react-native-i18n";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
const  base_url = 'http://plus.4hoste.com/api/';
import { connect } from 'react-redux';
import { userLogin, profile } from '../actions'
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";

class Confirmation extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state  = {
            user_id         : null,
            en_message      : 'please make sure to enter the activation code',
            ar_message      : 'برجآء تأكد من إدخال كود التفعيل',
            code            : null,
            lang            : this.props.lang,
            spinner         : false
        };
    }

    componentWillMount() {

    }

    sendData() {

        this.setState({lang : this.props.lang});

        if(this.state.code == null ) {
            Toast.show({
                text: ( this.state.lang === 'en' ? this.state.en_message : this.state.ar_message),
                duration : 2000 ,
                type :'danger',
                textStyle: {
                    color: "white",
                    fontFamily : 'CairoRegular',
                    textAlign:'center'
                }
            });
        }else{

           this.setState({spinner: true});

            axios.post(`${CONST.url}activateAccount`, {
                lang: this.props.lang ,
                code : this.state.code ,
                user_id :this.props.navigation.state.params.user_id
            }).then( (response)=> {
                    this.setData(response);
                }).catch( (error)=> {
                    this.setState({spinner: false});
                }).then(()=>{
            }).then(()=>{
                this.setState({spinner: false});
            });

       }
    }

    setData(response) {

        if(response.data.value === '1') {
            Toast.show({
                text: response.data.msg,
                duration : 2000 ,
                type : 'success' ,
                textStyle: {
                    color: "white",
                    fontFamily : 'CairoRegular' ,
                    textAlign:'center'
                }
            });
           this.props.userLogin({  phone : this.props.navigation.state.params.phone , password : this.props.navigation.state.params.password , device_id:'123' ,key: this.props.navigation.state.params.key,lang:this.state.lang});
           this.props.profile({user_id :this.props.navigation.state.params.user_id });
           AsyncStorage.setItem('plusUserData', JSON.stringify(response.data.data));

        }else{
            Toast.show({
                text: response.data.msg,
                duration : 2000 ,
                type : 'danger' ,
                textStyle: {
                    color: "white",
                    fontFamily : 'CairoRegular',
                    textAlign:'center'
                }
            });
            this.setState({spinner: false});
        }
    }


    componentWillReceiveProps(newProps){
        if(newProps.auth ) {
            this.props.navigation.navigate('home');
            this.setState({spinner: false});
        }else{
            this.setState({spinner: false});
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
        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />
                {this.renderLoader()}

                <View style={styles.header}>
                    <View>
                        <Title style={[ styles.text , {  paddingHorizontal : 20 } ]}>{I18n.translate('insert_code')}</Title>
                    </View>
                    <View>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </View>
                </View>

                <Content contentContainerStyle={{ flexGrow: 1 }}>
                    <KeyboardAvoidingView behavior="padding" enabled  style={{flex:1}}>


                    <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>


                    <View style={styles.bgDiv}>
                        <Form>

                            <Item floatingLabel style={styles.item}  error={ this.state.code === '' ? true : false} success={ this.state.code !== ''  && this.state.code !== null ? true : false}>
                                <Icon style={styles.icon} active type="FontAwesome" name='key' />
                                <Label style={styles.label}>{I18n.translate('code')}</Label>
                                <Input style={styles.input} keyboardType={'number-pad'}  value={ this.state.code} onChangeText={(code)=> this.setState({code})} />
                            </Item>


                            <Button  onPress={() => this.sendData()} style={styles.bgLiner}>
                                <Text style={styles.textBtn}>{I18n.translate('confirm')}</Text>
                            </Button>

                        </Form>
                    </View>
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
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        marginVertical              : 20,
        width : 100 ,
        height : 100,
    },
    bgDiv : {
        padding               : 10,
        width                 : "85%",
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        top                   : '50%',
        position              : 'absolute',
        transform             : [{ translateY : -150 }]
    },
    icon : {
        color                 : '#bbb',
        position              : 'absolute',
        left                  : 0,
        top                   : 12,
        alignItems            : 'center',
        justifyContent        : 'center',
        fontSize              : 18
    },
    item : {
        width               : "100%",
        marginLeft          : 0,
        marginRight         : 0,
        marginTop           : 15,
        padding             : 0,
        fontFamily          : 'CairoRegular'
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
    input : {
        borderColor         : '#e2b705',
        borderWidth         : 0,
        borderRadius        : 10,
        width               : "100%",
        color               : '#bbb',
        padding             : 0,
        textAlign           : 'right',
        paddingLeft         : 33,
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
    bgLiner:{
        borderRadius          : 5,
        width                 : 170,
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        marginTop             : 40,
        backgroundColor:   CONST.color
    },
    textBtn : {
        textAlign           : 'center',
        color               : '#fff',
        fontSize            : 16,
        padding             : 7,
        fontFamily          : 'CairoRegular',
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




const mapStateToProps = ({ auth, lang }) => {

    return {

        auth   : auth.user,
        lang   : lang.lang
    };
};
export default connect(mapStateToProps, { userLogin ,profile })(Confirmation);


