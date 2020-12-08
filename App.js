import React, { Component }                from 'react';
import {StyleSheet, View, Platform, I18nManager, I18nManager as RNI18nManager} from 'react-native';
import {Root} from 'native-base';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Routes from './src/RootNavigator'
import './ReactotronConfig';
import I18n from 'ex-react-native-i18n';
import i18n from './locale/i18n';
import { Notifications } from 'expo'



export default class App extends Component {

  constructor(props){
      RNI18nManager.forceRTL(true);

    super(props);
      I18n.locale = 'ar';
    this.loadFontAsync();
    this.state = {
      fontLoaded: false
    };

      if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('orders', {
              name  : 'Chat messages',
              sound : true,
          });
      }
  }

  async componentDidMount() {

    I18n.locale = 'ar';
      i18n.locale = 'ar';
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });

  //  AsyncStorage.clear();
  }

  async loadFontAsync() { try
    {
      await Font.loadAsync({ CairoRegular: require("./assets/fonts/Cairo-Regular.ttf") });
      await Font.loadAsync({ CairoBold: require("./assets/fonts/Cairo-Bold.ttf") });
      this.setState({ fontLoaded: true });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    if (!this.state.fontLoaded) {
      return <View />;
    }
    return (

        <Provider store={store} UNSAFE_readLatestStoreStateOnFirstRender={true}>
              <PersistGate persistor={persistedStore}>
              <Root>
                  <Routes/>
              </Root>
             </PersistGate>
      </Provider>
    );
  }
}


//Keystore password: 9fa32b14859146e88869c836550289e0
//Key alias:         QGRldnRhaGEvYWxhYWVsZGVu
//Key password:      30b5b02254754a43a7538362cff7ccc1

