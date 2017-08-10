
import { StyleSheet, Text, View, Dimensions, ScrollView, Picker, Switch, Button, AsyncStorage, ToastAndroid } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Conf from '../../common/config';
import { NavigationActions } from 'react-navigation';

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchDisabled: false,
      logoutDisabled: false,
      disabled: false,
      userName: ''
    };
    
    const { navigate } = this.props.navigation;

    AsyncStorage.getItem(Conf.STORAGE_TOKEN, (err, token) => {
      if (err || !token) {
        navigate('Login', {title: '登陆用户'});
      } else {
        AsyncStorage.getItem(Conf.STORAGE_USER_INFO, (err, result) => {
          if (err) {
            ToastAndroid.show('错误:' + err.message, ToastAndroid.SHORT);
          } else {
            let o = null;
            try {
              o = JSON.parse(result);
            } catch (e) {
              o = null;
            }

            if (o) {
              this.setState({
                userName: o.name
              });
            }
          }
        });
      }
    });
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle:  Conf.NAV_HEADER_STYLE,
    headerTitleStyle: Conf.NAV_HEADER_TITLE_STYLE
  })

  async removeToken(fn) {
    this.setState({switchDisabled: true}); 
    this.setState({logoutDisabled: true});
    let isError = false;
    try {
      await AsyncStorage.removeItem(Conf.STORAGE_TOKEN);
      await AsyncStorage.removeItem(Conf.STORAGE_USER_INFO);
    } catch(e) {
      this.setState({switchDisabled: false}); 
      this.setState({logoutDisabled: false});
      isError = true;
      ToastAndroid.show('错误:' + e.message, ToastAndroid.SHORT);
    }

    if (!isError) {
      fn();
    }
  }

  switchAccount() {    
    const { navigate } = this.props.navigation;
    navigate('Login', {title: '切换登陆用户'});
  }

  logout() {
    const { navigate } = this.props.navigation;
    this.removeToken(() => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
            params: { title: Conf.HOME_TITLE }
          })
        ]
      });

      this.props.navigation.dispatch(resetAction);
    });
  }

  render() {
    return  (
      <View style={styles.container}>
        <View style={styles.info}>
          <View style={styles.pic}>
            <Icon name="user" style={{ fontSize: 100 }} color="#CCC" />
          </View>
          <View>
            <Text style={ styles.userNameText }>{ this.state.userName }</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonItem}>
            <Button title="切换其它账号" disabled={this.state.switchDisabled} color={Conf.BASE_COLOR} onPress={ () => this.switchAccount() } />
          </View>
          <View style={styles.buttonItem}>
            <Button title="退出登录" disabled={this.state.logoutDisabled} color="red" onPress={ () => this.logout() } />
          </View>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    display: 'flex',
    flex: 1,
  },
  buttonGroup: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonItem: {
    marginTop: 20,
    width: '80%'
  },
  info: {
    marginTop: 50
  },
  pic: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    textAlign: 'center',
  }
});

