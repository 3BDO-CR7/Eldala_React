import React, { Component } from 'react';
import {StyleSheet, I18nManager, TouchableOpacity, I18nManager as RNI18nManager} from 'react-native';
import  { Container,Icon, Content, Header, Left, Body, Right, Button,Title,Text, View} from 'native-base';
import I18n from "ex-react-native-i18n";
import CONST from "../consts";



class AddE3lan extends React.Component {
    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

    }
  componentWillMount() {
   }


  render() {
    return (
      <Container>

        <View style={styles.header}>
            <View>
                <Button transparent onPress={() => this.props.navigation.navigate('mune')}>
                    <Icon style={styles.icons} type="Octicons" name='three-bars' />
                </Button>
            </View>
            <View>
                <Title style={[ styles.text , {  paddingHorizontal : 20 } ]}>{I18n.translate('add_Ads')}</Title>
            </View>
            <View>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                </Button>
            </View>
        </View>

        <Content>

        <View style={styles.content}>
            <View style={styles.fixed_top}>

                     <TouchableOpacity style={styles.fixed_btn} onPress={() => this.props.navigation.navigate('termse3lan',{
                         type : 1
                     })}>
                        <Text style={styles.text_btn}>{I18n.translate('free_Ads')}</Text>
                    </TouchableOpacity>


                     <TouchableOpacity style={styles.fixed_btn} onPress={() => this.props.navigation.navigate('termse3lan' ,{

                         type : 3
                     })}>
                        <Text style={styles.text_btn}>{I18n.translate('photo_ads')}</Text>
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
    },
    icons : {
        fontSize              : 25,
        color                 :  CONST.color
    },
    fixed_top : {
        width                 : '90%',
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
        alignContent          : 'center',
        paddingTop            : 130
    },
    content : {
        flex                  : 1,
    },
    fixed_btn : {
        margin                : 10,
        padding               : 10,
        borderRadius          : 5,
        width                 : '100%',
        backgroundColor:  CONST.color
    },
    text_btn :{
        fontFamily            : 'CairoRegular',
        color                 : '#FFF',
        alignItems            : 'center',
        justifyContent        : 'center',
        alignSelf             : 'center',
    }

});


export default AddE3lan;
