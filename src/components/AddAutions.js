import React, { Component } from 'react';
import { StyleSheet, I18nManager } from 'react-native';
import  { Container,Icon, Content, Button,Title,Text, View, Form, Item, Input, Textarea, CheckBox,Picker} from 'native-base';

import { LinearGradient } from 'expo';
import MapView from 'react-native-maps'

class AddAutions extends React.Component {

  componentWillMount() {
    I18nManager.forceRTL(true)
  }

  constructor(props) {
    super(props);
    this.state = {

    };

  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
  
  render() {
    return (
      <Container>

        <View style={styles.header}>
            <View>
                <Title style={styles.texts}>اضافه مزاد</Title>
            </View>
            <View>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                </Button>
            </View>
        </View>

        <Content>

            <View style={styles.block_section}>
                <View style={styles.move}>
                    <Icon style={styles.icon} active type="Feather" name='chevron-left' />
                    <View style={styles.block_up}>
                        <Text style={styles.textes}>اختر القسم</Text>
                    </View>
                </View>
            </View>

            <View style={styles.upload}>
                <Text style={styles.textes}>اضف صوره ( 8 كحد اقصي ) - اضف فيديو ( 1 كحد اقصي )</Text>
                <View style={styles.clickUpload}>
                    <View style={styles.blockUpload}>                        
                        <Icon style={styles.iconUpload} active type="AntDesign" name='pluscircleo' />
                        <Text style={styles.textes}>
                             اضف فيديو او صور
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.block_section}>
                <Form style={styles.form}>
                    <Item style={styles.item}>
                        <Input style={styles.input} placeholder="* عنوان المزاد" />
                    </Item>
                    <Item style={styles.item}>
                        <Input style={styles.input} placeholder="* المدينه" />
                    </Item>
                    <Item style={styles.item}>
                        <Input style={styles.input} placeholder="* العمله" />
                    </Item>
                    <Item style={styles.item}>
                        <Input style={styles.input} placeholder="* بدايه السعر" />
                    </Item>
                    <Item style={styles.item}>
                        <Textarea style={styles.textarea} rowSpan={5} bordered placeholder="* الوصف" />
                    </Item>
                    {/* <Item style={styles.itemPiker} regular>
                        <Picker
                            mode="dropdown"
                            containerStyle={styles.Picker}
                            placeholderStyle={{ color: "#c5c5c5", writingDirection: 'rtl' }}
                            iosIcon={<Icon name="arrow-down" style={styles.iconPicker} />}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}
                            textStyle={{ color: "#acabae" }}
                            placeholder="العمله"
                            itemTextStyle={{ color: '#c5c5c5' }}>
                            <Picker.Item label="السنبلاوين" value="key0" />
                            <Picker.Item label="مصر" value="key1" />
                            <Picker.Item label="السعوديه" value="key2" />
                            <Picker.Item label="الكويت" value="key3" />
                            <Picker.Item label="انجولا" value="key4" />
                        </Picker>
                    </Item>
                    <Item style={styles.itemPiker} regular>
                        <Picker
                            mode="dropdown"
                            containerStyle={styles.Picker}
                            placeholderStyle={{ color: "#c5c5c5", writingDirection: 'rtl' }}
                            iosIcon={<Icon name="arrow-down" style={styles.iconPicker} />}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}
                            textStyle={{ color: "#acabae" }}
                            placeholder="اختر البلد"
                            itemTextStyle={{ color: '#c5c5c5' }}>
                            <Picker.Item label="السنبلاوين" value="val0" />
                            <Picker.Item label="مصر" value="val1" />
                            <Picker.Item label="السعوديه" value="val2" />
                            <Picker.Item label="الكويت" value="val3" />
                            <Picker.Item label="انجولا" value="val4" />
                        </Picker>
                    </Item> */}
                </Form>
            </View>

            <Text style={[styles.textes , styles.textsetting]}>مشاركه الموقع</Text>
            
            <MapView style={styles.map} initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421, }} />

            <LinearGradient style={styles.bgLiner} start={{x: 0, y: 0.75}} end={{x: 1, y: 0.25}} colors={['#12d0f2', '#7af5ad']}>
                <Text style={styles.textBtn}>استكمال</Text>
            </LinearGradient>

