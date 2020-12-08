import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    I18nManager,
    ScrollView,
    FlatList,
    TouchableOpacity,
    I18nManager as RNI18nManager, ActivityIndicator
} from 'react-native';
import {Container, Content, Button, Icon, Title, Header, Left, Body, Right} from 'native-base';

import Tabs from './Tabs';
import Lightbox from 'react-native-lightbox';
import axios from "axios";
import I18n from "ex-react-native-i18n";
import {connect} from "react-redux";
import {profile} from "../actions";
import Spinner from "react-native-loading-spinner-overlay";
import {NavigationEvents} from "react-navigation";
// const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';

class Gallery extends Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {

            lang           : this.props.lang,
            spinner        : true,
            categories     : [],
            category_id    : null,
            sub_category_id    : null,
            sub_categories     : [],
            images         : [],
            blogs : []

        };
    }

    onFocus() {
        this.componentWillMount();
    }

    async componentWillMount() {

      axios.post(`${CONST.url}categories`, { lang: this.props.lang })
          .then( (response)=> {
               this.setState({categories: response.data.data});
                  axios.post(`${CONST.url}photoBlog`, { lang: this.props.lang})
                      .then( (response)=> {
                          this.setState({blogs: response.data.data});

                      })
                      .catch( (error)=> {

                          this.setState({spinner: false});
                      }) .then( ()=> {
                      this.setState({spinner: false});
                  });
          })
          .catch( (error)=> {
              this.setState({spinner: false});
          })
  }

    runderItem(item){
     return(

        <View style={styles.block_section} key={item.index}>
            <Lightbox>
                <Image style={styles.image}
                    source={{ uri: item.item.img }}/>
             </Lightbox>
        </View>
    )
    }

    getCategories(item) {
        this.setState({category_id: item});
        if(item !== null)
        {

            this.setState({spinner: true});
            axios.post(`${CONST.url}sub_categories`, { lang: this.props.lang , id : item})
                .then( (response)=> {

                    this.setState({sub_categories: response.data.data});

                    axios.post(`${CONST.url}photoBlog`, { lang: this.props.lang , category_id : item})
                        .then( (response)=> {
                             this.setState({blogs: response.data.data});

                        })
                        .catch( (error)=> {

                            this.setState({spinner: false});
                        }) .then( ()=> {
                        this.setState({spinner: false});
                    });


                })
                .catch( (error)=> {

                    this.setState({spinner: false});
                })


        }else{
            this.setState({sub_categories: [], spinner: true});

            axios.post(`${CONST.url}photoBlog`, { lang: this.props.lang , category_id : null})
                .then( (response)=> {
                    this.setState({blogs: response.data.data});
                })
                .catch( (error)=> {
                    this.setState({spinner: false});
                }) .then( ()=> {
                this.setState({spinner: false});
            }) .then( ()=> {
                this.setState({spinner: false});
            });

        }
    }

    get_sub_Categories(item) {
        this.setState({sub_category_id: item, spinner: true});

        axios.post(`${CONST.url}photoBlog`, { lang: this.props.lang , category_id : this.state.category_id, sub_category_id : item})
            .then( (response)=> {
                this.setState({blogs: response.data.data});
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }) .then( ()=> {
            this.setState({spinner: false});
        }) .then( ()=> {
            this.setState({spinner: false});
        });
    }

    noResults() {
        return ( <View><Text style={{marginTop:'50%',textAlign:'center',color:'#ff6649', fontSize:22,fontFamily:'CairoRegular'}}>{I18n.translate('no_results')}</Text></View>);
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
      let containerStyle = I18nManager.isRTL ? styles.RTLContainer : styles.LTRContainer;

      return (
      <Container>

          <NavigationEvents onWillFocus={() => this.onFocus()} />
          {this.renderLoader()}

          <Header style={styles.header} >
              <Left>
                  <Button transparent onPress={() => this.props.navigation.navigate('mune')}>
                      <Icon style={styles.icons} type="Octicons" name='three-bars' />
                  </Button>
              </Left>
              <Body>
                    <Title style={styles.headerTitle}>{I18n.translate('photo_ads')}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={() => this.props.navigation.navigate('notification')}>

                      {
                          (this.props.auth) ?
                              <Icon style={styles.icons} type="Ionicons" name='md-notifications-outline' />

                              :
                              <View/>
                      }

                  </Button>
              </Right>
          </Header>


        <Content>

                <ScrollView
                    showsHorizontalScrollIndicator={false}    horizontal={true}
                                        >

                    <View     style={styles.Text}>
                        <TouchableOpacity     style={ (null === this.state.category_id)? styles.active : ""}  onPress={()=> { this.getCategories(null) }}>
                            <Text style={ (null === this.state.category_id)? styles.active : styles.Text_size}>{I18n.translate('all')}</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.categories.map((item, key) => (
                        <View  key={item.id}   style={styles.Text}>
                            <TouchableOpacity       onPress={()=> { this.getCategories(item.id ) }}>
                                <Text  style={ (item.id === this.state.category_id)? styles.active : styles.Text_size}>{item.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                </ScrollView>

                <ScrollView
                    legacyImplementation={true}
                    showsHorizontalScrollIndicator={false}    horizontal={true}

                >
                    {this.state.sub_categories.map((item, key) => (
                        <View  key={item.id}   style={styles.Text}>
                            <TouchableOpacity     style={item.id === this.state.category_id? styles.active : ""}  onPress={()=> { this.get_sub_Categories(item.id ) }}>
                                <Text  style={ (item.id === this.state.sub_category_id)? styles.active : styles.Text_size}>{item.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

            { (this.state.blogs.length === 0 && this.state.spinner === false) ? this.noResults() : null}


            <View style={{ justifyContent:'center',width: '100%' }}>
                <FlatList
                    data={ this.state.blogs}
                    style={styles.flatList}
                    keyExtractor={this._keyExtractor}
                    onEndReachedThreshold={0.5}
                    renderItem={  this.runderItem}
                    numColumns = { 1 }/>

            </View>

        </Content>

        <Tabs routeName="gallery"  navigation={this.props.navigation}/>

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
        height:85,
      borderColor           : "#ECECEC",
    },
    text : {
      fontFamily            : 'CairoRegular',
      color                 : '#444',
      marginTop             : 7,
      fontSize              : 15,
    },
    icons : {
      fontSize              : 25,
      color                 : CONST.color
    },
    Btn : {
      borderRadius           : 100,
      width                  : 35,
      height                 : 35,
      textAlign              : 'center',
      backgroundColor        : "#fff",
      paddingTop             : 2,
    },
    Btn_Icon : {
      color                  :  CONST.color,
      fontSize               : 30,
      textAlign              : 'center'
    },
    block_item : {
      alignItems              : 'center',
      justifyContent          : 'center',
      alignSelf               : 'center',
      margin                  : 15,
    },
    icon_style : {
      borderRadius            : 100,
      width                   : 40,
      height                  : 40,
      textAlign               : 'center',
      margin                  : 10
    },
    block_section : {


        marginVertical: 10,
        marginHorizontal:5,
       overflow                : 'hidden',
      flex                    : 1,
    },
    Text: {
      color                   :  CONST.color,
      padding                 : 15,
      fontFamily              : 'CairoRegular'
    },

    Text_size: {
      color                   : '#444',
      fontSize                 : 15,
      fontFamily              : 'CairoRegular'
    },
    image : {
      width                   : '100%',
      height                  : 250
    },
    RTLContainer: {
        flexDirection: 'row-reverse'
    },

    LTRContainer: {
        flexDirection: 'row-reverse'
    }
    ,active:{
        color:  CONST.color,
        fontSize: 16,
        fontFamily            : 'CairoRegular',
        shadowOpacity: 0.85,
        shadowRadius: 10,
        shadowColor: 'blue',
        shadowOffset: { height: 0, width: 0 },
    },  headerTitle:{
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
export default connect(mapStateToProps, {profile})(Gallery);




