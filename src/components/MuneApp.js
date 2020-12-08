import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    TouchableOpacity,
    Switch,
    Linking,
    AsyncStorage,
    I18nManager as RNI18nManager,
    Picker,
} from 'react-native';
import {Container, Right, Body, Content, Left, Button, Icon, Title, Item, Header, Toast} from 'native-base';
import I18n   from 'ex-react-native-i18n';
import Spinner from "react-native-loading-spinner-overlay";
import axios   from 'axios';
import { connect } from 'react-redux';

// const  base_url = 'http://plus.4hoste.com/api/';
import { userLogin, profile ,logout ,tempAuth} from '../actions'
import CONST from '../consts';

class MuneApp extends Component {


  constructor(props) {
      super(props);
      RNI18nManager.forceRTL(true);

      this.state    = {
          selected : 1,
          cities   : [],
          spinner  : false,
          country  :  1,
          youtube  : '',
          twitter  : '',
          facebook : '',
          lang     : this.props.lang,
          isLogin  : false,
          instgram : '',
          SwitchOnValueHolder: false
      };


  }

    componentWillMount() {


        AsyncStorage.getItem('plusCountryId')

            .then((value) => {
                if (value !== null && value !== undefined)
                {
                    this.setState({country_id :  value});
                }
            });




        if(this.props.user)
        {

            this.props.profile({  user_id: this.props.auth.data.id ,lang :this.props.lang });
            if(this.props.user.mute ==  1)
            {
                this.setState({SwitchOnValueHolder :true})
            }
        }
        if(this.props.user)
        {
            this.setState({country: this.props.user.country_id,country_id: this.props.user.country_id});

            if(this.props.user.mute == 1)
            {
                this.setState({SwitchOnValueHolder : true})
            }else{
                this.setState({SwitchOnValueHolder : false})
            }

        }


        this.setState({spinner: true});
        axios.post(`${CONST.url}countries`, { lang: this.props.lang, country_id : this.state.country })
            .then( (response)=> {
                this.setState({cities: response.data.data});

                axios.post(`${CONST.url}followUs`, { lang: this.props.lang , country_id :  this.state.country })
                    .then( (response)=> {

                        this.setState({facebook: response.data.data.facebook,twitter: response.data.data.twitter,instgram: response.data.data.instgram,youtube: response.data.data.youtube});

                    })
                    .catch( (error)=> {
                        this.setState({spinner: false});
                    }).then(()=>{
                    this.setState({spinner: false});
                });
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });

    }