        </Content>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
    header : {
        backgroundColor         : "transparent",
        justifyContent          : 'space-between',
        flexDirection           : 'row',
        paddingTop              : 25,
        paddingRight            : 5,
        paddingLeft             : 5,
        borderWidth             : 1,
        borderColor             : "#ECECEC",
    },
    texts : {
        fontFamily              : 'CairoRegular',
        color                   : '#444',
        marginTop               : 7,
        fontSize                : 15,
        marginLeft              : 15
    },
    icons : {
        fontSize                : 20,
        color                   : "#68d9fa"
    },
    block_section : {
        margin                  : 15,
        padding                 : 5,
        borderRadius            : 5,
        backgroundColor         : '#fff',
        shadowColor             : '#444',
        shadowOffset            : { width: 0 , height : 0 },
        shadowOpacity           : 0.2,
        elevation               : 5,
        alignItems              : 'center',
    },
    move : {
        flexDirection           : 'row-reverse',
        justifyContent          : 'space-between',
        width                   : '100%'
    },
    block_up : {
        flexDirection           : 'row-reverse',
        margin                  : 5,
    },
    icon_up : {
        marginTop               : 3,
        marginRight             : 5,
        color                   : '#444',
        fontSize                : 20,
    },
    icon : {
        color                   : '#444',
        fontSize                : 20,
        alignItems              : 'center',
        justifyContent          : 'center', 
        alignSelf               : 'center',
        lineHeight              : 40,
    },
    upload : {
        backgroundColor         : '#fafafa',
        padding                 : 10,
        margin                  : 10,
        borderRadius            : 5,
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center', 
        alignSelf               : 'center',
        width                   : '90%'
    },
    textes : {
        fontFamily              : 'CairoRegular',
        fontSize                : 13,
        color                   : '#444',
        margin                  : 5
    },
    iconUpload : {
        color                   : '#bbbb'
    },
    blockUpload : {
        margin                  : 15,
        textAlign               : "center",
        borderColor             : '#bbbb', 
        borderStyle             : "dashed",
        borderWidth             : 1,
        borderRadius            : 5,
        padding                 : 10,
         alignItems              : 'center',
        justifyContent          : 'center', 
        alignSelf               : 'center',
        overflow                : 'hidden'
    },
    form : {
        padding                 : 10,
    },
    item : {
        width                   : '100%',
        padding                 : 0,
        borderColor             : '#DDD',
    },
    input : {
        textAlign               : 'right',
        color                   : '#444',
        borderColor             : '#DDD',
        fontFamily              : 'CairoRegular',
        fontSize                : 13
    },
    textarea : {
        textAlign               : 'right',
        color                   : '#444',
        borderColor             : '#DDD',
        fontFamily              : 'CairoRegular',
        fontSize                : 13,
        borderTopColor          : '#ffffff',
        borderLeftColor         : '#ffffff',
        borderRightColor        : '#ffffff',
        borderBottomColor       : '#DDD',
        borderWidth             : 0.5,
        width                   : '100%',
        padding                 : 0
    },
    blocksetting : {
        flexDirection           : 'row',
        justifyContent          : 'space-between',
        padding                 : 15,
        position                : 'relative',
        
    },
    listitem : {
        backgroundColor         : '#FFF',
        paddingTop              : 20,
        paddingBottom           : 20,
        width                   : 95,
        height                  : 140,
        position                : 'relative',
    },
    chickbox : {
        position                : 'absolute',
        top                     : -5,
        left                    : -7,
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center', 
        alignSelf               : 'center',
    },
    textsetting : {
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center', 
        alignSelf               : 'center',
    },
    iconsetting : {
        color                   : '#FFF',
        fontSize                : 22,
    },
    Picker : {
        width                   : '100%', 
        borderWidth             : 0,
        fontSize                : 14,
        fontFamily              : 'CairoRegular',
    },
    itemPiker : {
        borderWidth             : 0, 
        borderColor             : '#FFF', 
        borderBottomColor       : "#DDD" ,
        width                   : '100%',
        position                : 'relative',
        padding                 : 5,
        alignItems              : 'center',
        justifyContent          : 'center', 
        alignSelf               : 'center',
        fontSize                : 14,
        fontFamily              : 'CairoRegular',
        writingDirection        : 'rtl',
    },
    blockIcon : {
        width                   : 40,
        height                  : 40,
        lineHeight              : 40,
        borderRadius            : 100,
        backgroundColor         : '#DDD',
        textAlign               : 'center',
        alignItems              : 'center',
        justifyContent          : 'center', 
        alignSelf               : 'center',
        margin                  : 10
    },
    tesetting : {
        textAlign               : 'center',
        fontSize                : 13,
        fontFamily              : 'CairoRegular'
    },
    map : {
      width                     : '90%',
      height                    : 150,
      alignItems                : 'center',
      justifyContent            : 'center', 
      alignSelf                 : 'center',
      margin                    : 5,
      borderRadius              : 10,
    },
    bgLiner:{
        borderRadius            : 5,
        width                   : 170,
        alignItems              : 'center',
        justifyContent          : 'center', 
        alignSelf               : 'center',
        margin                  : 15
    },
    textBtn : {
        textAlign               : 'center',
        color                   : '#fff',
        fontSize                : 16,
        padding                 : 3,
        fontFamily              : 'CairoRegular',  
    },
});


export default AddAutions;