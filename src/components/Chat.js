import React, { Component } from 'react';
import {StyleSheet, Text, Image, View, I18nManager, TouchableOpacity, ActivityIndicator,} from 'react-native';
import  { Container, Content, Header, Left, Body, Right, Button, Icon, Title,} from 'native-base';
import Tabs from './Tabs';
import {connect} from "react-redux";
import {profile} from "../actions";
import I18n from "ex-react-native-i18n";
import axios from "axios";
 import {NavigationEvents} from "react-navigation";
import CONST from '../consts';

class Chat extends Component {
    constructor(props) {
        super(props);
        I18nManager.forceRTL(true);
        this.state = {
            conversations   : [],
            spinner         : true,
            lang            : this.props.lang
        };

    }

    async componentWillMount() {

      axios.post(`${CONST.url}conversations`, { lang: this.state.lang , user_id : this.props.auth.data.id })
          .then( (response)=> {
              this.setState({conversations: response.data.data});
          }).catch( (error)=> {
              console.warn(error);
              this.setState({spinner: false});
          }) .then( ()=> {
          this.setState({spinner: false});
      })

    }

    onFocus() {
        this.componentWillMount();
    }

    goRoom(other,room) {
         this.props.navigation.navigate('chatroom' , {other, room})
    }

    noResults() {
        return ( <View><Text style={{marginTop:'50%',textAlign:'center',color:'#ff6649', fontSize:22,fontFamily:'CairoRegular'}}>{I18n.translate('no_results')}</Text></View>);
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

          <Header style={styles.header} >
              <Left>
                  <Button transparent onPress={() => this.props.navigation.navigate('mune')}>
                      <Icon style={styles.icons} type="Octicons" name='three-bars' />
                  </Button>
              </Left>
              <Body>
                <Title style={[ styles.headerTitle, { paddingHorizontal : 20 } ]}>{I18n.translate('chat')}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={() => this.props.navigation.navigate('notification')}>
                      {
                          (this.props.auth) ?
                              <Icon style={styles.icons} type="Ionicons" name='md-notifications-outline' />

                              :
                              <View/>
                      }
                  </Button>
              </Right>
          </Header>
        <Content>


            { (this.state.conversations.length === 0 && this.state.spinner === false) ? this.noResults() : null}

            {
                this.state.conversations.map((chat, i) => {
                    return (
                        <TouchableOpacity onPress={() => {this.goRoom(chat.other,chat.room)}}>

                        <View key={i} style={styles.chat}>
                            <View style={styles.image}>
                                <Image style={styles.imgUser} source={{uri : chat.image}}/>
                            </View>
                            <View style={styles.textContent} onPress={() => this.props.navigation.navigate('chatroom')}>
                                <Text style={[ styles.text , styles.info ]} numberOfLines = { 1 } ellipsizeMode = 'head'>{chat.msg}</Text>
                                <View style={{justifyContent:'space-between' , flexDirection:'row'}}>
                                    <Text style={styles.time}>{chat.username}</Text>
                                    <Text style={{textAlign:'left' ,marginTop:10}}>{chat.date}</Text>
                                </View>

                            </View>

                        </View>
                        </TouchableOpacity>
                    )
                })
            }


        </Content>

        <Tabs routeName="chat" navigation={this.props.navigation}/>

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
        height: 85,
      borderColor           : "#ECECEC",
    },
    text : {
      fontFamily            : 'CairoRegular',
      color                 : '#444',
      marginTop             : 7,
      fontSize              : 15,
    },
    icons : {
      fontSize              : 25,
      color                 :  CONST.color
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
      color                  :  CONST.color,
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
    },  headerTitle:{
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

const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user
    };
};
export default connect(mapStateToProps, {profile})(Chat);


