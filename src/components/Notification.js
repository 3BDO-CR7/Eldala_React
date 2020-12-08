import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    I18nManager,
    AsyncStorage,
    TouchableOpacity,
    Alert,
    I18nManager as RNI18nManager,
    Picker, ActivityIndicator,
} from 'react-native';
import {Container, Content, Header, Left, Body, Right, Button, Icon, Title, Toast,} from 'native-base';

import Tabs from './Tabs';
import I18n from "ex-react-native-i18n";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from "react-redux";
import {profile} from "../actions";
const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";

class Notification extends Component {


    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state  = {
             notifications : [],
             user_id: this.props.auth.data.id,
             spinner: true,
             lang: this.props.lang,
             en_message   : 'please complete all required data',
             ar_message   : 'برجآء تأكد من إدخال جميع البيانات'
         };


    }

  componentWillMount() {

     this.props.profile({  user_id: this.props.auth.data.id  });

      axios.post(`${CONST.url}notifications`, { lang: this.props.lang, user_id : this.state.user_id })
          .then( (response)=> {
              this.setState({notifications: response.data.data});
          })
          .catch( (error)=> {
              this.setState({spinner: false});
          }).then(()=>{
          this.setState({spinner: false});
      });
  }


    delete(id,i) {


        Alert.alert(
            `${I18n.currentLocale() === 'en' ? 'Delete Notification' : 'حذف الإشعار'}`,
            `${I18n.currentLocale() === 'en' ? 'want to delete notification ?' : 'هل تريد حذف الإشعار ؟'}`,
            [
                {
                    text: `${I18n.currentLocale() === 'en' ? 'remove' : 'حذف'}`,
                    onPress: () => {
                        this.setState({spinner: true});

                        axios.post(`${CONST.url}deleteNotificaion`, { lang: this.props.lang, id : id  })
                            .then( (response)=> {

                                if(response.data.value === '1'){
                                    this.state.notifications.splice(i,1);
                                    Toast.show({ text: response.data.msg, duration : 2000 ,type:'success' ,textStyle: { color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                                }
                            })
                            .catch( (error)=> {
                                console.warn(error);
                                //Toast.show({ text: error.message, duration : 2000  ,textStyle: { color: "yellow",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                                this.setState({spinner: false});
                            }).then(()=>{
                            this.setState({spinner: false});
                        });
                    }
                },
                {
                    text: `${I18n.currentLocale() === 'en' ? 'Cancel' : 'إلغاء'}`,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                }
            ],
            {cancelable: false},
       );
    }

    noResults()
    {
        return ( <View><Text style={{marginTop:'50%',textAlign:'center',color:'#ff6649', fontSize:22,fontFamily:'CairoRegular'}}>{I18n.translate('no_results')}</Text></View>);
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

          <Header style={styles.header}>
              <Body>
              <Title style={[ styles.text, { paddingHorizontal : 20 } ]}>{I18n.translate('notifications')}</Title>

              </Body>
              <Right>
                  <Button transparent onPress={() => this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>


          <Content>


              {
                  this.state.notifications.map((notification, i) => {
                  return (
                      <View style={styles.chat}>
                          <View style={styles.image}>
                              <Image style={styles.imgUser} source={{uri:notification.img}}/>
                          </View>

                          <View style={styles.textContent} >
                              <TouchableOpacity onPress={()=> this.delete(notification.id , i)}>
                                  <Icon type="Entypo" name="trash" style={{fontSize:22,color:'#ff514d'}}/>
                              </TouchableOpacity>

                              {
                                  notification.type  === 2 ?
                                      <View>
                                          <TouchableOpacity
                                              onPress={() => { this.props.navigation.navigate(
                                                  {
                                                      routeName: 'details',
                                                      params: {
                                                          blog_id: notification.blog,
                                                      },
                                                      key: 'APage' + i
                                                  }
                                              ) } }>
                                              <Text style={[ styles.text , styles.info ]} numberOfLines = { 1 } ellipsizeMode = 'head'>{notification.msg}</Text>
                                              <Text  style={styles.delete}>{notification.date}</Text>
                                          </TouchableOpacity>
                                      </View>
                                      :
                                      notification.type === 1 ?
                                          <View>
                                              <TouchableOpacity onPress={()=>{
                                                  this.props.navigation.navigate('chatroom' , {
                                                     other : notification.other,
                                                     room  : notification.room
                                                  })
                                              }}>
                                                  <Text style={[ styles.text , styles.info ]} numberOfLines = { 1 } ellipsizeMode = 'head'>{notification.msg}</Text>
                                                  <Text  style={styles.delete}>{notification.date}</Text>
                                              </TouchableOpacity>
                                          </View>:
                                          <View>
                                              <TouchableOpacity>
                                                  <Text style={[ styles.text , styles.info ]} numberOfLines = { 1 } ellipsizeMode = 'head'>{notification.msg}</Text>
                                                  <Text  style={styles.delete}>{notification.date}</Text>
                                              </TouchableOpacity>
                                          </View>
                              }


                          </View>
                      </View>
                      )
              })}


              { (this.state.notifications.length === 0 && this.state.spinner === false) ? this.noResults() : null}

          </Content>

        <Tabs navigation={this.props.navigation}/>

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
    },
    icons : {
      fontSize              : 20,
      color                 : CONST.color
    },
    Btn : {
      borderRadius           : 100,
      width                  : 35,
      height                 : 35,
      textAlign              : 'center',
      backgroundColor        : "#fff",
      paddingTop             : 2,
    },
    Btn_Icon : {
      color                  :CONST.color,
      fontSize               : 30,
      textAlign              : 'center'
    },
    chat : {
        margin               : 10,
        flexDirection        : 'row',
        justifyContent       : 'space-between',
    },
    image : {
        width                : '15%',
        marginTop            : 15,
        marginLeft           : -5
    },
    imgUser : {
        width                : 45,
        height               : 45,
        borderRadius         : 5,
    },
    textContent : {
        borderWidth          : 1,
        borderColor          : '#DDD',
        borderRadius         : 10,
        padding              : 10,
        width                : '85%',
    },
    info : {
        textAlign            : 'left'
    },
    time : {
        marginTop            : 10
    },
    delete : {

      top: 1,
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
export default connect(mapStateToProps,{profile})(Notification);




