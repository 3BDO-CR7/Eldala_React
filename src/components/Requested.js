import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    I18nManager,
    FlatList,
    TouchableOpacity,
    I18nManager as RNI18nManager, ActivityIndicator
} from 'react-native';
import {Container, Content, Header, Left, Body, Right, Button, Icon, Title, Item} from 'native-base';

import I18n from "ex-react-native-i18n";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import {connect} from "react-redux";
import {profile} from "../actions";
const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import {NavigationEvents} from "react-navigation";

class Requested extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

         this.state = {lang : this.props.lang,spinner: true, text: '',favourites : []};

     }

    componentWillMount() {

        this.props.profile({  user_id: this.props.auth.data.id  });

        axios.post(`${CONST.url}requestedAds`, { lang: this.state.lang , user_id : this.props.user.id })
            .then( (response)=> {
                console.warn(response.data.data);
                this.setState({favourites: response.data.data});
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });
    }

    _renderItem = ({item,i}) => (

        <View  style={styles.block_section} >
            <TouchableOpacity onPress={() => { this.props.navigation.navigate(
                {
                    routeName: 'details',
                    params: {
                        blog_id: item.id,
                    },
                    key: 'APage' + i
                }
            ) } }>
                 <Image style={styles.image_MAZAD} resizeMode='cover' source={{uri:item.img}}/>
            <View >
                <Text style={styles.titles}>{item.title}</Text>
                <View style={styles.user_MAZAD}>
                    <View style={styles.views}>
                        <Text style={styles.text_user}>
                            {item.country}
                        </Text>
                        <Icon style={styles.icon_user} type="FontAwesome" name='map-marker'/>
                    </View>
                    <View style={styles.views}>
                        <Text style={styles.text_user}>
                            { item.count}
                        </Text>
                        <Icon style={styles.icon_user} type="FontAwesome" name='image'/>
                    </View>
                </View>
            </View>
            </TouchableOpacity>
        </View>
    );

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

    noResults() {
        return ( <View><Text style={{marginTop:'50%',textAlign:'center',color:'#ff6649', fontSize:22,fontFamily:'CairoRegular'}}>{I18n.translate('no_results')}</Text></View>);
    }

    render() {
        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />
                {this.renderLoader()}


                <Header style={styles.header}>
                    <Body>
                        <Title style={[ styles.headerTitle, { paddingHorizontal : 20 } ]}>{I18n.translate('requested')}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </Right>
                </Header>

                <Content>

                    { (this.state.favourites.length === 0 && this.state.spinner === false) ? this.noResults() : null}

                    <FlatList
                        data={ this.state.favourites}
                        style={styles.flatList}
                        keyExtractor={this._keyExtractor}
                        onEndReachedThreshold={0.5}
                        renderItem={  this._renderItem}
                        numColumns = { 2 }/>

                </Content>

            </Container>
        );

    }

    _keyExtractor = (item, index) => item.id;

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
        color                 : CONST.color
    },
    icon_btn : {
        color                 : "#FFF",
        fontSize              : 30,
    },
    imageContainer:{


    },
    block_section : {
        borderRadius          : 10,
        borderWidth           : 1,
        borderColor           : '#DDD',
        flex : 1,
        margin : 8
     },
    titles : {
        textAlign             : 'center',
        marginTop             : 4,
        color                 : '#444',
        fontFamily            : 'CairoRegular',
    },
    user_MAZAD : {
        display               : 'flex',
        flexDirection         : 'row-reverse',
        justifyContent        : 'space-between',
        width                 : '100%',
        padding               : 10,
        alignItems            : 'flex-end',
    },
    image_MAZAD : {
        flex: 1,
        height: 140,
     },
    views : {
        display               : 'flex',
        flexDirection         : 'row-reverse',
    },
    text_user : {
        fontFamily            : 'CairoRegular',
        color                 : "#444",
    },
    icon_user : {
        color                 : CONST.color,
        fontSize              : 16,
        marginRight           : 5,
        marginTop             : 5
    },
    flatList : {
        marginTop             : 15,
        flex : 1
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


const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user
    };
};
export default connect(mapStateToProps, {profile})(Requested);


