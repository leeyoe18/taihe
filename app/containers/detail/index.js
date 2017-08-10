import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, WebView, Picker, Switch } from 'react-native';
import Conf from '../../common/config';
import { html } from '../../common/html';

export default class Detail extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle:  Conf.NAV_HEADER_STYLE,
    headerTitleStyle: Conf.NAV_HEADER_TITLE_STYLE
  });

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
      <WebView
        source={{uri: `${html}/${params.id}`}}
        style={{ width: '100%' }}
      >
      </WebView>
    );
  }
}