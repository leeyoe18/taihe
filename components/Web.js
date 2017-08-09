import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, WebView, Picker, Switch } from 'react-native';
import Conf from './Config';

export default class Web extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle:  Conf.NAV_HEADER_STYLE,
    headerTitleStyle: Conf.NAV_HEADER_TITLE_STYLE
  })

  render() {
    const { params } = this.props.navigation.state;

    return (
      <WebView
        automaticallyAdjustContentInsets={false}
        bounces={false}
        scalesPageToFit={true}
        source={{ uri: params.url }}
        style={{ flex: 1 }}
      >
      </WebView>
    );
  }
}