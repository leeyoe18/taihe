import React, { Component } from 'react';
import { View } from 'react-native';
import Conf from './Config';
import { NavigationActions } from 'react-navigation';
import { Panorama } from 'baidu-map-for-react-native';

export default class Pano extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowPanorama: false
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle:  Conf.NAV_HEADER_STYLE,
    headerTitleStyle: Conf.NAV_HEADER_TITLE_STYLE
  })

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isShowPanorama: true });
    }, 1000);
  }

  render() {
    const { params } = this.props.navigation.state;

    return  (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'red' }}></View>
        <Panorama
          style={{ width: '100%', height: '100%', position: 'absolute', left: '50%', top: 0, backgroundColor: 'white', zIndex: 99999 }}
          location={{ long: params.long, lat: params.lat }}
        />
      </View>
    )
  }
};
