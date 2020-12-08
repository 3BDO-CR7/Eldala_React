import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Linking,
    TouchableOpacity,
    I18nManager as RNI18nManager,
    ActivityIndicator
} from 'react-native';
import {Container, Content, Button, Icon, Title, Header, Left, Body, Right} from 'native-base';
import I18n from "ex-react-native-i18n";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";

class Contact extends Component {
    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state    = {
            phone    : '',
            lang     : this.props.lang,
            email     : '',
            spinner  : true,
        };
    }

    componentWillMount() {
        axios.post(`${CONST.url}site_help`, { lang: this.state.lang  })
            .then( (response)=> {
                this.setState({phone: response.data.data});
                this.setState({email: response.data.email});
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
                        <Title style={[ styles.headerTitle, { paddingHorizontal : 20 } ]}>{I18n.translate('help')}</Title>
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

                    <View style={styles.blockContact}>
                        <View style={styles.block_item}>

                            <View   style={[styles.icon_style , styles.green]}>
                                <TouchableOpacity >
                                    <Icon  onPress={() => {
                                        Linking.openURL('tel://' + this.state.phone )}} style={[styles.icon , styles.conter]} type="Ionicons" name='ios-phone-portrait' />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.textEnemy}>{ I18n.translate('via_call')} </Text>


                        </View>
                        <View style={styles.block_item}>

                            <View style={[styles.icon_style , styles.blue]}>
                                <TouchableOpacity >
                                    <Icon onPress={() => {
                                        Linking.openURL('http://api.whatsapp.com/send?phone=' + this.state.phone )}}   style={[styles.icon , styles.conter]} type="FontAwesome" name='whatsapp' />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.textEnemy}> {I18n.translate('via_wts')}</Text>
                        </View>
                        <View style={styles.block_item}>

                            <View  style={[styles.icon_style , styles.red]}>
                                <TouchableOpacity >
                                    <Icon onPress={() => {
                                        Linking.openURL('mailto:' + this.state.email )}}   style={[styles.icon , styles.conter]} type="Entypo" name='email' />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.textEnemy}> {I18n.translate('via_email')}</Text>
                        </View>
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
        height : 85
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
      width                   : 100,
      height                  : 100,
      alignItems              : 'center',
      justifyContent          : 'center',
      alignSelf               : 'center',
      marginVertical                  : 40,
    },
    texter : {
      fontFamily              : 'CairoRegular',
      textAlign               : 'center',
      margin                  : 15
    },
    blockContact : {
      flexDirection           : 'row',
        flexWrap : 'wrap',
        paddingHorizontal:  30
    },
    block_item : {
      alignItems              : 'center',
        flexDirection : 'row',
      marginVertical                  : 10,
        width : '100%'
    },
    icon_style : {
      borderRadius            : 100,
      width                   : 40,
      height                  : 40,
      textAlign               : 'center',
      margin                  : 10
    },
    icon : {
      color                   : '#fff',
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
      backgroundColor         :  CONST.color,
    },
    blue : {
      backgroundColor         : "#54b844",
    },
    textEnemy : {
      color                   : CONST.color  ,
      fontFamily              : 'CairoRegular',
    },
    textNumber : {
      fontFamily              : 'CairoRegular',
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
    } ,red : {
        backgroundColor         : "#F00",
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
export default connect(mapStateToProps, {profile})(Contact);


