import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    FlatList,
    TouchableOpacity,
    I18nManager as RNI18nManager,
    ActivityIndicator
} from 'react-native';
import {Container, Content, Header, Left, Body, Right, Button, Icon, Title} from 'native-base';

import Swiper from 'react-native-swiper';

import Tabs from './Tabs';
import {connect} from "react-redux";
import {profile, userLogin} from "../actions";
import I18n from "ex-react-native-i18n";
 import axios from "axios";
import {NavigationEvents} from "react-navigation";
import CONST from '../consts';

class Filter extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
            lang           : this.props.lang,
            isLoaded       : false,
            spinner        : true,
            categories     : [],
            images         : [],
            sliders        : [],
        };
    }

   async  componentWillMount() {

                axios.post(`${CONST.url}categories`, { lang: this.state.lang })
                    .then( (response)=> {
                        this.setState({categories: response.data.data});
                        axios.post(`${CONST.url}getSlider`, { lang:  this.state.lang })
                            .then( (response)=> {
                                this.setState({sliders: response.data.data});
                            })
                            .catch( (error)=> {
                                this.setState({spinner: false});
                            }).then( ()=> {
                            this.setState({spinner: false});
                        })
                    })
                    .catch( (error)=> {
                        this.setState({spinner: false});
                    })
    }

    onFocus(){
        this.componentWillMount()
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

    _renderItem = ({item}) => (

        <TouchableOpacity onPress={()=>  this.props.navigation.navigate('Categories',{category_id : item.id})}>
        <View style={styles.blocking} >
            <View style={styles.block_item}>
                <View onPress={() => this.props.navigation.navigate('login')}  >
                    <Image   resizeMode='cover' source={{uri:item.icon}} style={{width:60 , height: 60, borderRadius:30}}/>
                </View>
                <Text style={styles.text_enemy}>{item.name}</Text>
            </View>
        </View>
        </TouchableOpacity>
    );

    _keyExtractor = (item, index) => item.id;

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
                <Title style={styles.headerTitle}>{I18n.translate('categories')}</Title>
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

            <View style={styles.block_slider}>

                <Swiper
                        autoplayTimeout	={2.5}
                        showsButtons={true} autoplay={true}

                            nextButton=
                              {
                                <View style={styles.Btn}>
                                  <Icon style={styles.Btn_Icon} type="FontAwesome" name='angle-left' />
                                </View>
                             }

                            prevButton =
                            {
                               <View style={styles.Btn}>
                                 <Icon style={styles.Btn_Icon} type="FontAwesome" name='angle-right' />
                               </View>
                            }
                        containerStyle={styles.wrapper} >

                        {this.state.sliders.map((slider, i) => {
                            return (
                                <View>
                                    <Image style={styles.slide} source={{uri:slider.url}}/>
                                </View>
                            )
                        })}

                </Swiper>
            </View>


              <View style={{marginTop: 35}}>
                <View style={styles.block_section}>
                    <FlatList
                        data={ this.state.categories}
                        contentContainerStyle={{ justifyContent: 'center', alignItems:'center'}}
                        keyExtractor={this._keyExtractor}
                        onEndReachedThreshold={0.5}
                        renderItem={  this._renderItem}
                        numColumns = { 3 }/>
                </View>
            </View>

        </Content>

        <Tabs routeName="filter"  navigation={this.props.navigation}/>

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
        height:85,
      borderColor           : "#ECECEC",
    },
    text : {
      fontFamily            : 'CairoRegular',
      color                 : '#444',
      marginTop             : 5
    },
    icons : {
      fontSize              : 25,
      color                 :  CONST.color
    },
    icon_whats : {
      fontSize              : 20,
      marginRight           : 10,
      marginLeft            : 10,
      color                 : "#54B844"
    },
    block_slider : {
      width                 : '90%',
      borderRadius          : 10,
      margin                : 10,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      overflow              : 'hidden',
      flexWrap : 'wrap'
    },
    wrapper : {
      height                : 250,
      width                 : '100%'
    },
    slide : {
      height                : 250,
      width                 : '100%'
    },
    Btn : {
      borderRadius          : 100,
      width                 : 35,
      height                : 35,
      textAlign             : 'center',
      backgroundColor       : "#fff",
      paddingTop            : 2,
    },
    Btn_Icon : {
      color                 : CONST.color,
      fontSize              : 30,
      textAlign             : 'center'
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
        justifyContent:'center'
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
      margin                  : 15,
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
      lineHeight              : 40,
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
    block_search :{
      position                : 'relative',
      padding                 : 10
    },
    icon_search : {
      position                : 'absolute',
      left                    : 25,
      top                     : 23,
      color                   : '#444',
      fontSize                : 24,
    },
    input_search : {
      borderWidth             : 1,
      borderColor             : '#DDD',
      borderRadius            : 50,
      textAlign               : 'right',
      fontFamily              : 'CairoRegular',
      paddingLeft             : 45
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

        auth   : auth.user,
        lang   : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(Filter);

