import React, { Component } from 'react';
import { StyleSheet, Text, View,ScrollView } from 'react-native';
import  {  Button, Icon, Textarea, Form} from 'native-base';

  import { MapView } from 'expo';

class Comments extends Component {


    componentDidMount()
    {

        this.refs.scrollView.scrollToEnd({animated: true});
    }
    render() {
        return (

                <ScrollView style={styles.scroll} ref="scrollView">
                    <View style={styles.massage_user}>
                        <View style={styles.user}>
                            <Text style={styles.time}>قبل ٣ ساعات</Text>
                            <View style={styles.views}>
                                <Text style={styles.text_user}>
                                    شعوذه
                                </Text>
                                <Icon style={styles.icon_user} type="FontAwesome" name='user' />
                            </View>
                        </View>
                        <View style={styles.block_massage}>
                            <Text style={styles.massage}>اهلا بك ف عالم الحيوان ياولاد الندم</Text>
                        </View>
                        <View style={styles.block_report}>
                            <Icon onPress={this.toggleModal} style={styles.report} type="FontAwesome" name='flag' />
                        </View>
                    </View>
                    <Form style={{ width : '100%', padding : 10 }}>
                        <Textarea style={styles.write} rowSpan={5} bordered placeholder="اكتب تعليقك هنا..." />
                    </Form>
                    <Button style={styles.btn_click}><Text style={styles.btn_text} onPress={() => this.commentModal(2)}>تعليق</Text></Button>
                </ScrollView>

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
        marginLeft            : 15
    },
    icons : {
        fontSize              : 20,
        color                 : "#68d9fa"
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
        color                 : "#68d9fa",
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
        color                 : "#2977B3",
    },
    whats : {
        color                 : "#2977B3",
    },
    email : {
        color                 : "#2977B3",
    },
    Detils : {
        display               : 'flex',
        alignItems            : 'flex-start',
        marginTop             : 10,
        borderBottomWidth     : 1,
        borderBottomColor     : "#DDD",
        paddingBottom         : 15
    },
    up_text : {
        marginLeft            : 15,
        marginBottom          : 5,
        fontFamily            : 'CairoRegular',
        color                 : "#2977B3",
    },
    sup_Detils : {
        paddingLeft           : 20,
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
        width                 : 170,
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
        color                 : "#2977B3",
    },
    icon_user : {
        fontSize              : 16,
        color                 : "#2977B3",
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
    }
});

export default Comments;
