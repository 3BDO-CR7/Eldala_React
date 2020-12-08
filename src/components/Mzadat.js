import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, I18nManager,ScrollView,FlatList } from 'react-native';
import  { Container, Content, Header, Left, Body, Right, Button, Icon, Title, Input} from 'native-base';

import Tabs from './Tabs';

class Mzadat extends Component {

  componentWillMount() {
    I18nManager.forceRTL(true)
  }

  runderItem(item){
    return(
        <View style={styles.block_section}>
            <View style={styles.section_img}>
                <Image style={styles.image} source={require('../../assets/11.png')}/>
            </View>
            <View style={styles.Detils_text}>
                <Text style={styles.titles}>لاب توب اتش بي</Text>
                <View style={styles.user}>
                    <View style={styles.views}>
                        <Text style={styles.text_user}>
                        100 ر.س
                        </Text>
                        <Icon style={styles.icon_user} type="FontAwesome" name='map-marker' />
                    </View>
                    <View style={styles.views}>
                        <Text style={styles.text_user}>
                        4
                        </Text>
                        <Icon style={styles.icon_user} type="FontAwesome" name='image' />
                    </View>
                </View>
            </View>
        </View>
    )
  }

  render() {
    return (
      <Container>
        <View style={styles.header}>
            <View>
                <Button transparent onPress={() => this.props.navigation.navigate('mune')}>
                    <Icon style={styles.icons} type="Octicons" name='three-bars' />
                </Button>
            </View>
            <View>
                <Title style={styles.text}>مزادات</Title>
            </View>
            <View>
                <Button transparent onPress={() => this.props.navigation.navigate('notification')}>
                    <Icon style={styles.icons} type="Ionicons" name='md-notifications-outline' />
                </Button>
            </View>
        </View>
        <Content>

            <View style={styles.view_Links}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.scroll}>

                <Text style={styles.Text}>الكل</Text>
                <Text style={styles.Text}>حراج سيارات</Text>
                <Text style={styles.Text}>حراج العقار</Text>
                <Text style={styles.Text}>حراج الالكترونيات</Text>
                <Text style={styles.Text}>حراج السيارات</Text>
                <Text style={styles.Text}>حراج سيارات</Text>
                <Text style={styles.Text}>حراج العقار</Text>
                <Text style={styles.Text}>حراج الالكترونيات</Text>
                <Text style={styles.Text}>حراج سيارات</Text>
                <Text style={styles.Text}>حراج العقار</Text>
                <Text style={styles.Text}>حراج الالكترونيات</Text>
                <Text style={styles.Text}>حراج سيارات</Text>
                <Text style={styles.Text}>حراج العقار</Text>
                <Text style={styles.Text}>حراج الالكترونيات</Text>
                <Text style={styles.Text}>حراج الالكترونيات</Text>

                </ScrollView>
            </View>

            <FlatList style={{width : '100%'}} data={[{key: 'a'}, {key: 'b'}]}
            renderItem={({item}) => this.runderItem(item)}
            numColumns = { 2 }
            />

        </Content>

        <Tabs routeName="mzadat"  navigation={this.props.navigation}/>

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
    },
    text : {
      fontFamily            : 'CairoRegular',
      color                 : '#444',
      marginTop             : 7,
      fontSize              : 15,
    },
    icons : {
      fontSize              : 20,
      color                 : "#2977B3"
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
      color                 : "#2977B3",
      fontSize              : 30,
      textAlign             : 'center'
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
      margin                : 5,
      borderRadius          : 10,
      borderWidth           : 1,
      borderColor           : '#DDD',
      overflow              : 'hidden',
      flex                  : 1,
      width                 : '100%'
    },
    Text: {
        color                 : '#2977B3',
        padding               : 15,
        fontFamily            : 'CairoRegular'
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
    views : {
      display               : 'flex',
      flexDirection         : 'row-reverse',
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
      color                 : "#444",
    },
    icon_user : {
      color                 : '#2977B3',
      fontSize              : 16,
      marginRight           : 5,
      marginTop             : 5
    },
});

export default Mzadat;