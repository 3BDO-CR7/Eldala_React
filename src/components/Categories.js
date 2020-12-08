import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    FlatList,
    ScrollView,
    TouchableOpacity,
    I18nManager as RNI18nManager,
    Picker, ActivityIndicator,
} from 'react-native';
import {
    Container,
    Content,
    Button,
    Icon,
    Title,
    Header,
    Left,
    Body,
    Right,
    Input,
    Item,
    Toast
} from 'native-base';
import I18n from "ex-react-native-i18n";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import Tabs from "./Tabs";
import {NavigationEvents} from "react-navigation";
import CONST from '../consts';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'

class Categories extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
            lang            : this.props.lang,
            name            : '',
            sub_category_id : null,
            spinner         : true,
            sub_categories  : [],
            category_id     : this.props.navigation.state.params.category_id,
            blogs           : [],
            countries       : [],
            cities          : [],
            latitude        : null,
            longitude       : null,
        };
    }


    async componentWillMount() {

        axios.post(`${CONST.url}sub_categories`, { lang:this.props.lang , id : this.props.navigation.state.params.category_id })
            .then( (response)=> {
                this.setState({sub_categories: response.data.data});
                this.setState({name: response.data.name});
                axios.post(`${CONST.url}countries`, { lang: this.state.lang  })
                    .then( (response)=> {
                        this.setState({countries: response.data.data});
                        axios.post(`${CONST.url}cities`, {
                            lang: this.state.lang ,
                            country_id : response.data.data[0].id
                        }).then( (response)=> {
                                this.setState({
                                    cities: response.data.data
                                });
                                this.getBlogsData()
                            }).catch( (error)=> {
                                this.setState({spinner: false});
                            })
                    });
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            })
    }

    onFocus() {
        this.componentWillMount();
    }

    _renderItem = ({item ,i}) => (
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
            <Image style={styles.image_MAZAD} source={{uri:item.img}}/>

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

    getCategories(id) {
        this.setState({sub_category_id : id})
        this.setState({spinner: true});
        setTimeout(()=> {
            this.getBlogsData()
        } , 1000)
    }

    handleKeyUp(keyword) {
        setTimeout(()=>{
            axios.post(`${CONST.url}search`, { lang:this.state.lang , category_id : this.state.category_id ,sub_category_id : this.state.sub_category_id,keyword : keyword })
                .then( (response)=> {
                    this.setState({blogs: response.data.data});
                })
                .catch( (error)=> {
                    this.setState({spinner: false});
                }).then(()=>{
                this.setState({spinner: false});
            });
        },500)
    }

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

    onValueChange2(value) {
        this.setState({city: value });
        setTimeout(()=>{
            this.getBlogsData();
        },1000);
    }

    getBlogsData() {

        axios.post(`${CONST.url}get-blogs`, {
            lang             :  this.state.lang,
            city_id          :  this.state.city,
            country_id       :  this.state.country_id,
            latitude         :  this.state.latitude ,
            longitude        :  this.state.longitude ,
            category_id      :  this.props.navigation.state.params.category_id ,
            sub_category_id  : this.state.sub_category_id

        }).then( (response)=> {
                this.setState({
                    blogs   : response.data.data,
                    spinner : false
                });
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            })
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

    noResults() {
        return (
            <View>
                <Text style={{marginTop:'50%',textAlign:'center',color:'#ff6649', fontSize:22,fontFamily:'CairoRegular'}}>{I18n.translate('no_results')}</Text>
            </View>
        );
    }

    _keyExtractor = (item, index) => item.id;

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
                      <Title style={[ styles.headerTitle, { paddingHorizontal : 20 } ]}>{this.props.navigation.state.params.name}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                        </Button>
                    </Right>
                </Header>

                <Content>

                    <NavigationEvents onWillFocus={() => this.onFocus()} />

                    <ScrollView showsHorizontalScrollIndicator={false}    horizontal={true} style={styles.scroll}>
                        {
                            (this.props.navigation.state.params.category_id !== 17) ?

                                <View     style={styles.Text}>
                                    <TouchableOpacity     style={ null === this.state.sub_category_id? styles.active : ""}  onPress={()=> { this.getCategories(null) }}>
                                        <Text  style={{fontFamily:'CairoRegular',fontSize:15}}>{I18n.translate('all')}</Text>
                                    </TouchableOpacity>
                                </View>

                                :

                                <View/>
                        }

                        {
                            this.state.sub_categories.map((item, key) => (
                                <View  key={item.id}   style={styles.Text}>
                                    <TouchableOpacity     style={item.id === this.state.sub_category_id? styles.active : ""}  onPress={()=> { this.getCategories(item.id ) }}>
                                        <Text  style={{fontFamily:'CairoRegular',fontSize:15}}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </ScrollView>

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

                    <View style={styles.block_search}>
                        <Icon style={styles.icon_search} name="ios-search" />
                        <Input style={styles.input_search}   onChangeText={(keyword)=> this.handleKeyUp(keyword)} placeholder={I18n.translate('search')} />
                    </View>

                    <View>
                        { (this.state.blogs.length === 0 && this.state.spinner === false) ? this.noResults() : null}

                        <FlatList
                            data={ this.state.blogs}
                            style={styles.flatList}
                            keyExtractor={this._keyExtractor}
                            onEndReachedThreshold={0.5}
                            renderItem={  this._renderItem}
                            numColumns = { 2 }
                        />
                    </View>

                </Content>
                <Tabs routeName="Categories" navigation={this.props.navigation}/>

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
        color                 :  CONST.color
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
        color                 :  CONST.color,
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
    },    scroll: {
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
    },active:{
        color: '#ffff',
        fontSize: 18,
        fontFamily            : 'CairoRegular',
        shadowOpacity: 0.85,
        shadowRadius: 10,
        shadowColor: 'blue',
        shadowOffset: { height: 0, width: 0 },
    },
    block_search :{
        position                : 'relative',
        padding                 : 10
    },
    icon_search : {
        position                : 'absolute',
        left                    : 25,
        top                     : 23,
        color                   : '#444',
        fontSize                : 24,
    },
    input_search : {
        borderWidth             : 1,
        borderColor             : '#DDD',
        borderRadius            : 50,
        textAlign               : 'right',
        fontFamily              : 'CairoRegular',
        paddingLeft             : 45
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
export default connect(mapStateToProps,{profile})(Categories);



