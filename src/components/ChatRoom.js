import React, { Component } from 'react';
import {StyleSheet, Text, Image, View, ScrollView, I18nManager as RNI18nManager, ActivityIndicator} from 'react-native';
import {Container, Button, Icon, Title, Textarea, Toast} from 'native-base';
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
// const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';

import I18n from "ex-react-native-i18n";
import {NavigationEvents} from "react-navigation";

class ChatRoom extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);
        this.state = {
            conversations : [],
            spinner : true,
            name : '',
            message : '',
            lang : this.props.lang
        };

    }
  componentWillMount() {

      axios.post(`${CONST.url}inbox`, { lang: this.state.lang , user_id : this.props.auth.data.id , r_id : this.props.navigation.state.params.other , room : this.props.navigation.state.params.room })
          .then( (response)=> {
              this.setState({conversations: response.data.data});
              this.setState({name: response.data.name});

          }).catch( (error)=> {
              this.setState({spinner: false});
          }) .then( ()=> {
          this.setState({spinner: false});
      })

  }

    sendMessage() {
        axios.post(`${CONST.url}sendMessage`, { lang: this.state.lang , user_id : this.props.auth.data.id , r_id : this.props.navigation.state.params.other , ad_id : this.props.navigation.state.params.room , message : this.state.message })
            .then( (response)=> {
                if(response.data.value === '0'){
                    Toast.show({ text: response.data.msg, duration : 2000 ,type:'danger',textStyle: { color: "white" ,textAlign:'center' }});
                }
                this.state.conversations.push(response.data.data);
                this.setState({message : ''})

            })
            .catch( (error)=> {
                console.warn( error)

            }) .then( ()=> {
        })
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
                <Title style={[ styles.text , { paddingHorizontal : 20 } ]}>{this.state.name}</Title>
            </View>
            <View>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                </Button>
            </View>
        </View>
        <ScrollView
            style={styles.content}
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight)=>{
                this.scrollView.scrollToEnd({animated: true});
            }}
        >
            {
                this.state.conversations.map((chat, i) => {
                    return (

                        (this.props.auth.data.id === chat.s_id) ?
                        <View  key={i} style={styles.chat}>
                            <View style={styles.image}>
                                <Image style={styles.imgUser} source={{uri : chat.img}}/>
                            </View>
                            <View style={styles.textContent} onPress={() => this.props.navigation.navigate('chatroom')}>
                                <Text style={[ styles.text , styles.info ]} numberOfLines = { 1 } ellipsizeMode = 'head'>{chat.msg}</Text>
                                <Text style={styles.time}>{chat.date}</Text>
                            </View>
                        </View>
                        :
                        <View  key={i}   style={[styles.chat , styles.chatSent]}>
                            <View style={styles.image}>
                                <Image style={styles.imgUser}  source={{uri : chat.img}}/>
                            </View>
                            <View style={styles.textContent} onPress={() => this.props.navigation.navigate('chatroom')}>
                                <Text style={[ styles.text , styles.info ]} numberOfLines = { 1 } ellipsizeMode = 'head'>{chat.msg}</Text>
                                <Text style={styles.time}>{chat.date}</Text>
                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>


        <View style={styles.writeMassage}>
            <Button  onPress={() => this.sendMessage()} style={[styles.btn_massage, {zIndex : 99}]}  disabled={this.state.message === ''}>
                <Icon style={styles.icon_massage} type="Entypo" name='paper-plane' />
            </Button>
            <Textarea onChangeText={(message)=> { this.setState({message:message})}} style={styles.input_search} placeholder={I18n.translate('message')}   value={this.state.message}/>
        </View>

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
        color                 :  CONST.color
    },
    content : {
        paddingTop           : 10,
        paddingBottom        : 100,
        marginBottom         : 75,
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
        textAlign            : 'center',
        alignItems           : 'center',
        justifyContent       : 'center',
    },
    image : {
        width                : '15%',
        marginTop            : 13,
        position             : 'absolute',
        left                 : -5,
        zIndex               : 99
    },
    chatSent : {
        flexDirection        : 'row-reverse',
    },
    imgUser : {
        width                : 45,
        height               : 45,
        borderRadius         : 5,
    },
    textContent : {
        shadowColor          : '#000',
        shadowOffset         : { width: 0, height: 1 },
        shadowOpacity        : 0.3,
        borderWidth          : 1,
        borderColor          : '#DDD',
        borderRadius         : 10,
        padding              : 10,
        width                : '90%',
        paddingLeft          : 25,
        paddingRight         : 25,
        textAlign            : 'center',
        alignItems           : 'center',
        justifyContent       : 'center',
    },
    info : {
        textAlign            : 'left',

    },
    time : {
        marginTop            : 10,
        color                :  CONST.color,
    },
    writeMassage : {
        position             : 'absolute',
        bottom               : 10,
        width                : '100%',
        right                : 0,
        backgroundColor      : '#FFF'
    },
    input_search : {
        borderWidth          : 1,
        borderColor          : '#DDD',
        textAlign            : 'right',
        borderRadius         : 5,
        paddingRight         : 70,
        paddingLeft          : 15
    },
    btn_massage : {
        position             : 'absolute',
        right                : 5,
        top                  : 3,
        backgroundColor      :  CONST.color
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
export default connect(mapStateToProps, {profile})(ChatRoom);



