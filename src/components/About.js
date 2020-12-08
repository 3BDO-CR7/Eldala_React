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
import {Container, Content, Button, Icon, Title, Header, Left, Body, Right} from 'native-base';
import I18n from "ex-react-native-i18n";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import HTML from 'react-native-render-html';
import {NavigationEvents} from "react-navigation";

class About extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);
        this.state = {
            spinner: true,
            text: '' ,
            lang : this.props.lang
        };
    }
    componentWillMount() {

        axios.post(`${CONST.url}aboutUs`, { lang: I18n.currentLocale()  })
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
                <Title style={[ styles.headerTitle, { paddingHorizontal : 10 } ]}>{I18n.translate('about_us')}</Title>
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

                  <HTML
                    html={this.state.text}
                    baseFontStyle={{fontSize:16,fontFamily : 'CairoRegular' , textAlign:'center'}}
                    imagesMaxWidth={Dimensions.get('window').width}
                  />

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
      marginLeft            : 15
    },
    icons : {
      fontSize              : 20,
      color                 : CONST.color
    },
    logo : {
      width                 : 100,
      height                : 100,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      marginVertical        : 40,
    },
    texter : {
      fontFamily            : 'CairoRegular',
      textAlign             : 'center',
      margin                : 15
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

const mapStateToProps = ({ auth, lang ,profile}) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{profile})(About);



