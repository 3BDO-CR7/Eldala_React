import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, ScrollView, I18nManager as RNI18nManager,
    Picker,} from 'react-native';
import {
    Container,
    Form,
    Item,
    Input,
    Label,
    Icon,
    Title,
    Button,
    Header,
    Body,
     Right,
    Toast
} from 'native-base'

import I18n from "ex-react-native-i18n";
import {Bubbles} from "react-native-loader";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';

class ForgetPassword extends Component {


    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
            lang       : this.props.lang,
            key       : '',
            phone     : '',
            isLoaded  : false,
            codes     : [],
        };
    }

    componentWillMount() {

        this.setState({lang: this.props.lang});
        axios.post(`${CONST.url}codes`, { lang: this.props.lang  })
            .then( (response)=> {
                this.setState({codes: response.data.data});
                this.setState({key: response.data.data[0]});
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });

    }

    onValueChange(value) {
        this.setState({key : value});
    }

    onLoginPressed() {
        const err = this.validate();
        if (!err){

            this.setState({isLoaded: true});

            axios.post(`${CONST.url}forgetPassword`, { lang: this.props.lang , phone : this.state.phone, key : this.state.key })
                .then( (response)=> {
                    this.setAsyncStorage(response);
                }).catch( (error)=> {
                    this.setState({spinner: false,isLoaded: false});
            }).then(()=>{
                this.setState({spinner: false,isLoaded: false});

            });
        }
    }

    async setAsyncStorage(response){
        if(response.data.value === '1')
        {
            Toast.show({ text: response.data.msg, duration : 2000 , type :"success",textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' } });

            this.props.navigation.navigate('newpassword',{
                user_id  : response.data.user_id,
                key      : response.data.key,
                mobile   : response.data.mobile,
            });

        }else{
            Toast.show({ text: response.data.msg, duration : 2000 , type :"danger",textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
        }
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0 || this.state.phone.length !== 10) {
            isError = true;
            msg = I18n.t('phoneValidation');
        }
        if (msg != ''){
            Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }
        return isError;
    };

    renderSubmit() {

        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center', marginTop:70}}>
                    <Bubbles size={10} color="#2977B3"/>
                </View>
            )
        }


        return (

            <Button  onPress={() => this.onLoginPressed()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </Button>

        );
    }

  render() {
    return (
      <Container>


          <Header style={styles.header}>

              <Body>
               <Title style={[ styles.headerTitle, { paddingHorizontal : 20 } ]}>{I18n.translate('forgetPass')}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>

             <Form style={{marginHorizontal: 30}}>

                 <View style={{flex:1, flexDirection: 'row'}}>

                     <View style={{flex:2}}>
                         <Item floatingLabel  style={styles.item} >
                             <Icon style={styles.icon} active type="SimpleLineIcons" name='phone' />
                             <Label style={styles.label}>{ I18n.translate('phone')}</Label>
                             <Input style={styles.input}  keyboardType={'number-pad'} placeholderTextColor="#bbb" onChangeText={(phone) => this.setState({phone})}  value={ this.state.mobile }    />
                         </Item>
                     </View>


                     <View style={[styles.viewPiker,{marginTop : 30}]}>
                         <Item style={styles.itemPiker} regular>
                             <Picker
                                 headerBackButtonText={I18n.translate('goBack')}
                                 mode="dropdown"
                                 style={styles.Picker}
                                 selectedValue={this.state.key}
                                 onValueChange={this.onValueChange.bind(this)}
                                 placeholderStyle={{ color: "#bbb", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                                 textStyle={{ color: "#bbb",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                 placeholder={I18n.translate('choose_city')}
                                 itemTextStyle={{ color: '#bbb',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>


                                 {
                                     this.state.codes.map((country, i) => (
                                         <Picker.Item style={styles.itemPicker} key={i} label={country} value={country} />
                                     ))
                                 }

                             </Picker>
                         </Item>
                         <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                     </View>
                 </View>

                 { this.renderSubmit() }
            </Form>

        </ScrollView>
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
      color                 :  CONST.color
    },
    bgImage : {
      flex                  : 1,
      justifyContent        : 'center',
    },
    logo : {
        transform           : [{ scale: 0.6 }],
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        margin              : 10,
        width : 150 ,
        height : 150,
        borderRadius :65,

    },
    bgDiv : {
      padding               : 10,
      width                 : "100%",
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      top                   : '50%',
      position              : 'absolute',
      transform             : [{ translateY : -150 }]
    },
    icon : {
      color                 : '#bbb',
      position              : 'absolute',
      left                  : 0,
      top                   : 10,
      alignItems            : 'center',
      justifyContent        : 'center',
      fontSize              : 20
    },
    item : {
        width               : "100%",
        marginLeft          : 0,
        marginRight         : 0,
        marginTop           : 15,
        padding             : 0,
        fontFamily          : 'CairoRegular'
    },
    label : {
        width               : "100%",
        color               : '#bbb',
        borderWidth         : 0,
        padding             : 0,
        top                 : -10,
        fontFamily          : 'CairoRegular',
        textAlign           : "left"
    },
    input : {
        borderColor         : '#e2b705',
        borderWidth         : 0,
        borderRadius        : 10,
        width               : "100%",
        color               : '#bbb',
        padding             : 0,
        textAlign           : 'right',
        paddingLeft         : 30,
        fontFamily          : 'CairoRegular',
        height: 55
    },
    textFont : {
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        color               : '#bbb',
        fontSize            : 17,
        marginBottom        : 20,
        textAlign           : 'center',
        fontFamily          : 'CairoRegular'
    },
    bgLiner:{
      borderRadius          : 5,
      width                 : 170,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      marginTop             : 40,
        backgroundColor:    CONST.color
    },
    textBtn : {
        textAlign           : 'center',
        color               : '#fff',
        fontSize            : 16,
        padding             : 0,
        fontFamily          : 'CairoRegular',
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
    },
    viewPiker : {
        position            : 'relative',
        marginTop           : 5,
        marginBottom        : 5,
        flexBasis           : "33%",
        alignItems          : 'center',
        justifyContent      : 'center',
        alignSelf           : 'center',
        backgroundColor     : "#fff",
        borderRadius        : 5,
        borderColor         : '#aaaaaa',
        borderBottomWidth         : .5
    },
    Picker : {
        width               : '100%',
        backgroundColor     : 'transparent',
        borderWidth         : 0,
        paddingLeft         : 0,
        marginRight         : 0,
        borderRadius        : 10,
        height              : 40,
    },
    itemPiker : {
        borderWidth         : 0,
        borderColor         : '#FFF',
        width               : '100%',
        position            : 'relative',
        fontSize            : 18,
        fontFamily          : 'CairoRegular',
        borderRadius        : 5,
        borderLeftWidth     : 0,
        borderBottomWidth   : 0,
        borderTopWidth      : 0,
        borderRightWidth    : 0,
        color               : "#FFF"
    },
    iconPicker : {
        position            : 'absolute',
        right               : 5,
        color               : CONST.color,
        fontSize            : 16
    },
    filter : {
        flexDirection       : "row",
        justifyContent      : "space-between",
        marginBottom        : 5,
        marginHorizontal     : 10
    },
    clickFunction : {
        backgroundColor     : "#fff",
        alignItems          : 'center',
        justifyContent      : 'space-between',
        alignSelf           : 'center',
        borderRadius        : 5,
        color               : CONST.color,
        padding             : 8,
        flexBasis           : "33%",
        flexDirection       : "row",
        borderColor         : '#444',
        borderWidth         : .5
    }

    ,
    textFun : {
        color               : '#444',
        fontFamily          : "CairoRegular",
        fontSize            : 14,
    },
    iconFun : {
        color               : CONST.color,
        fontSize            : 16,
    }

});

const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user
    };
};
export default connect(mapStateToProps, {profile})(ForgetPassword);



