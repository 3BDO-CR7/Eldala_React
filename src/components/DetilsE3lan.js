import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    Linking,
    ScrollView,
    TouchableOpacity, BackHandler, I18nManager as RNI18nManager, ActivityIndicator,
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
import ImageViewer from 'react-native-image-zoom-viewer';
import Swiper from 'react-native-swiper';
import MapView from 'react-native-maps'
import { Video } from 'expo-av'
import Modal from "react-native-modal";
import axios from "axios";
import {NavigationEvents} from "react-navigation";
import I18n from "ex-react-native-i18n";
import CONST from '../consts';
import marker from '../../assets/marker.png'
import {connect} from "react-redux";
import {profile, userLogin} from "../actions";
import HTML from "react-native-render-html";
import Tabs from "./Tabs";


class DetilsE3lan extends Component {

  constructor(props) {
    super(props);
      RNI18nManager.forceRTL(true);
      this.state = {
        blog         : '',
        comment      : '',
        lang         : this.props.lang,
        is_favourite : 0,
        images       : [],
        comments     : [],
        all_comments : [],
        results      : [],
        user_id      : null,
        isImageViewVisible: false,
        is_video     : false,
        region: {
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            latitude: null,
            longitude: null
        },
        selected2: undefined,
        showSwiper    : true,
        isModalVisible    : false,
        commentModal      : false,
        addComment        : false,
        type : null,
          spinner: true,
          index : 0,
          resetImageByIndex : 0
    };


  }

