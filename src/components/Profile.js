import React, { Component } from 'react';
import {StyleSheet, Text, View, I18nManager, Image, TouchableOpacity, I18nManager as RNI18nManager} from 'react-native';
import {Container, Content, Form, Item, Input, Label, Icon, Title, Button, Left, Body, Right, Header} from 'native-base'


import { LinearGradient } from 'expo';
import {connect} from "react-redux";
import I18n from "ex-react-native-i18n";
import {profile} from "../actions";
import CONST from "../consts";

class Profile extends Component {


  constructor(props) {
    super(props);
      RNI18nManager.forceRTL(true);

      this.state = {
            avatar : '',
            phone  :'',
            country  :'',
            city  :'',
            name  :'',
    };


   }

    componentWillMount() {

      if(this.props.auth)
      {

          this.props.profile({  user_id: this.props.auth.data.id ,lang :this.props.lang });

              this.setState({avatar:this.props.user.avatar});
              this.setState({phone:this.props.user.phone});
              this.setState({city:this.props.user.city});
              this.setState({country: this.props.user.country});
              this.setState({name: this.props.user.name});


      }else{
          this.props.navigation.navigate('login');
      }

    }


    componentWillReceiveProps(newProps) {

        if( JSON.stringify(this.props.user) !== JSON.stringify(newProps.user))      {
            if(this.props.user !== null && this.props.user !== undefined)
            {

                if(newProps.user !== null && newProps.user !== undefined && newProps.user !== this.props.user)
                {

                    this.setState({avatar:newProps.user.avatar});
                    this.setState({phone:newProps.user.phone});
                    this.setState({city:newProps.user.city});
                    this.setState({country: newProps.user.country});
                    this.setState({name: newProps.user.name});
                }
            }

      }

    }



  render() {
    return (
      <Container>


            <Header  style={styles.header}>
                <Body>
                <Title style={[ styles.headerTitle, { paddingHorizontal : 20 } ]}>{I18n.translate('profile')}</Title>
                </Body>
                <Right>
                    <Button transparent onPress={()=> this.props.navigation.navigate('mune')} >
                        <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                    </Button>
                </Right>
            </Header>



        <Content>
            <View style={styles.imagePicker}>
                <Image style={styles.imgePrive}  source={{uri:this.state.avatar}}/>
            </View>
            <Title style={styles.textUser}>{this.state.name }</Title>

            <View style={styles.bgDiv}>
                      <View style={styles.item}>
                        <Icon style={styles.icon} active type="SimpleLineIcons" name='phone' />
                        <Text style={styles.label}>{ this.state.phone }</Text>
                      </View>

                      <View style={styles.item}>
                        <Icon style={styles.icon} active type="Feather" name='map-pin' />
                        <Text style={styles.label}>{this.state.country }</Text>
                      </View>
                      <View style={styles.item}>
                        <Icon style={styles.icon} active type="Feather" name='map-pin' />
                        <Text style={styles.label}>{ this.state.city }</Text>
                      </View>


                <Button  onPress={() =>this.props.navigation.navigate('editprofile')} style={styles.bgLiner}>
                    <Text style={styles.textBtn}>{I18n.translate('editAcc')}</Text>
                </Button>

            </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    header : {
      backgroundColor       : "transparent",
      alignItems            : 'center',
      padding               : 10,
      paddingTop            : 25,
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
    textUser : {
      fontFamily            : 'CairoRegular',
      color                 : '#444',
      fontSize              : 15,
        textAlign : 'center'
    },
    icons : {
      fontSize              : 20,
      color                 : CONST.color
    },
    bgImage : {
      flex                  : 1,
      justifyContent        : 'center',
    },
    bgDiv : {
      padding               : 10,
      width                 : "85%",
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
    },
    icon : {
      color                 : '#bbb',
      fontSize              : 16,
      marginRight           : 5,
      marginLeft            : 5
    },
    item : {
        width               : "100%",
        marginLeft          : 0,
        marginRight         : 0,
        marginTop           : 15,
        flexDirection       : 'row',
        borderWidth         : 1,
        borderColor         : '#DDD',
        padding             : 10,
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        borderRadius        : 10,
        paddingRight        : 20,
        paddingLeft         : 20
    },
    label : {
        width               : "100%",
        color               : 'black',
        fontFamily          : 'CairoRegular',
        textAlign           : 'left',
        fontSize            : 14,
    },
    bgLiner:{
        borderRadius        : 5,
        width               : 170,
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        marginTop           : 40,
        backgroundColor     : CONST.color
    },
    textBtn : {
        textAlign           : 'center',
        color               : '#fff',
        fontSize            : 16,
        padding             : 0,
        fontFamily          : 'CairoRegular',
    },
    imagePicker : {
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      margin                : 20,
      width                 : 90,
      height                : 90,
      borderWidth           : 1,
      borderColor           : "#DDD",
      borderRadius          : 100,
      overflow              : 'hidden'
    },
    imgePrive : {
      position              : 'absolute',
      width                 : 90,
      height                : 90,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      top                   : 0
    },
    headerTitle:{
    color                 : '#444',
    fontFamily            : 'CairoRegular',
}

});

const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth      : auth.user,
        lang      : lang.lang,
        user      : profile.user,
        Updated   : profile.updated,
    };
};
export default connect(mapStateToProps, {profile})(Profile);



