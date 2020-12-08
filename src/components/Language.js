import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, I18nManager,TouchableOpacity } from 'react-native';
import  { Container, Content, Button, Icon, Title} from 'native-base';

import i18n from '../../locale/i18n';
import { connect } from 'react-redux';
import { chooseLang } from '../actions';

class Language extends Component {

  constructor(props){
    super(props);
    this.onChooseLang = this.onChooseLang.bind(this)
  }

  onChooseLang(lang) {
      this.props.chooseLang(lang);

      this.props.navigation.navigate('home');
  };




  render() {
    return (
      <Container>
      <Content contentContainerStyle={{ flexGrow: 1 }}>
            
            <View style={styles.blockAbout}>
              
              <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>

              <Text style={[styles.texter , styles.textIng]}>اختر اللغه</Text>

              <View style={styles.boxLang}>
                <TouchableOpacity onPress={() => this.onChooseLang('ar')} style={styles.langStyle}>
                    <Text style={styles.texter}>العربيه</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.onChooseLang('en')} style={styles.langStyle}>
                    <Text style={styles.texter}>English</Text>
                </TouchableOpacity>
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
      color                 : "#2977B3"
    },
    logo : {
      width                 : 150,
      height                : 150,
      alignItems            : 'center',
      justifyContent        : 'center', 
      alignSelf             : 'center',
         borderRadius:       75
    },
    blockAbout : {
        alignItems          : 'center', 
        justifyContent      : 'center', 
        alignSelf           : 'center',
        flex                : 1,
    },
    boxLang : {
        justifyContent      : 'space-between',
        alignItems          : 'center',
        flexDirection       : 'row',
    },
    langStyle : {
        borderRadius        : 100,
        borderWidth         : 1,
        borderColor         : '#2977B3',
        alignItems          : 'center',
        justifyContent      : 'center', 
        alignSelf           : 'center',
        width               : 150,
        padding             : 5,
        margin              : 5
    },
    texter : {
      fontFamily            : 'CairoRegular',
      textAlign             : 'center',
      fontSize              : 17,
      color                 : "#2977B3"
    },
    textIng : {
      marginBottom          : 20,
      fontSize              : 25
    }
});


const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};

export default connect(mapStateToProps, { chooseLang })(Language);

