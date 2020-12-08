import React from 'react';
import {StyleSheet, Text, ScrollView, View, FlatList, TouchableOpacity, BackHandler, Platform, Image, Picker, ActivityIndicator} from 'react-native';
import {Container, Icon, Item, Toast} from 'native-base';
import axios   from 'axios';
import Header from './Header';
import Tabs from './Tabs';
import I18n   from 'ex-react-native-i18n';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import {connect} from "react-redux";
import {profile} from "../actions";
// import { NetInfo } from "react-native";
import {NavigationEvents} from "react-navigation";
import CONST from '../consts';
const isIOS = Platform.OS === 'ios';

// NetInfo.isConnected.addEventListener(
//     "connectionChange",
//     hasInternetConnection => {
//         if(hasInternetConnection)
//         {
//
//         }else{
//            console.warn('No Internet Connection');
//         }
//     }
// );

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state  = {
            city          : null,
            toggle        : 0,
            page          : 0,
            spinner       : true,
            lang          : this.props.lang,
            view_grid     : 'md-notifications',
            iconType      : 'Ionicons',
            categories    : [],
            cities        : [],
            blogs         : [],
            countries     : [],
            latitude      : null,
            longitude     : null,
            selected      : null,
            category_id   : null,
            is_nearest    : 0,
            country_id    : null,
            is_result     : null,
         };
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
         BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        if (this.props.navigation.isFocused()) {
            BackHandler.exitApp();
            return true;
        }
    }

    makeRequest() {
         axios.post(`${CONST.url}get-blogs`, {
            page     :  this.state.page,
            lang     : this.props.lang

          }).then( (response)=> {
                if(response.data.data.length > 0)
                {
                    this.setState({
                        blogs : this.state.blogs.concat(response.data.data)
                    })
                }else{
                    this.setState({is_result: false});
                }
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

    async componentWillMount() {

        axios.post(`${CONST.url}categories`, {

             lang: this.state.lang

         }).then( (response)=> {

                 this.setState({categories: response.data.data});

                 axios.post(`${CONST.url}countries`, {

                     lang: this.state.lang

                 }).then( (response)=> {

                         this.setState({countries: response.data.data});

                         axios.post(`${CONST.url}cities`, {

                             lang           : this.state.lang ,
                             country_id     : response.data.data[0].id

                         }).then( (response)=> {

                                 this.setState({cities: response.data.data});
                                 this.getBlogsData()

                             }).catch( (error)=> {

                             this.setState({spinner: false});

                         }).then(()=>{

                             this.setState({spinner: false});

                         });
                     });
             })
             .catch( (error) =>{
                 this.setState({spinner: false});
                 Toast.show({
                     text       : 'Connection error',
                     duration   : 2000 ,
                     type       : 'danger',
                     textStyle  : {
                         color      : "white" ,
                         textAlign  : 'center'
                     }
                 });
             });
         BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    onValueChange2(value) {
        this.setState({city : value });
        setTimeout(()=>{
            this.getBlogsData();
        },1000);
    }

    _renderItem = ({item ,key}) => (
        <View  key = { key }  style={styles.block_item} >
            <View style={{ marginHorizontal: '3%' , flex: 2 , zIndex : 99}} >
                <TouchableOpacity  onPress={() => {
                    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

                    this.props.navigation.navigate('details',{ blog_id : item.id, vid : item.video})} }>
                    <Text style={[styles.info,{color : CONST.color}]}>{item.title}</Text>
                    <View style={styles.icon_text}>
                        <Icon style={styles.icon} active type="Feather" name='user'/>
                        <Text style={styles.info}>{item.user}</Text>
                    </View>

                    <View style={{flexDirection:'row' , flex: 1 , justifyContent: 'space-between'}} >
                        <View style={styles.icon_text}>
                            <Icon style={styles.icon} active type="Feather" name='clock'/>
                            <Text style={styles.info}>{item.date}</Text>
                        </View>
                        <View style={{alignSelf: 'flex-end', flexDirection:'row' , marginHorizontal: '3%'}} >
                            <Icon style={styles.icon} active type="Feather" name='map-pin'/>
                            <Text style={styles.info}>{item.country}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity  onPress={() => {

                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

                this.props.navigation.navigate('details',{ blog_id : item.id , vid : item.video})} }>

                <View style={{flexDirection:'row' , flex: 1 , justifyContent: 'flex-end'}} >
                    <Image style={styles.image} source={{uri:item.img}}/>
                </View>
            </TouchableOpacity>

        </View>
    );

    renderElement() {
        if (this.state.toggle === 0){

            return (
                <View>
                    { this.state.blogs.map((item, key) => {
                        return (
                            <View  key = { key }  style={styles.block_item} >



                                <View style={{ marginHorizontal: '3%' , flex: 2 , zIndex : 99}} >
                                    <TouchableOpacity  onPress={() => {
                                        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

                                        this.props.navigation.navigate('details',{ blog_id : item.id, vid : item.video})} }>
                                    <Text style={styles.info}>{item.title}</Text>
                                    <View style={styles.icon_text}>
                                        <Icon style={styles.icon} active type="Feather" name='user'/>
                                        <Text style={styles.info}>{item.user}</Text>
                                    </View>

                                    <View style={{flexDirection:'row' , flex: 1 , justifyContent: 'space-between'}} >
                                        <View style={styles.icon_text}>
                                            <Icon style={styles.icon} active type="Feather" name='clock'/>
                                            <Text style={styles.info}>{item.date}</Text>
                                        </View>
                                        <View style={{alignSelf: 'flex-end', flexDirection:'row' , marginHorizontal: '3%'}} >
                                            <Icon style={styles.icon} active type="Feather" name='map-pin'/>
                                            <Text style={styles.info}>{item.country}</Text>
                                        </View>
                                    </View>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity  onPress={() => {

                                    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

                                    this.props.navigation.navigate('details',{ blog_id : item.id, vid : item.video})} }>

                                <View style={{flexDirection:'row' , flex: 1 , justifyContent: 'flex-end'}} >
                                    <Image style={styles.image} source={{uri:item.img}}/>
                                </View>
                                </TouchableOpacity>

                            </View>
                        )
                    })}
                </View>
            )



        }else{
            return (
                <View>
                    <FlatList style={{width: '100%'}} data={[{key: 'a'}, {key: 'b'}]}  renderItem={({item}) => this.runderItem(item)} numColumns={2}/>
                </View>
            );
        }

    }

    getBlogsData() {

        axios.post(`${CONST.url}get-blogs`, {
               lang: this.state.lang,
               city_id          :  this.state.city,
               country_id       :  this.state.country_id,
               latitude         :  this.state.latitude ,
               longitude        :  this.state.longitude ,

        })
            .then( (response)=> {
                this.setState({blogs: response.data.data, spinner: false});
             })
            .catch( (error)=> {

            }).then(()=>{
            this.setState({spinner: false});
        });
    }

    _getLocationAsync = async () => {

            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                Toast.show({ text: 'Permission to access location was denied', duration : 4000, type:'danger',textStyle: { color: "white" ,textAlign:'center' }});
            }else {
                if(this.state.is_nearest === 0) {
                    return await Location.getCurrentPositionAsync({
                        enableHighAccuracy: false,
                        maximumAge: 15000
                    }).then((position) => {
                        this.setState({
                            longitude: position.coords.longitude,
                            latitude  : position.coords.latitude,
                            is_nearest: 1
                        });

                        setTimeout(()=> {
                            this.getBlogsData();
                        }, 1000)

                    });
                } else{

                    this.setState({
                        longitude : null,
                        latitude  :null,
                        is_nearest: 0
                    });

                    setTimeout(()=> {
                        this.getBlogsData();
                    }, 1000)              }
            }
    };

    onValueChange5(value) {
        this.setState({country_id     : value });
        axios.post(`${CONST.url}cities`, { lang: this.state.lang , country_id : value })
            .then( (response)=> {
                    this.setState({cities: response.data.data});
                    this.getBlogsData();
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });
    }

    getCategories(id, name){

        if(id)
        {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
            this.props.navigation.navigate('Categories',{
                category_id : id,
                name        : name
            });
        }else{
            this.setState({category_id : id});
            this.state.spinner = true;
            setTimeout(()=>{
                this.setState({spinner: true});
                this.getBlogsData();
            },2000)
        }
    }

    openNotifications() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

        this.props.navigation.navigate('Notification');
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

                <Header
                    navigation={this.props.navigation}
                    type={this.state.iconType}
                    iconName={this.state.view_grid}
                    toggle={() => this.openNotifications()} name={I18n.translate('home')}
                />

                <View>
                    <ScrollView showsHorizontalScrollIndicator={false}    horizontal={true} style={styles.scroll}>

                        <View     style={styles.Text}>
                            <TouchableOpacity     style={ null === this.state.category_id? styles.active : ""}  onPress={()=> { this.getCategories(null) }}>
                                <Text  style={{fontFamily:'CairoRegular',fontSize:15}}>{I18n.translate('all')}</Text>
                            </TouchableOpacity>
                        </View>

                        {

                            this.state.categories.map((item, key) => (

                                (item.id !== 17) ?
                                    <View  key={item.id}   style={styles.Text}>
                                        <TouchableOpacity     style={item.id === this.state.category_id? styles.active : ""}  onPress={()=> { this.getCategories(item.id , item.name) }}>
                                            <Text  style={{fontFamily:'CairoRegular',fontSize:15}}>{item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :

                                    <View/>

                            ))

                        }

                        {/*<View     style={styles.Text}>*/}
                        {/*    <TouchableOpacity     style={ 17 === this.state.category_id? styles.active : ""}  onPress={()=> { this.getCategories(17 ,I18n.translate('more') ) }}>*/}
                        {/*        <Text  style={{fontFamily:'CairoRegular',fontSize:15}}>{I18n.translate('more')}</Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*</View>*/}

                    </ScrollView>
                </View>


                <View style={styles.filter}>

                    <View style={styles.viewPiker}>
                        <Item style={styles.itemPiker} regular>
                            <Picker

                                iosHeader={I18n.translate('choose_country')}
                                headerBackButtonText={I18n.translate('goBack')}
                                mode="dropdown"
                                style={styles.Picker}
                                onValueChange={this.onValueChange5.bind(this)}
                                placeholderStyle={{ color: "#bbb", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                                selectedValue={this.state.country_id}
                                textStyle={{ color: "#bbb",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                placeholder={I18n.translate('choose_country')}
                                itemTextStyle={{ color: '#bbb',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>

                                <Picker.Item style={styles.itemPicker} label={I18n.translate('choose_country')} value={null} />

                                {
                                    this.state.countries.map((country, i) => (
                                        <Picker.Item style={styles.itemPicker} key={i} label={country.name} value={country.id} />
                                    ))
                                }

                            </Picker>
                        </Item>
                        <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                    </View>

                    <View style={styles.viewPiker}>
                        <Item style={styles.itemPiker} regular>
                            <Picker
                                iosHeader={I18n.translate('choose_city')}
                                headerBackButtonText={I18n.translate('goBack')}
                                mode="dropdown"
                                style={styles.Picker}
                                selectedValue={this.state.city}
                                onValueChange={this.onValueChange2.bind(this)}
                                placeholderStyle={{ color: "#bbb", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}
                                textStyle={{ color: "#bbb",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                placeholder={I18n.translate('choose_city')}
                                itemTextStyle={{ color: '#bbb',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>

                                <Picker.Item style={styles.itemPicker} label={I18n.translate('choose_city')} value={null} />

                                {
                                    this.state.cities.map((country, i) => (
                                        <Picker.Item style={styles.itemPicker} key={i} label={country.name} value={country.id} />
                                    ))
                                }

                            </Picker>
                        </Item>
                        <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                    </View>
                    <TouchableOpacity style={styles.clickFunction} onPress={()=> {this._getLocationAsync()}}>
                        <Text style={styles.textFun}>{I18n.translate('nearest')}</Text>
                        <Icon style={styles.iconFun} type="MaterialCommunityIcons" name='map-marker-outline' />
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <FlatList
                        data={ this.state.blogs}
                        style={styles.flatList}
                        onEndReached = { this.handleLoadMore }
                        keyExtractor={this._keyExtractor}
                        onEndReachedThreshold={isIOS ? .01 : 1}

                        extraData={true}
                        renderItem={  this._renderItem}
                        numColumns = { 1 }/>
                </ScrollView>

                <Tabs routeName="home" navigation={this.props.navigation}/>

            </Container>
        );
    }
    _keyExtractor = (item, index) => item.id;

}

const styles = StyleSheet.create({
    scroll: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#DDD',
        marginBottom: 10
    },
    Text: {
        color:  CONST.color,
        padding: 15,
        fontFamily: 'CairoRegular'
    },
    picker: {
        height: 40,
        marginRight: 0,
        borderWidth: 1,
        width: 10,
        fontFamily: 'CairoRegular',
        position: 'absolute',
        right: 0,
        zIndex: 99
    },
    label: {
        alignItems: 'center',
        fontFamily: 'CairoRegular'
    },
    block_item: {
        //justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#DDD',
        padding: 7,
        marginTop: 2,
        marginBottom: 2,
    },
    image: {
        width: 100,
        height: 80,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 10
    },
    icon: {
        color: "#444",
        fontSize: 14,
        marginTop: 5,
        marginHorizontal: 3
        // marginRight           : 5,
        // marginLeft            : -10
    },
    icon_text: {
        flexDirection: 'row',
    },
    info: {
        fontFamily: 'CairoRegular',
        textAlign :'left'
    },
    fixed_btn: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 50,
        bottom: 110,
        right: 15,
        backgroundColor: CONST.color,

        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99
    },
    icon_btn: {
        color: "#FFF",
        fontSize: 30,
    },
    block_section: {
         flex: 1,
        width: '100%',
        margin: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    block_sectionParent: {

        width: '100%'
    },
    titles: {
        textAlign: 'center',
        marginTop: 4,
        color: '#444',
        fontFamily: 'CairoRegular',
    },
    user_MAZAD: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        alignItems: 'flex-end',
    },
    touch: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
        alignItems: 'flex-end',
    },
    ico_touch: {
        fontSize: 15,
        margin: 5
    },
    image_MAZAD: {
        width: '100%',
        height: 110
    },
    views: {
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    text_user: {
        fontFamily: 'CairoRegular',
        color: "#444",
    },
    icon_user: {
        color:  CONST.color,
        fontSize: 16,
        marginRight: 5,
        marginTop: 5
    },
    filterContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    filterItemPicker: {
        width: '50%',
        borderBottomWidth: 0,
        paddingRight: 15,
        paddingLeft: 15,
        overflow: 'hidden'
    },
    bgView: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 0
    },
    TextPrviwe: {
        fontFamily: 'CairoRegular',
        color: "#444",
        fontSize: 15,
        marginLeft: 3,
        marginRight: 3
    },
    headButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingHorizontal:15,
    },
    headNearest: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent:'space-between',
        flexDirection:'row',



    },
    headNearestText: {
        color: '#444',
      //  fontFamily: 'CairoRegular',
        fontSize: 16,
        justifyContent:'flex-end',
        alignItems:'flex-end'
    },headNearestTextActive: {
        color:  CONST.color,
        fontSize: 16,
        fontFamily            : 'CairoRegular',
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: 'blue',
        shadowOffset: { height: 0, width: 0 },
    },
    productsContainer: {
        flexDirection: 'row',
        marginTop: 5,
        borderWidth: .5,
        borderColor: '#cccccc'

    },


    iconNearestText:{
        color :'#444',
        fontSize:16,
        // marginLeft: 40
    },iconNearestTextActive:{
        color: CONST.color,
        fontFamily            : 'CairoRegular',
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: 'blue',
        shadowOffset: { height: 0, width: 0 },
        fontSize:16,
        // marginLeft: 40
    },active:{
        color: '#ffff',
        fontSize: 18,
        fontFamily            : 'CairoRegular',
        shadowOpacity: 0.85,
        shadowRadius: 10,
        shadowColor: 'blue',
        shadowOffset: { height: 0, width: 0 },
    },
    icons:{
        fontSize: 16
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
        borderColor         : '#444',
        borderWidth         : .5
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
        backgroundColor         : "#FFF",
    },
});


const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user
    };
};
export default connect(mapStateToProps, {profile})(Home);