    ShowAlert = (value) =>{

        axios.post(`${CONST.url}muteNotification`, { lang: this.props.lang , user_id :  this.props.user.id })
            .then( (response)=> {

                Toast.show({ text: response.data.msg, duration : 2000 ,type:'success',textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' }});


                if(this.state.SwitchOnValueHolder === true)
                {
                 this.setState({SwitchOnValueHolder : false})
                }else{
                    this.setState({SwitchOnValueHolder : true})
                }

                //this.props.profile({  user_id: this.props.user.id ,lang :  this.props.lang });

            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });


  };


     onValueChange2(value) {

        this.setState({country     : value });
        AsyncStorage.setItem('plusCountryId', JSON.stringify(value));
    }

    render() {
    return (
      <Container>
          <Header style={styles.header}>

              <Body>
              <Title style={[ styles.headerTitle, { paddingHorizontal : 20 } ]}>{I18n.translate('settings')}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={()=> this.props.navigation.navigate('home')} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

          <Content>

            <View style={styles.user_info}>


                <Button style={styles.btn_click}>
                    <Text style={styles.btn_text} onPress={() => {
                        (this.props.user) ? this.props.navigation.navigate('profile') : this.props.navigation.navigate('login');
                    }}>{ (this.props.user) ?   I18n.translate('profile') : I18n.translate('signIn')  }</Text>
                </Button>


            </View>

                {
                    ( this.props.user ) ?
                        <View style={styles.block_section}>
                            <View style={styles.MainContainer}>
                                 <Text style={styles.text_switch}> { I18n.translate('notifications') }</Text>
                                 <Switch  onValueChange={(value) => this.ShowAlert(value)} style={styles.switch} value={this.state.SwitchOnValueHolder} />
                            </View>
                        </View>
                    :  <View/>
                }



            <View style={styles.block_section}>
                 <View style={styles.blocking}>


                     <TouchableOpacity  onPress={() => {(this.props.auth) ? this.props.navigation.navigate('favorite') : this.props.navigation.navigate('login')}}>
                         <View style={styles.block_item}>
                                <View style={[styles.icon_style , styles.bink]}>
                                    <Icon style={[styles.icon , styles.conter]} type="Feather" name='heart' />
                                </View>
                                <Text style={styles.text_enemy}>{I18n.translate('fav')}</Text>
                         </View>
                     </TouchableOpacity>

                     <TouchableOpacity   onPress={() => {(this.props.user) ? this.props.navigation.navigate('watchLater') : this.props.navigation.navigate('login')}}>
                         <View style={styles.block_item}>
                             <View  style={[styles.icon_style , styles.green]}>
                                 <Icon style={[styles.icon , styles.conter]} type="Feather" name='clock' />
                             </View>
                             <Text style={styles.text_enemy}>{I18n.translate('last-seen')}</Text>
                         </View>
                     </TouchableOpacity>


                     <TouchableOpacity  onPress={() => {(this.props.user) ? this.props.navigation.navigate('MyAds') : this.props.navigation.navigate('login')}} >
                         <View style={styles.block_item}>
                            <View style={[styles.icon_style , styles.blue]}>
                              <Icon style={[styles.icon , styles.conter]} type="FontAwesome" name='user-secret' />
                            </View>
                            <Text style={styles.text_enemy}>{I18n.translate('mine')}</Text>
                        </View>
                     </TouchableOpacity>
                </View>
            </View>




            <View style={styles.block_section}>
                <Item onPress={() => this.props.navigation.navigate('home')} style={styles.move}>
                    <Icon style={styles.icon} type="Feather" name='chevron-left' />
                    <View style={styles.block_up}>
                        <Text style={styles.text_enemy}>{I18n.translate('home')}</Text>
                        <Icon style={styles.icon_up} type="Feather" name='home' />
                    </View>
                </Item>
                <Item onPress={() => this.props.navigation.navigate('about')} style={styles.move}>
                    <Icon style={styles.icon} type="Feather" name='chevron-left' />
                    <View style={styles.block_up}>
                        <Text style={styles.text_enemy}>{I18n.translate('aboutApp')}</Text>
                        <Icon style={styles.icon_up} type="Feather" name='info' />
                    </View>
                </Item>
                <Item onPress={() => this.props.navigation.navigate('terms')} style={styles.move}>
                    <Icon style={styles.icon} type="Feather" name='chevron-left' />
                    <View style={styles.block_up}>
                        <Text style={styles.text_enemy}>{I18n.translate('terms')}</Text>
                        <Icon style={styles.icon_up} type="Feather" name='list' />
                    </View>
                </Item>



                        <Item onPress={() => this.props.navigation.navigate('AboutCommission')} style={styles.move}>
                            <Icon style={styles.icon} type="Feather" name='chevron-left' />
                            <View style={styles.block_up}>
                                <Text style={styles.text_enemy}>{I18n.translate('commission_about')}</Text>
                                <Icon style={styles.icon_up} type="Feather" name='dollar-sign' />
                            </View>
                        </Item>





                 {

                    (this.props.user) ?

                        <Item onPress={() => this.props.navigation.navigate('commission')} style={styles.move}>
                            <Icon style={styles.icon} type="Feather" name='chevron-left' />
                            <View style={styles.block_up}>
                                <Text style={styles.text_enemy}>{I18n.translate('commission')}</Text>
                                <Icon style={styles.icon_up} type="Feather" name='dollar-sign' />
                            </View>
                        </Item>

                        : <View/>

                }



                      <Item onPress={() => this.props.navigation.navigate('contact')} style={styles.move}>
                            <Icon style={styles.icon} type="Feather" name='chevron-left' />
                            <View style={styles.block_up}>
                                <Text style={styles.text_enemy}>{I18n.translate('help')}</Text>
                                <Icon style={styles.icon_up} type="Feather" name='help-circle' />
                            </View>
                      </Item>







              {
                    (this.props.user) ?

                        <Item onPress={() => {

                            this.props.logout({ token: this.props.auth.data.id })
                            this.props.tempAuth();

                        }} style={styles.move}>
                            <Icon style={styles.icon} type="Feather" name='chevron-left' />
                            <View style={styles.block_up}>
                                <Text style={styles.text_enemy}>{I18n.translate('logOut')}</Text>
                                <Icon style={styles.icon_up} type="Feather" name='log-out' />
                            </View>
                        </Item>

                        : <View/>
                }


            </View>

            <View style={styles.block_section}>
                <Text style={styles.text_up}>{I18n.translate('follow_us')}</Text>
                <View style={styles.blocking}>

                    <View style={styles.block_item}>
                        <TouchableOpacity  onPress={() => { Linking.openURL(this.state.facebook ) } } >
                            <View  style={[styles.icon_style , styles.social]}>
                          <Icon style={[styles.icon , styles.conter]} type="Feather" name='facebook' />
                        </View>
                        </TouchableOpacity>
                        <Text style={styles.text_enemy}>{I18n.translate('facebook')}</Text>
                    </View>

                    <View style={styles.block_item}>
                        <TouchableOpacity  onPress={() => { Linking.openURL(this.state.twitter ) } } >
                            <View  style={[styles.icon_style , styles.social]}>
                          <Icon style={[styles.icon , styles.conter]} type="Feather" name='twitter' />
                        </View>
                        </TouchableOpacity>
                        <Text style={styles.text_enemy}>{I18n.translate('twitter')}</Text>
                    </View>
                    <View style={styles.block_item}>
                        <TouchableOpacity  onPress={() => { Linking.openURL(this.state.instgram ) } }>
                            <View   style={[styles.icon_style , styles.social]}>
                                <Icon style={[styles.icon , styles.conter]} type="Feather" name='instagram' />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.text_enemy}>{I18n.translate('instgram')}</Text>
                    </View>
                    <View style={styles.block_item}>
                        <TouchableOpacity  onPress={() => { Linking.openURL(`${this.state.youtube}`) } } >
                            <View      style={[styles.icon_style , styles.social]}>
                                <Icon style={[styles.icon , styles.conter]} type="Feather" name='youtube' />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.text_enemy}>{I18n.translate('youtube')}</Text>
                    </View>
                </View>
            </View>

        </Content>
      </Container>
    );
  }

