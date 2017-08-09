import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Conf from './Config';

export default class Menu extends Component {

  render() {

    return  (
      <View style={styles.container}>
        <View style={styles.item}>
          <Icon name="chart" color={styles.color} onPress={ () => this.props.onChart() } />
          <Text onPress={ () => this.props.onChart() }>项目分析</Text>
        </View>

        <View style={styles.item}>
          <Icon name="user" color={styles.color} onPress={ () => this.props.onUser() } />
          <Text onPress={ () => this.props.onUser() }>用户</Text>
        </View>
      </View>
    )
  }
};

const imageSize = Conf.MENU_HEIGHT - 10;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
    color: '#666'
  },
  logoView: {
  },
  logoShadow: {
    borderBottomWidth: 0,
    shadowColor: 'red',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  logo: {
    width: imageSize,
    height: imageSize,
    borderRadius: 10,
  }
});

