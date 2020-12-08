import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    I18nManager,
    TouchableOpacity,
    ScrollView,
    I18nManager as RNI18nManager, ActivityIndicator
} from 'react-native';
import {Container, Content, Button, Icon, Title, Header, Left, Body, Right} from 'native-base';
import I18n from "ex-react-native-i18n";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";


class SubCategory extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {spinner: true, text: '', categories : [] , lang : this.props.lang};
    }
    componentWillMount() {

        if(this.props.navigation.state.params.type ===  1)
        {
            this.setState({page    : 'Sections'});

        }else {
            this.setState({page    : 'forme3lan_photo'});
        }

        axios.post(`${CONST.url}sub_categories`, { lang: this.state.lang , id : this.props.navigation.state.params.category_id  })
            .then( (response)=> {
                this.setState({categories: response.data.data});
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
                        <Title style={[ styles.headerTitle , { paddingHorizontal : 20 } ]}>{I18n.translate('sub_category')}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </Right>
                </Header>

                <Content>

                    <View style={styles.blockAbout}>

                        {

                            this.state.categories.map((item, key) => (
                                <TouchableOpacity key={key} onPress={()=> { this.props.navigation.navigate(this.state.page,{
                                    category_id : this.props.navigation.state.params.category_id,
                                    sub_category_id : item.id,
                                })}}>
                                    <View style={{justifyContent:'space-between',flexDirection :'row', borderRadius: 15 ,marginVertical : 10,marginHorizontal : 20 ,padding :20, borderWidth:.5,borderColor :'#e7e7e7'}}>
                                        <Text style={[styles.headerTitle,{lineHeight: 50, fontSize              : 20}]}>{item.name}</Text>
                                        <Image style={styles.slide} source={{uri:item.icon}}/>
                                    </View>
                                </TouchableOpacity>

                            ))

                        }



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
        margin                : 40
    },
    texter : {
        fontFamily            : 'CairoRegular',
        textAlign             : 'center',
        margin                : 15
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',

    } , slide : {
        height                : 50,
        width                 : 50,
        borderRadius          : 25
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
export default connect(mapStateToProps,{profile})(SubCategory);