    componentWillReceiveProps(newProps){
        if(newProps.logout == 1)
        {
            console.log('my new props' , newProps)
            this.props.navigation.navigate('home');
        }
    }
}



const styles = StyleSheet.create({
    header : {
      backgroundColor       : "transparent",
      height : 85,
      textAlign             : 'center',
      borderWidth           : 1,
    },
    texts : {
      fontFamily            : 'CairoRegular',
      color                 : '#444',
      marginTop             : 7,
      fontSize              : 15,
    },
    icons : {
      fontSize              : 20,
      color                 :  CONST.color
    },
    user_info : {
        marginTop             : 10,
        backgroundColor       : CONST.color,
        padding               : 20,
        justifyContent        : 'center',
    },
    text : {
        textAlign              : 'center',
        color                 : '#FFF',
        fontFamily            : 'CairoRegular',
    },
    btn_click : {
        textAlign             : "center",
        alignItems            : 'center',
        alignSelf             : 'center',
        width                 : 130,
        margin                : 10,
        backgroundColor       : '#fff'
    },
    btn_text : {
        color                 : '#444',
        textAlign             : 'center',
        fontFamily            : 'CairoRegular',
        width                 : '100%',
    },
    block_section : {
        margin                : 15,
        padding               : 10,
        borderRadius          : 5,
        backgroundColor       : '#fff',
        shadowColor           : '#444',
        shadowOffset          : { width: 0 , height : 0 },
        shadowOpacity         : 0.2,
        elevation             : 5,
    },
    select : {
        width                 : '100%',
        display               : 'flex',
        alignItems            : 'center',
        justifyContent        : 'space-between',
        alignSelf             : 'center',
    },
    picker : {
        width                 : '100%',
        display               : 'flex',
        alignItems            : 'center',
        justifyContent        : 'space-between',
        alignSelf             : 'center',
    },
    MainContainer :{
        flexDirection         : 'row',
        justifyContent        : 'space-between',
        flex                  : 1,
        margin                : 10
    },
    text_switch : {
      fontFamily              : 'CairoRegular',
       marginTop               : 1
    },
    blocking : {
      flexDirection           : 'row-reverse',
      justifyContent          : 'space-between',
    },
    text_up : {
      alignItems              : 'center',
      justifyContent          : 'center',
      alignSelf               : 'center',
      fontFamily              : 'CairoRegular',
      fontSize                : 18,
    },
    block_item : {
      alignItems              : 'center',
      justifyContent          : 'center',
      alignSelf               : 'center',
      margin                  : 10
    },
    icon_style : {
      borderRadius            : 100,
      width                   : 40,
      height                  : 40,
      textAlign               : 'center',
      margin                  : 10
    },
    icon : {
      color                   : '#444',
      fontSize                : 20,
      alignItems              : 'center',
      justifyContent          : 'center',
      alignSelf               : 'center',
      marginTop               : 7,
      marginRight             : -10,
    },
    conter : {
      marginTop               : 10,
      marginRight             : 0,
    },
    green : {
      backgroundColor         : "#dffaf5",
    },
    bink : {
      backgroundColor         : "#f9d8de",
    },
    blue : {
      backgroundColor         : "#ecf3f6",
    },
    text_enemy : {
      fontFamily              : 'CairoRegular',
    },
    social : {
      backgroundColor         : '#f5f5f5'
    },
    move : {
      flexDirection           : 'row-reverse',
      justifyContent          : 'space-between',
      borderBottomWidth       : 1,
      borderBottomColor       : "#DDD",
      paddingTop              : 10,
      paddingBottom           : 10,
      paddingRight            : 5,
      paddingLeft             : 5
    },
    block_up : {
      flexDirection           : 'row-reverse',
      marginTop               : 8,
      overflow                : 'hidden'
    },
    icon_up : {
      marginTop               : 3,
      marginRight             : 5,
      color                   : '#444',
      fontSize                : 20,
    },
    Picker : {
      width                 : '100%',
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
      width                 : '100%',
      position              : 'relative',
      padding               : 5,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      fontSize              : 14,
      fontFamily            : 'CairoRegular',
    },
    iconPicker : {
      position              : 'absolute',
      right                 : 0
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
        textAlign             : 'center'
    }
});

const mapStateToProps = ({ auth, lang ,profile }) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user
    };
};
export default connect(mapStateToProps, { userLogin ,profile,logout,tempAuth})(MuneApp);
