import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    I18nManager,
    Dimensions,
    I18nManager as RNI18nManager,
    ActivityIndicator
} from 'react-native';
import  { Container, Content, Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import I18n from "ex-react-native-i18n";
import Spinner from "react-native-loading-spinner-overlay";
import axios   from 'axios';
import {connect} from "react-redux";
import {profile} from "../actions";
import HTML from 'react-native-render-html';

const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";


class Terms extends Component {


    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state    = { spinner  : true, text     :   ''};

    }
  componentWillMount() {

      axios.post(`${CONST.url}termsAndConditions`, { lang: this.props.lang  })
          .then( (response)=> {
              this.setState({text: response.data.data});
          })
          .catch( (error)=> {
                this.setState({spinner: false});
          }).then(()=>{
                this.setState({spinner: false});
      });
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
              <Title style={[ styles.headerTitle , { paddingHorizontal : 20 } ]}>{I18n.translate('terms')}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

      <Content>

          <View style={styles.blockAbout}>

              <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>

              <View style={[styles.texter,{flex:1}]}>

                  <HTML html={this.state.text}   baseFontStyle={{fontSize:16,fontFamily : 'CairoRegular' , textAlign:'center'}} imagesMaxWidth={Dimensions.get('window').width} />

              </View>
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
      color                 :CONST.color
    },
    logo : {
      width                 : 100,
      height                : 100,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      margin                : 40,
        borderRadius :50,

    },
    texter : {
      fontFamily            : 'CairoRegular',
      textAlign             : 'center',
      margin                : 15
    },
    headerTitle:{
        flex: 1,
        width:'100%',
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
export default connect(mapStateToProps, {profile})(Terms);


