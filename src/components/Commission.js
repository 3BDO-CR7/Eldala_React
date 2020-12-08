import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    I18nManager,
    KeyboardAvoidingView,
    ScrollView,
    Dimensions,
    I18nManager as RNI18nManager,
    Picker, ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
    Container,
    Content,
    Textarea,
    Header,
    Left,
    Item,
    Input,
    Body,
    Right,
    Button,
    Icon,
    DatePicker,
    Title, Toast,Form
} from 'native-base';
import I18n from "ex-react-native-i18n";
import axios   from 'axios';
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";

class Commission extends Component {
    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
                bank         : null,
                lang         : this.props.lang,
                banks        : [],
                spinner      : true,
                text         : '',
                username     : '',
                site_commission     : '',
                ammount      : '',
                blog_id      : '',
                phone        : '',
                chosenDate   : new Date(),
                date         : '',
                note         : '',
                en_message   : 'please complete all required data',
                ar_message   : 'برجآء تأكد من إدخال جميع البيانات',

        };

    }



    sendData() {
        if(this.state.username === '' || this.state.ammount === '' || this.state.blog_id === '' || this.state.bank === '' || this.state.phone === ''   || this.state.note === '') {
            Toast.show({ text: (I18n.currentLocale() === 'en' ? this.state.en_message : this.state.ar_message), duration : 2000 ,type : 'danger',textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' }});
        }else{
            this.setState({spinner: true});
            axios.post(`${CONST.url}transfer`, {
                lang        : this.state.lang,
                user_id     : this.props.user.id ,
                bank_id     : this.state.bank ,
                username    : this.state.username,
                ammount     : this.state.ammount,
                blog_id     : this.state.blog_id,
                phone       : this.state.phone,
                note        : this.state.note,
            })
                .then( (response)=> {
                    Toast.show({ text: response.data.msg, duration : 2000 ,type:'success',textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' }});
                })
                .catch( (error)=> {
                    this.setState({spinner: false});
                }).then(()=>{
                this.setState({spinner: false});
            });
        }
    }


  componentWillMount() {

      axios.post(`${CONST.url}commission_info`, { lang: this.state.lang  })
          .then( (response)=> {

              this.setState({text: response.data.data.site_commission_notes});
              this.setState({site_commission: response.data.data.site_commission});
              axios.post(`${CONST.url}banks`, { lang: this.state.lang })
                  .then( (response)=> {
                      this.setState({banks: response.data.data});
                  })
                  .catch( (error)=> {
                      this.setState({spinner: false});
                  }).then(()=>{
                  this.setState({spinner: false});
              });

          })
          .catch( (error)=> {
              this.setState({spinner: false});
          })
  }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });

    }

    sendBankNumner(id) {
        this.setState({spinner: true});
        axios.post(`${CONST.url}sendBankNumner`, { lang: this.state.lang , user_id : this.props.user.id , bank_id: id  })
            .then( (response)=> {
                if(response.data.value === '1')
                {
                    Toast.show({ text: response.data.msg, duration : 2000 ,type : 'success',textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' }});
                }else{
                    Toast.show({ text: response.data.msg, duration : 2000 ,type : 'danger' ,textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' }});
                }
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });
    }

    onValueChange2(value) {
        this.setState({bank : value });
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
                <Title style={[ styles.headerTitle, { paddingHorizontal : 20 } ]}>{I18n.translate('commission')}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

          <ScrollView>

            <View style={styles.blockAbout}>

                {this.state.banks.map((item, i) => {
                    return (
                        <View style={styles.sendForm}>
                            <Text style={{textAlign:'center', marginVertical: 5,fontFamily            : 'CairoRegular',color: CONST.color,fontSize:20}}>{item.name}</Text>

                            <View style={{ padding: 5, justifyContent:'space-between',flexDirection: 'row'}}>
                                <Text style={{marginHorizontal:10,color: CONST.color,fontFamily            : 'CairoRegular'}}>{I18n.translate('accountName')} </Text>
                                <Text style={{marginHorizontal:10,fontFamily            : 'CairoRegular',fontSize:18,color : CONST.color}}>{item.account_name}</Text>
                            </View>


                            <View style={{ padding: 5, justifyContent:'space-between',flexDirection: 'row'}}>
                                <Text style={{marginHorizontal:10,color: CONST.color,fontFamily            : 'CairoRegular'}}>{I18n.translate('accountNumber')}  </Text>
                                <Text style={{marginHorizontal:10,fontFamily: 'CairoRegular',fontSize:13,color : CONST.color}}>{item.account_number}</Text>
                            </View>


                           <View style={{ padding: 5, justifyContent:'space-between',flexDirection: 'row'}}>
                                <Text style={{marginHorizontal:10,color: CONST.color,fontFamily            : 'CairoRegular'}}>رقم الإيبان  </Text>
                                <Text style={{marginHorizontal:10,fontFamily: 'CairoRegular',fontSize:13,color : CONST.color}}>{item.iban_number}</Text>
                            </View>


                            <View style={{alignSelf: 'flex-end' , marginRight: 25}}>
                                <Button style={{top: 15, width:200 , height: 40 , justifyContent:'center' , backgroundColor:  CONST.color}} onPress={()=> this.sendBankNumner(item.id)}>
                                    <Text style={{ color:'#ffffff',fontFamily            : 'CairoRegular'}}>{I18n.translate('sendButtonBank')}</Text>
                                </Button>
                            </View>
                        </View>
                    );
                })}

            </View>

             <View style={styles.sendForms}>

                 <Text style={{textAlign:'center', marginVertical: 5,fontFamily : 'CairoRegular',color: CONST.color,fontSize:17}}>{I18n.translate('transfer_commission')}</Text>

                 <Form style={{ width : '100%', paddingHorizontal : 20 }}>
                     <KeyboardAvoidingView behavior="padding"   style={{ width : '100%'}} >

                 <View stylw={[ styles.item, { flexDirection : 'row', alignItems : 'center', position:'relative' } ]} { ...(this.state.username === '' ? { ...this.state.error} : {...this.state.success}) }>
                     <Icon active   type="EvilIcons" name="user" style={{color : CONST.color, position : 'absolute', left: 0, top : 15, fontSize : 23}} />
                     <Input onChangeText={(username) => this.setState({username})}   value={this.state.username} placeholder={I18n.translate('name')} style={[ styles.input , {fontFamily: 'CairoRegular'}]}  />
                 </View>

                 <View stylw={[ styles.item, { flexDirection : 'row', alignItems : 'center', position:'relative' } ]} { ...(this.state.username === '' ? { ...this.state.error} : {...this.state.success}) }>
                     <Icon
                         active
                         name='attach-money'
                         type="MaterialIcons"
                         style={{color : CONST.color, position : 'absolute', left: 0, top : 15, fontSize : 23}}
                     />
                     <Input
                         onChangeText={(ammount) => this.setState({ammount})}
                         value={this.state.ammount}
                         placeholder={I18n.translate('amount')}
                         style={[ styles.input , {fontFamily: 'CairoRegular'}]}
                     />
                 </View>


                 <View stylw={[ styles.item, { flexDirection : 'row', alignItems : 'center', position:'relative' } ]} { ...(this.state.username === '' ? { ...this.state.error} : {...this.state.success}) }>
                     <Icon
                         active
                         name='ios-call'
                         type="Ionicons"
                         style={{color : CONST.color, position : 'absolute', left: 0, top : 15, fontSize : 23}}
                     />
                     <Input
                         onChangeText={(phone) => this.setState({phone})}
                         value={this.state.phone}
                         placeholder={I18n.translate('phone')}
                         style={[ styles.input , {fontFamily: 'CairoRegular'}]}
                     />
                 </View>

                 <View stylw={[ styles.item, { flexDirection : 'row', alignItems : 'center', position:'relative' } ]} { ...(this.state.username === '' ? { ...this.state.error} : {...this.state.success}) }>
                     <Icon
                         active
                         name='sort-numeric-asc'
                         type="FontAwesome"
                         style={{color : CONST.color, position : 'absolute', left: 0, top : 15, fontSize : 23}}
                     />
                     <Input
                         onChangeText={(blog_id) => this.setState({blog_id})}
                         value={this.state.blog_id}
                         success={false}
                         placeholder={I18n.translate('ads_number')}
                         style={[ styles.input , {fontFamily: 'CairoRegular'}]}
                     />
                 </View>

                 <View style={{
                     flexDirection       : "row",
                     justifyContent      : "space-between",
                     alignItems          : "center",
                     flexWrap            : 'wrap',
                     borderBottomColor  : '#DDD',
                     borderBottomWidth : 1,
                     position:'relative',
                     paddingLeft: 25
                 }}>
                     <Icon
                         active
                         name='calendar'
                         type="AntDesign"
                         style={{color : CONST.color, position : 'absolute', left: 0, top : 12, fontSize : 23}}
                     />
                     <DatePicker
                         defaultDate={new Date(2018, 4, 4)}
                         minimumDate={new Date(2018, 1, 1)}
                         maximumDate={new Date(2018, 12, 31)}
                         locale={"en"}
                         timeZoneOffsetInMinutes={undefined}
                         modalTransparent={false}
                         animationType={"fade"}
                         androidMode={"default"}
                         placeHolderText={I18n.translate('transform_date')}
                         textStyle={{ color: "green",fontFamily: 'CairoRegular'}}
                         placeHolderTextStyle={{ color: "#444",fontFamily: 'CairoRegular'}}
                         onDateChange={this.setDate}
                         disabled={false}
                     />
                 </View>

                 <View style={[ styles.position_R, {  padding : 0,marginBottom : 10, marginTop : 10,width : '100%', borderBottomColor : '#DDD', borderBottomWidth:  1} ]} regular>
                     <Icon style={[ styles.iconPicker ]} name='down' type="AntDesign"/>
                     <Picker
                         mode="dropdown"
                         iosHeader={I18n.translate('choose_bank')}
                         headerBackButtonText={I18n.translate('goBack')}
                         style={{width: '100%',backgroundColor:'transparent',color: '#363636', writingDirection: 'rtl',fontFamily : 'CairoRegular'}}
                         placeholderStyle={{ color: "#363636", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular' }}
                         selectedValue={this.state.bank}
                         onValueChange={this.onValueChange2.bind(this)}
                         textStyle={{ color: "#363636" , width : '100%', writingDirection: 'rtl',fontFamily : 'CairoRegular',paddingLeft : 10, paddingRight: 10 }}
                         placeholder={I18n.translate('choose_bank')}
                         itemTextStyle={{ color: '#363636', width : '100%', writingDirection: 'rtl',fontFamily : 'CairoRegular' }}>
                         {
                             this.state.banks.map((bank, i) => {
                                 return <Picker.Item style={{color: "#363636" , width : '100%',fontFamily : 'CairoRegular'}}  key={i} value={bank.id} label={bank.name} />
                             })
                         }
                     </Picker>
                 </View>

                 <View stylw={[ styles.item, { flexDirection : 'row', alignItems : 'center', position:'relative' } ]} { ...(this.state.username === '' ? { ...this.state.error} : {...this.state.success}) }>
                    <Textarea onChangeText={(note) => this.setState({note})}   value={this.state.note}  rowSpan={3}  style={{fontFamily: 'CairoRegular',}} bordered placeholder={I18n.translate('notes')} />
                 </View>
             </KeyboardAvoidingView>

                     <Button style={{ justifyContent:'center' ,width: 150, backgroundColor: CONST.color, alignSelf : 'center', alignItems : 'center', marginVertical : 10}} onPress={ ()=> this.sendData()} >
                         <Text style={{ color:'#ffffff',fontFamily : 'CairoRegular' }}>
                             {I18n.translate('sendButton')}
                         </Text>
                     </Button>

                 </Form>
             </View>
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
    item : {
        padding                 : 0,
        borderColor             : '#b5b5b5',
        width                   : '100%',
        marginVertical          : 10,
        marginLeft              : 0,
        borderWidth             : 2
    },
    icons : {
      fontSize              : 20,
      color                 : "#2977B3"
    },
    logo : {
      width                 : 100,
      height                : 100,
        alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      marginVertical                : 40
    },
    texter : {
       fontFamily            : 'CairoRegular',
      // textAlign             : 'center',
      // margin                : 15
    },

    iconPicker : {
        position              : 'absolute',
        right                 : 5,
        fontSize : 12,
        top : 20
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
    },
    sendForm:{
        borderWidth: 1,
        borderColor: '#d8d8d8',
        margin:15,
        borderRadius: 4,
        fontFamily            : 'CairoRegular',
        shadowOffset: { height: 0, width: 0 },

    },sendForms:{
        borderWidth: 1,
        borderColor: '#dbdbdb',
        margin:15,
        borderRadius: 4,
        fontFamily            : 'CairoRegular',
        shadowOffset: { height: 0, width: 0 },
    },
    success:{
        color :'#2977B3'
    },
    error:{
        color : '#F00'
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
    input : {
        borderBottomColor         : '#ddd',
        borderBottomWidth         : 1,
        color               : '#bbb',
        paddingRight             : 0,
        textAlign           : 'right',
        paddingLeft         : 30
    },
});

const mapStateToProps = ({ auth, lang ,profile}) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{profile})(Commission);
