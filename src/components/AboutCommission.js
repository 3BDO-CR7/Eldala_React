import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    ScrollView,
    Dimensions,
    I18nManager as RNI18nManager, ActivityIndicator
} from 'react-native';

import {
    Container,
    Header,
    Body,
    Right,
    Button,
    Icon,
    Title,
} from 'native-base';
import I18n from "ex-react-native-i18n";
import axios   from 'axios';
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import HTML from "react-native-render-html";
import {NavigationEvents} from "react-navigation";

class AboutCommission extends Component {

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
                        <Title style={[ styles.headerTitle, { paddingHorizontal : 10 } ]}>{I18n.translate('commission_about')}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </Right>
                </Header>

                <ScrollView>

                    <View style={styles.blockAbout}>

                        <Image style={styles.logo} source={require('../../assets/logo-layer.png')}/>


                        <View style={[styles.texter,{width:'95%' , justifyContent:'center' , padding :20}]}>

                            <HTML

                                html={this.state.site_commission}
                                imagesMaxWidth={Dimensions.get('window').width}
                                classesStyles = {{fontFamily : 'CairoRegular' , textAlign:'center' , marginHorizontal: 10}}
                                tagsStyles={{fontFamily : 'CairoRegular' , textAlign:'center' , marginHorizontal: 10}}
                                containerStyle={{fontFamily : 'CairoRegular' , textAlign:'center' , marginHorizontal: 10}}
                                baseFontStyle={{fontSize:16,fontFamily : 'CairoRegular' , textAlign:'center' , marginHorizontal: 10}}
                            />
                            <HTML html={this.state.text}  baseFontStyle={{fontSize:16,fontFamily : 'CairoRegular' , textAlign:'center' , marginHorizontal: 10}} imagesMaxWidth={Dimensions.get('window').width} />

                        </View>


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
        color                 : "#262161"
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

    },
    sendForms:{
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
});

const mapStateToProps = ({ auth, lang ,profile}) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{profile})(AboutCommission);
