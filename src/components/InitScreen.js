import React, { Component } from 'react';
import { I18nManager  as RNI18nManager } from 'react-native';


class InitScreen extends Component {

    constructor(props) {
        super(props);

    }

    async componentWillMount() {
        RNI18nManager.forceRTL(true);
        // if (this.props.lang == null)
        //     this.props.navigation.navigate('language')
        // else {
            this.props.navigation.navigate('home')
        // }
    }



    render() {
        return false;
    }
}

export default InitScreen;



