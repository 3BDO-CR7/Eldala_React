import React, { Component } from 'react';
import {BackHandler, I18nManager as RNI18nManager, StyleSheet} from 'react-native';
import  { Container,Icon,Footer, FooterTab,Button} from 'native-base';
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from "../consts";

class Tabs extends React.Component {

    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);

        this.state = {
          pageName: this.props.routeName
        };

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      }



    componentDidMount()
    {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillMount()
    {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {

        BackHandler.exitApp()
    }


  render() {

    return (
      <Footer>
          <FooterTab style={styles.footer_Tab}>
            <Button onPress={() => this.props.navigation.navigate('home')}>
                <Icon style={{
                    color   : this.state.pageName === 'home'? CONST.color: '#444',
                    // top     : this.state.pageName === 'home'? -5 : 0,
                }} 
                type="SimpleLineIcons" name="home" />
            </Button>
            <Button onPress={() => this.props.navigation.navigate('filter')}>
                <Icon style={{
                    color   : this.state.pageName === 'filter'? CONST.color : '#444',
                    // top     : this.state.pageName === 'filter'? -5 : 0,
                }} 
                type="Entypo" name='grid' />
            </Button>


              <Button
                  onPress={() => {
                      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

                      (this.props.auth) ? this.props.navigation.navigate('termse3lan') : this.props.navigation.navigate('login');


                  }}


                 >
                <Icon style={{
                    fontSize: 35,
                    color :CONST.color
                    // top     : this.state.pageName === 'filter'? -5 : 0,
                }}
                type="AntDesign" name='pluscircle' />
            </Button>
            {/*<Button onPress={() => this.props.navigation.navigate('mzadat')}>*/}
                {/*<Icon style={{*/}
                    {/*color   : this.state.pageName === 'mzadat'? '#2977B3' : '#444',*/}
                    {/*// top     : this.state.pageName === 'mzadat'? -5 : 0,*/}
                {/*}} */}
                {/*type="Entypo" name='megaphone' />*/}
            {/*</Button>*/}
            <Button  onPress={() => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

                (this.props.auth) ? this.props.navigation.navigate('favorite') : this.props.navigation.navigate('login');


            }}>
                <Icon style={{
                    color   : this.state.pageName === 'gallery'? CONST.color : '#444',
                    // top     : this.state.pageName === 'gallery'? -5 : 0,
                }}
                      type="MaterialIcons" name='favorite' />
            </Button>




            <Button onPress={() => {

                (this.props.auth) ? this.props.navigation.navigate('chat') : this.props.navigation.navigate('login');


            }}>
                <Icon style={{
                    color   : this.state.pageName === 'chat'? CONST.color : '#444',
                    // top     : this.state.pageName === 'chat'? -5 : 0,
                }} 
                type="MaterialIcons" name='chat' />
            </Button>
          </FooterTab>
        </Footer>
    );
  }
}

const styles = StyleSheet.create({
    footer_Tab : {
        backgroundColor         : "#FFF",
        shadowColor             : '#444',
        shadowOffset            : { width: 0 , height : -3 },
        shadowOpacity           : 0.4,
        elevation               : 5,
        borderBottomColor       : '#bbb',
    },
    btn_Footer : {
        borderRadius            : 0
    }
});



const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user
    };
};
export default connect(mapStateToProps, {profile})(Tabs);