    favourite() {
      axios.post(`${CONST.url}favouriteBlog`, { lang: this.props.lang , id : this.props.navigation.state.params.blog_id  , user_id : this.state.user_id})
          .then( (response)=> {
              Toast.show({ text: response.data.msg, duration : 2000  ,type :"warning", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
              this.setState({is_favourite: response.data.fav});
          })
          .catch( (error)=> {
              Toast.show({ text:error.message, duration : 2000  ,type :"warning", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

              this.setState({spinner: false});
          }) .then( ()=> {
          this.setState({spinner: false});
      })
    }

    componentWillMount() {

        if(this.props.auth !== null) {
            this.setState({user_id  : this.props.auth.data.id})
        }

        axios.post(`${CONST.url}BlogDetails`, { lang: this.state.lang , id : this.props.navigation.state.params.blog_id  , user_id : this.state.user_id})
            .then( (response)=> {
                if(response.data.value === '0')
                {
                     this.props.navigation.navigate('home')
                }else{
                    this.setState({blog: response.data.data});
                    this.setState({images: response.data.data.images});
                    this.setState({results: response.data.data.results});
                    this.setState({is_favourite: response.data.data.is_fav});
                    this.setState({comments: response.data.data.comments.slice(Math.max(response.data.data.comments.length - 2 ))});
                    this.setState({all_comments: response.data.data.comments});
                    this.setState({
                        region: {
                            latitude: response.data.data.latitude,
                            longitude: response.data.data.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }
                    });
                }

            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then( ()=> {
                this.setState({spinner: false});
        })
    }

    onFocus(){
        this.componentWillMount()
    }

    renderMap() {
        if(this.state.region.latitude !== null) {
            return (
                <View  >
                    <MapView
                        style={styles.map}
                        showsBuildings={true}
                        minZoomLevel={12}


                        zoomEnabled

                        initialRegion={this.state.region}
                        //onRegionChangeComplete={this.onRegionChange}

                    />
                    <View style={styles.markerFixed}>
                        <Image style={styles.marker} source={marker} />
                    </View>

                </View>
            )
        }
    }

    CommentBlog() {

        if(this.state.comment === '')
        {
            Toast.show({ text: (this.state.lang == 'en') ? 'Leave suitable comment' : 'اترك تعليق مناسب', duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }else{
            this.setState({spinner: true});

            axios.post(`${CONST.url}CommentBlog`, { lang: this.props.lang ,comment: this.state.comment, blog_id : this.props.navigation.state.params.blog_id , user_id : this.state.user_id })
                .then( (response)=> {
                    this.setState({comment: ''});
                    this.state.comments.push(response.data.data);
                    this.state.all_comments.push(response.data.data);

                })
                .catch( (error)=> {
                    this.setState({spinner: false});
                }) .then( ()=> {
                this.setState({spinner: false});
            })
        }

    }

    commentModal(type){

    if (type == 1){
        this.setState({ commentModal: true })
    }else if(type == 2){
        this.setState({ commentModal: true, addComment: false  });
    }else{
        this.setState({ commentModal: false, addComment: true  })
    }
    }

    delete(id , i,type) {
        this.setState({spinner: true});

        axios.post(`${CONST.url}delete_comment`, { lang: this.props.lang ,id: id })
            .then( (response)=> {
                if(response.data.value === '1')
                {
                    if(type === 'modal')
                    {
                        this.state.all_comments.splice(i,1);

                    }else{
                        this.state.comments.splice(i,1);

                    }

                    Toast.show({ text: response.data.msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                }else{
                    Toast.show({ text: response.data.msg, duration : 2000  ,type :"success", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                }

            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }) .then( ()=> {
            this.setState({spinner: false});
        })
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

              <Left>
                  <Button transparent onPress={()=> this.favourite()} >
                      {
                          (this.props.auth) ?
                              <Icon style={{color : '#F00',fontSize:24}} type="MaterialIcons"  name={(this.state.is_favourite ===  '1')? 'favorite' : 'favorite-border'}/>
                              :
                              <View/>
                      }
                  </Button>
              </Left>
              <Body style={{flex:1}}>
                <Title style={styles.headerTitle}>{ this.state.blog.title}</Title>
              </Body>
              <Right>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

          <Content>

            <View style={styles.block_slider}>
                <Swiper
                    containerStyle={[styles.wrapper]}
                    autoplayDelay={1.5}
                    autoplayLoop
                    key={this.state.images.length}
                    autoplayTimeout={2}
                    autoplay={true}
                >
                    {
                        this.state.images.map((slider, i) => {
                            return (
                                <View key={i}>
                                    <TouchableOpacity onPress={() => {this.setState({isImageViewVisible: true,resetImageByIndex : i,})}}>
                                        <Image style={styles.slide} source={{uri: slider.url}} resizeMode={'stretch'} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </Swiper>
            </View>

              <Modal style={{backgroundColor:'transeprent'}} visible={this.state.isImageViewVisible} transparent={true} enableImageZoom={true}  enableSwipeDown={true} >
                  <ImageViewer style={{backgroundColor:'transeprent'}} imageUrls={this.state.blog.images} index={this.state.resetImageByIndex}/>
                  <TouchableOpacity  style={{ position:'absolute' , top : 35 , right : 20}} onPress={() => this.setState({isImageViewVisible: false})}>
                      <Icon name="close" style={{fontSize:30,color : 'white'   }}/>
                  </TouchableOpacity>
              </Modal>

              <ScrollView showsHorizontalScrollIndicator={false}  style={{flex : 1, marginVertical: 15 , marginHorizontal: 10}}   horizontal={true}>
                  <Text style={{color  : "#444",fontFamily  : 'CairoRegular', fontSize: 20}}> { this.state.blog.title} </Text>
              </ScrollView>

              <View style={styles.block_Content}>

                {
                      (this.state.blog.is_phone === true) ?
                          <TouchableOpacity onPress={()=> { Linking.openURL(`tel://${this.state.blog.mobile}`)}}>
                              <View style={styles.block_Call}>
                                  <Text style={styles.block_Call_text}>{I18n.translate('call')}</Text>
                                  <View style={styles.iconFix}>
                                      <Icon style={[ styles.icon_blcok , styles.call ]} type="MaterialIcons" name='call' />
                                  </View>
                              </View>
                          </TouchableOpacity>
                          :
                          <View/>
                  }

                  {
                      (this.state.blog.is_phone === true) ?
                          <TouchableOpacity onPress={()=> {    Linking.openURL(
                              'http://api.whatsapp.com/send?phone=' + this.state.blog.mobile);}}>
                              <View style={styles.block_Call}>
                                  <Text style={styles.block_Call_text}>{I18n.translate('whats')}</Text>
                                  <View style={styles.iconFix}>
                                      <Icon style={[ styles.icon_blcok , styles.whats ]} type="FontAwesome" name='whatsapp' />
                                  </View>
                              </View>
                          </TouchableOpacity>
                          : <View/>
                  }

                  {
                      (this.state.blog.is_chat === true && this.props.auth) ?
                          <TouchableOpacity

                              onPress={()=>{
                                  this.props.navigation.navigate('chatroom' , {
                                      other : this.state.blog.user_id,
                                      room  : this.props.navigation.state.params.blog_id
                                  })
                              }}
                          >
                              <View style={styles.block_Call}>
                                  <Text style={styles.block_Call_text}>{I18n.translate('send_mail')}</Text>
                                  <View style={styles.iconFix}>
                                      <Icon style={[ styles.icon_blcok , styles.email ]} type="Entypo" name='chat' />
                                  </View>
                              </View>
                          </TouchableOpacity>
                          : <View/>
                  }

            </View>

              {

                  (this.state.blog.is_video === '1')

                  ?
                      <TouchableOpacity onPress={()=> this.setState({is_video : true})}>
                          <Text  style={{ textAlign: 'center' }}>
                              <Icon name="video" type="Entypo" style={{color: '#F00'}}/>
                          </Text>
                      </TouchableOpacity>
                  :
                  <View/>

              }

              <View style={styles.Detils_one}>
                    <Text style={styles.up_text}>{I18n.translate('info')}</Text>
              </View>

              <View style={{flex: 1, flexDirection:'column' , margin:10}}>

                  <View style={{ padding: 15}}>

                      <View style={{flexDirection:'row' , justifyContent:'center'}}>
                          <Text  style={{flex : 1 ,textAlign:'left',fontFamily  : 'CairoRegular'}}> {I18n.translate('id')}</Text>
                          <Text style={{flex: 2,textAlign:'left',fontFamily  : 'CairoRegular'}}>{this.state.blog.id} </Text>
                      </View>

                      <View style={{flexDirection:'row' , justifyContent:'center'}}>
                          <Text  style={{flex : 1 ,textAlign:'left',fontFamily  : 'CairoRegular'}}> {I18n.translate('country')}</Text>
                          <Text style={{flex: 2,textAlign:'left',fontFamily  : 'CairoRegular'}}>{this.state.blog.country} </Text>
                      </View>

                      <View style={{flexDirection:'row' , justifyContent:'center'}}>
                          <Text  style={{flex : 1 ,textAlign:'left',fontFamily  : 'CairoRegular'}}> {I18n.translate('city')}</Text>
                          <Text style={{flex: 2,textAlign:'left',fontFamily  : 'CairoRegular'}}>{this.state.blog.city} </Text>
                      </View>

                      <View style={{flexDirection:'row' , justifyContent:'center'}}>
                          <Text  style={{flex : 1 ,textAlign:'left',fontFamily  : 'CairoRegular'}}> {I18n.translate('category')}</Text>
                          <Text style={{flex: 2,textAlign:'left',fontFamily  : 'CairoRegular'}}>{this.state.blog.category} </Text>
                      </View>


                      <View style={{flexDirection:'row' , justifyContent:'center'}}>
                          <Text  style={{flex : 1 ,textAlign:'left',fontFamily  : 'CairoRegular'}}> {I18n.translate('sub_category')}</Text>
                          <Text style={{flex: 2,textAlign:'left',fontFamily  : 'CairoRegular'}}>{this.state.blog.SubCategory} </Text>
                      </View>


                  </View>

              </View>

              <View style={styles.Detils}>

                  <Text style={styles.up_text}>{I18n.translate('details')}</Text>

                  <View style={{flex: 1, flexDirection:'column'}}>
                      <View style={[{flex:1}]}>
                          <HTML
                            html={this.state.blog.description}
                            baseFontStyle={{fontSize:16,fontFamily : 'CairoRegular' , textAlign:'center'}}
                            imagesMaxWidth={Dimensions.get('window').width}
                          />
                      </View>

                  </View>
            </View>

            <View style={styles.bgLiner}>
                <Text style={styles.textBtn}>{ I18n.translate('price')} : {this.state.blog.price}  </Text>
            </View>

              { this.renderMap() }

            <View style={styles.comment}>

                <Text style={{  marginLeft : 15, marginBottom: 5, fontFamily : 'CairoRegular', color : "#6cdcfa", textAlign:'center'}}>{I18n.translate('comments')}</Text>

                {this.state.comments.map((comment, i) => {
                    return (

                            <View  key ={i} style={styles.massage_user}>
                                <View style={styles.user}>
                                    <Text style={styles.time}>{comment.date}</Text>
                                    <View style={styles.views}>
                                        <Text style={styles.text_user}>
                                            {comment.user}
                                        </Text>
                                        <Icon style={styles.icon_user} type="FontAwesome" name='user' />
                                    </View>
                                </View>
                                <View style={styles.block_massage}>
                                    <Text style={styles.massage}>{comment.comment}</Text>
                                </View>


                                {
                                    (this.state.user_id == comment.user_id)
                                        ?

                                        <TouchableOpacity  style={styles.block_report} onPress={()=>{this.delete(comment.id,i,'original') }}>

                                            <View>
                                                <Icon  style={styles.report} type="FontAwesome" name='trash' />
                                            </View>

                                        </TouchableOpacity>


                                        : <View></View>
                                }


                            </View>

                    )
                })}


                {
                    (this.props.auth) ?
                        <View style={styles.write_comment}>
                            <TouchableOpacity onPress={() => this.commentModal(2)}>
                                <Text style={styles.text_btn}
                                      onChangeText={(comment) => this.changeFocusName(comment)}>{(this.state.all_comments.length === 0) ? I18n.translate('addComment') : I18n.translate('more')}</Text>
                            </TouchableOpacity>
                        </View>

                        :
                        <View/>

                }
            </View>

              <Modal isVisible={this.state.is_video} onBackdropPress={() => this.setState({ is_video: false })}>
                  <View style={[styles.model,{backgroundColor:'#444'}]}>
                      <Video
                          source={{ uri: this.props.navigation.state.params.vid }}
                          shouldPlay
                          resizeMode="contain"
                          style={{ width : '95%', height: '90%' }}
                      />
                  </View><View style={[styles.model,{backgroundColor:'#444'}]}>
                  <TouchableOpacity   onPress={() =>  {this.setState({is_video : false} )}}>
                      <Text style={{color :'white',textAlign:'center',fontSize:22 , fontFamily            : 'CairoRegular'}}>{I18n.translate('cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </Modal>


            <View style={styles.old_section}>
                <Text style={styles.up_text}>{I18n.translate('like')}</Text>

                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>

                    {this.state.results.map((result, i) => {
                        return (


                            <View   key={i}   style={styles.block_section}>

                                <TouchableOpacity  onPress={() => { this.props.navigation.navigate(
                                    {
                                        routeName: 'details',
                                        params: {
                                            blog_id: result.id,
                                        },
                                        key: 'APage' + i
                                    }
                                ) } } >
                                <View style={styles.section_img}>
                                    <Image style={styles.image} source={{uri:result.img}}/>
                                </View>
                                <View style={styles.Detils_text}>
                                    <Text style={styles.titles}>{result.title}</Text>
                                    <View style={styles.user}>
                                        <View style={styles.views}>
                                            <Text style={styles.text_user}>
                                                {result.date}
                                            </Text>
                                        </View>
                                        <View style={styles.views}>
                                            <Text style={styles.text_user}>
                                                {result.user}
                                            </Text>
                                            <Icon style={styles.icon_user} type="FontAwesome" name='user' />
                                        </View>

                                    </View>

                                </View>
                                </TouchableOpacity>


                            </View>
                        )

                    })}


                </ScrollView>
            </View>

      </Content>

          <Modal onBackdropPress={() => this.setState({ commentModal: false })} isVisible={this.state.commentModal}>
              <View style={styles.model}>

                  <View style={[styles.comment , {width:'100%'}]}>
                      <Text style={styles.up_text}>{I18n.translate('comments')}</Text>
                      <ScrollView style={styles.scroll }      ref={ref => this.scrollView = ref}
                                  onContentSizeChange={(contentWidth, contentHeight)=>{
                                      this.scrollView.scrollToEnd({animated: true});
                                  }}>
                          {this.state.all_comments.map((comment, i) => {
                              return (

                                  <View  key ={i} style={styles.massage_user}>
                                      <View style={styles.user}>
                                          <Text style={styles.time}>{comment.date}</Text>
                                          <View style={styles.views}>
                                              <Text style={styles.text_user}>
                                                  {comment.user}
                                              </Text>
                                              <Icon style={styles.icon_user} type="FontAwesome" name='user' />
                                          </View>
                                      </View>
                                      <View style={styles.block_massage}>
                                          <Text style={styles.massage}>{comment.comment}</Text>
                                      </View>
                                      {
                                          (this.state.user_id == comment.user_id)
                                              ?

                                              <TouchableOpacity  style={styles.block_report} onPress={()=>{this.delete(comment.id,i,'modal') }}>

                                                  <View>
                                                      <Icon  style={styles.report} type="FontAwesome" name='trash' />
                                                  </View>

                                              </TouchableOpacity>


                                              : <View></View>
                                      }

                                  </View>

                              )
                          })}
                      </ScrollView>


                      <Item style={{marginTop:10}} >
                          <Input  value={this.state.comment} onChangeText={(comment)=> this.setState({comment: comment})}  style={{ textAlign : 'center',fontFamily            : 'CairoRegular'}} placeholder={I18n.translate('leave_comment')}/>

                      </Item>

                      <View style={styles.write_comment}>

                            <TouchableOpacity>
                                 <Text onPress={() => this.CommentBlog()} style={styles.text_btn}>{I18n.translate('addComment')}</Text>
                            </TouchableOpacity>

                      </View>

                   </View>
               </View>
          </Modal>

          <Tabs routeName="home" navigation={this.props.navigation}/>

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
        fontSize              : 24,
        color                 :  CONST.color
    },
    icon_whats : {
      fontSize              : 20,
      marginRight           : 10,
      marginLeft            : 10,
      color                 : "#54B844"
    },
    block_slider : {
      width                 : '90%',
      borderRadius          : 10,
      margin                : 10,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
    },
    wrapper : {
      height                : 150,
      width                 : '100%',
    },
    slide : {
      width                 : "100%",
      height                : 150,
    },
    Btn : {
      borderRadius          : 100,
      width                 : 35,
      height                : 35,
      textAlign             : 'center',
      backgroundColor       : "#fff",
      paddingTop            : 2,
    },
    Btn_Icon : {
      color                 :  CONST.color,
      fontSize              : 30,
      textAlign             : 'center'
    },
    block_Content : {
      display               : 'flex',
      flexDirection         : 'row',
      width                 : '100%',
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      margin                : 15,
    },
    block_Call : {
      // shadowColor           : '#ECECEC',
      // shadowOffset          : { width: 0 , height : 5 },
      // shadowOpacity         : 0.1,
      // elevation             : 5,
      flexDirection         : "row-reverse",
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      borderRadius          : 5,
      borderWidth           : 1,
      borderColor           : "#ECECEC",
      padding               : 10,
      width                 : 110,
      position              : 'relative',
      margin                : 5
    },
    block_Call_text:{
      fontSize              : 12,
      textAlign             : 'center',
      fontFamily            : 'CairoRegular',
    },
    icon_blcok : {
      fontSize              : 14,
    },
    iconFix : {
      position              : 'absolute',
      width                 : 27,
      height                : 27,
      lineHeight            : 27,
      top                   : -13,
      right                 : -5,
      backgroundColor       : "#fff",
      borderRadius          : 100,
      zIndex                : 99,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      borderWidth           : 1,
      borderColor           : "#ECECEC",
    },
    call : {
      color                 :  CONST.color,
    },
    whats : {
      color                 : "#54B844",
    },
    email : {
      color                 :  CONST.color,
    },
    Detils : {
      flex                  : 1,
      marginTop             : 10,
      borderBottomWidth     : 1,
      borderBottomColor     : "#DDD",
      paddingBottom         : 15,
        justifyContent:'center',
        alignItems : 'center'
    },

    Detils_one : {
         flex                  : 1,
        marginTop             : 10,
        justifyContent:'center',
        alignItems : 'center'
    },
    up_text : {
      marginLeft            : 15,
      marginBottom          : 5,
      fontFamily            : 'CairoRegular',
      color                 : CONST.color,
    },
    sup_Detils : {


    },
    text_Detils : {
      color                 : "#444",
      fontFamily            : 'CairoRegular',
      textAlign             : 'left',
    },
    block_Detils : {
      flexDirection         : 'row',
      flexWrap              : 'wrap',
    },
    bgLiner:{
      borderRadius          : 5,
      width                 : 200,
      height                : 50,
       backgroundColor       : CONST.color,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      margin                : 15
    },
    textBtn : {
      textAlign             : 'center',
      color                 : '#fff',
      fontSize              : 16,
      padding               : 3,
      fontFamily            : 'CairoRegular',
    },
    map : {
      width                 : '90%',
      height                : 150,
      alignItems            : 'center',
      justifyContent        : 'center',
      alignSelf             : 'center',
      margin                : 5,
      borderRadius          : 10,
    },


    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 48,
        width: 48
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: 0,
        position: 'absolute',
        width: '100%'
    },
    region: {
        color: '#fff',
        lineHeight: 20,
        margin: 20
    },
    comment : {
      display               : 'flex',
      alignItems            : 'flex-start',
      margin                : 10,
    },
    scroll : {
      height                : 250,
      width                 : '100%',
      borderBottomColor     : '#DDD',
      borderBottomWidth     : 1,
      paddingBottom         : 80
    },
    massage_user : {
      borderWidth           : 1,
      borderColor           : '#DDD',
      width                 : '90%',
      alignItems            : 'center',
      alignSelf             : 'center',
      margin                : 5,
      borderRadius          : 10,
      position              : 'relative'
    },
    user : {
      display               : 'flex',
      flexDirection         : 'row-reverse',
      justifyContent        : 'space-between',
      width                 : '100%',
      padding               : 10,
      alignItems            : 'flex-end',
    },
    text_user : {
      fontFamily            : 'CairoRegular',
      color                 :  CONST.color,
    },
    icon_user : {
      // color                 : '#444',
      fontSize              : 16,
      color                 : CONST.color,
      marginRight           : 5,
      marginTop             : 5
    },
    views : {
      display               : 'flex',
      flexDirection         : 'row-reverse',
    },
    time : {
      fontFamily            : 'CairoRegular',
      color                 : "#444",
    },
    massage : {
      fontFamily            : 'CairoRegular',
      color                 : "#444",
      margin                : 5
    },
    block_report : {
      borderRadius          : 100,
      width                 : 30,
      height                : 30,
      position              : 'absolute',
      bottom                : -10,
      right                 : -10,
      backgroundColor       : '#333',
      textAlign             : 'center',
    },
    report : {
      color                 : "#F00",
      fontSize              : 15,
      lineHeight            : 30,
      textAlign             : 'center'
    },
    model : {
      backgroundColor       : '#FFF',
      borderRadius          : 10,
      textAlign             : "center",
      alignItems            : 'center',
      alignSelf             : 'center',
      width                 : '100%'
    },
    text_model : {
      padding               : 10,
      borderTopWidth        : 1,
      borderTopColor        : "#DDD",
      fontFamily            : 'CairoRegular'
    },
    write_comment : {
      margin                : 15,
      borderRadius          : 10,
      borderColor           : '#ddd',
      borderWidth           : 1,
      textAlign             : "center",
      alignItems            : 'center',
      alignSelf             : 'center',
      width                 : 150,
      padding               : 7
    },
    text_btn : {
      fontFamily            : 'CairoRegular'
    },
    write : {
      width                 : '100%',
      fontFamily            : 'CairoRegular',
      textAlign             : 'right'
    },
    btn_click : {
      textAlign             : "center",
      alignItems            : 'center',
      alignSelf             : 'center',
      width                 : 100,
      margin                : 5
    },
    btn_text : {
      color                 : '#FFF',
      textAlign             : 'center',
      fontFamily            : 'CairoRegular',
      width                 : '100%',
    },
    old_section : {
      display               : 'flex',
      alignItems            : 'flex-start',
      marginBottom          : 20
    },
    block_section : {
      width                 : 150,
      height                : 180,
      margin                : 5,
      borderRadius          : 10,
      borderWidth           : 1,
        zIndex :99,
      borderColor           : '#DDD',
      overflow              : 'hidden'
    },
    image : {
      width                 : '100%',
      height                : 110
    },
    titles : {
      textAlign             : 'center',
      marginTop             : 4,
      color                 : '#444',
      fontFamily            : 'CairoRegular',
    },
    headerTitle:{
        color                 : '#444',
        fontFamily            : 'CairoRegular',
    },    scroll2: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#DDD',
        marginBottom: 10
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
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(DetilsE3lan);

