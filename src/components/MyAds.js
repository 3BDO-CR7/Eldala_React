import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    Alert,
    I18nManager as RNI18nManager,
    ActivityIndicator
} from 'react-native';
import {Container, Content, Button, Icon, Segment, Header, Left, Body, Title, Right, Toast} from 'native-base';
import I18n from "ex-react-native-i18n";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import {NavigationEvents} from "react-navigation";
import CONST from '../consts';

class MyAds extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {lang : this.props.lang,spinner: true, text: '',favourites : [],blogs : [],segment: 1};
    }

    async   componentWillMount() {

        axios.post(`${CONST.url}myFreeBlogs`, { lang:this.state.lang , user_id : this.props.auth.data.id })
            .then( (response)=> {

                this.setState({favourites: response.data.data});

                axios.post(`${CONST.url}myPhotoBlogs`, { lang:this.state.lang , user_id : this.props.auth.data.id })
                    .then( (response)=> {
                        this.setState({blogs: response.data.data});
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

    delete(id , i,type) {

        this.delete_blog(id , i,type)
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


    delete_blog(id,i,type) {
        this.setState({spinner: true});
         axios.post(`${CONST.url}deleteBlog`, { lang:this.state.lang ,id : id, user_id : this.props.auth.data.id })
            .then( (response)=> {
                if(type === 'photo')
                {
                    this.state.favourites.splice(i,1);
                }else{
                    this.state.blogs.splice(i,1);
                }
               if(response.data.value === '1')
               {
                   Toast.show({ text: response.data.msg, duration : 2000  ,type :"success", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
               }else{
                   Toast.show({ text: response.data.msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
               }
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });
    }

    noResults()
    {
        return ( <View><Text style={{marginTop:'50%',textAlign:'center',color:'#ff6649', fontSize:22,fontFamily:'CairoRegular'}}>{I18n.translate('no_results')}</Text></View>);
    }


    render() {
        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />
                {this.renderLoader()}

                <Header hasSegment style={styles.header}>
                    <Left style={{flex:1}} >
                            <Button style={{top: 10}}  transparent onPress={() => this.props.navigation.navigate('mune')}>
                                <Icon style={[styles.icons,{color : '#fbfff6', fontSize:25}]} type="Octicons" name='three-bars' />
                            </Button>
                     </Left>
                    <Body style={{flex:3,justifyContent: 'center'}} >
                    <Title  style={{alignSelf: 'center',fontFamily: 'CairoRegular',color :'#FFF'}} >{I18n.translate('mine')}</Title>
                    </Body>
                    <Right style={{flex:1}}>
                        <Button  style={{top: 10}}  transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={[styles.icons,{color : '#fbfff6', fontSize:25}]} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                     </Right>
                </Header>

                <Content>

                    { (this.state.favourites.length === 0 && this.state.spinner === false) ? this.noResults() : null}


                    {
                            this.state.favourites.map((item, i) => {
                                return (
                                    <View style={styles.block_section} key={i}>
                                        <View>
                                            <View>

                                               <Image style={styles.image_MAZAD} source={{uri: item.img}}/>
                                                 <TouchableOpacity onPress={()=>{ this.delete(item.id , i ,'photo')}} style={{position: 'absolute', top: 15 , right: 15}}>
                                                 <Icon style={[styles.icons,{  fontSize:22 , color : 'white' , backgroundColor:'#F00', padding: 10, width: 40 , height:40,textAlign:'center'}]} type="Ionicons" name='close' />
                                                </TouchableOpacity>
                                                <TouchableOpacity  onPress={()=>{
                                                    this.props.navigation.navigate('Edit_ad',{
                                                        id : item.id
                                                    });
                                                }} style={{position: 'absolute', top: 15 , left: 15}}>
                                                    <Icon style={[styles.icons,{ fontSize:22 , color : 'white' , backgroundColor:'#059220', padding: 10, width: 40 , height:40,textAlign:'center'}]} type="AntDesign" name='edit'  />
                                                </TouchableOpacity>

                                            </View>
                                            <Text style={styles.titles}>{item.title}</Text>
                                            <View style={styles.user_MAZAD}>
                                                <View style={styles.views}>
                                                    <Text style={styles.text_user}>
                                                        {item.country}
                                                    </Text>
                                                    <Icon style={styles.icon_user} type="FontAwesome"
                                                          name='map-marker'/>
                                                </View>
                                                <View style={styles.views}>
                                                    <Text style={styles.text_user}>
                                                        {item.count}
                                                    </Text>
                                                    <Icon style={styles.icon_user} type="FontAwesome" name='image'/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>


                            )
                        })
                    }

                </Content>
            </Container>
        );

    }

}

const styles = StyleSheet.create({
    header : {
        backgroundColor       :  CONST.color,
        justifyContent        : 'space-between',
        flexDirection         : 'row',
        height                : 85,
        color                 : '#FFF'


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
        marginTop             : 15
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
    },    image : {
        width                   : '100%',
        height                  : 250
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
export default connect(mapStateToProps,{profile})(MyAds);



