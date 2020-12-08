import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity, I18nManager as RNI18nManager, ActivityIndicator} from 'react-native';
import  { Container,Icon, Content, Button,Title,Text, View} from 'native-base';

import I18n from "ex-react-native-i18n";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";

class AddE3lan extends React.Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
            text    : '',
            spinner : true,
            lang    : this.props.lang
        };

    }
    componentWillMount() {

        axios.post(`${CONST.url}adsTermsAndConditions`, { lang: this.props.lang })
            .then( (response)=> {
                this.setState({text: response.data.data});
            }).catch( (error)=> {
                console.warn(error);
                this.setState({spinner: false});
            }).then( ()=> {
            this.setState({spinner: false});
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
                <Title style={[ styles.text, { paddingHorizontal:  10 } ]}>{I18n.translate('ads_condition')}</Title>
            </View>
            <View>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                </Button>
            </View>
        </View>
        <Content>

        <View >

            <Text style={[styles.text_info,{marginTop:40}]}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>

            <Text style={styles.text_info}>
                ( وَأَوْفُوا بِعَهْدِ اللَّهِ إِذَا عَاهَدتُّمْ وَلَا تَنقُضُوا الْأَيْمَانَ بَعْدَ تَوْكِيدِهَا وَقَدْ جَعَلْتُمُ اللَّهَ عَلَيْكُمْ كَفِيلًا ۚ إِنَّ اللَّهَ يَعْلَمُ مَا تَفْعَلُونَ )
            </Text>

            <Text style={styles.text_info}>

                {this.state.text}

            </Text>


        </View>

        <View style={styles.divBtn}>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('SelectCategory',{type :1})}
                style={[styles.fixed_btn,{backgroundColor:'#2977B3'}]}
            >
                <Text style={styles.text_btn}>{I18n.translate('accept')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('home')}
                style={[styles.fixed_btn,{backgroundColor:'#919191'}]}
            >
                <Text  style={styles.text_btn}>{I18n.translate('cancel')}</Text>
            </TouchableOpacity>
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
        paddingTop            : 30,
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
        marginLeft            : 15
    },
    icons : {
        fontSize              : 20,
        color                 : CONST.color
    },
    fixed_btn : {
        marginVertical        : 15,
        padding               : 5,
        borderRadius          : 5,
        width                 : 150,
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        textAlign             : 'center',
    },
    divBtn : {
        alignItems            : 'center',
        flexDirection         : 'row',
        justifyContent        : 'space-between',
        marginVertical        : 10,
        width:  '100%',
        paddingHorizontal : 15
    },
    text_info :{
        fontFamily            : 'CairoRegular',
        color                 : '#444',
        margin                : 15
    },
    text_btn :{
        fontFamily            : 'CairoRegular',
        color                 : '#fff',
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
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
export default connect(mapStateToProps, {profile})(AddE3lan);





