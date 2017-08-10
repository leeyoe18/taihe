
import { StyleSheet, Text, View, Dimensions, ScrollView, Picker, Switch, Button, TextInput, AsyncStorage, ToastAndroid } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Conf from '../../common/config';
import { NavigationActions } from 'react-navigation';
import { html } from '../../common/html';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userPass: '',
      disabled: false,
      tip: ''
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle:  Conf.NAV_HEADER_STYLE,
    headerTitleStyle: Conf.NAV_HEADER_TITLE_STYLE
  });

  async setToken(data, fn) {
    let isError = false;

    try {
      await AsyncStorage.setItem(Conf.STORAGE_TOKEN, data.accessToken);
      await AsyncStorage.setItem(Conf.STORAGE_USER_INFO, JSON.stringify(data));
    } catch(e) {
      isError = true;
      this.setState({disabled: false}); 
      ToastAndroid.show('错误:' + e.message, ToastAndroid.SHORT);
    }

    if (!isError) {
      fn();      
    }
  }

  login() {
    if (this.state.userName && this.state.userPass) {
      this.setState({disabled: true});
        fetch(`${html}/cms/v1/login`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            account: this.state.userName,
            password: this.state.userPass
          })
        })
        .then(response => response.json())
        .then((res) => {
          // this.setState({disabled: false});
          this.setToken(res.content, () => {
            ToastAndroid.show('登陆成功', ToastAndroid.SHORT);

            setTimeout(() => {
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
            }, 1000);

          });
        })
        .catch((e) => {
          ToastAndroid.show('登陆错误:' + e.message, ToastAndroid.SHORT);
          this.setState({disabled: false});
        });
    }
  }

  render() {
    return  (
      <View style={styles.container}>
        <View style={ styles.form }>
          <View style={ styles.formRow }>
            <Text>用户名</Text>
            <TextInput
              keyboardType="phone-pad"
              onChangeText={(userName) => this.setState({userName})}
            />
          </View>
          <View style={ styles.formRow }>
            <Text>密码</Text>
            <TextInput
              keyboardType="phone-pad"
              secureTextEntry={true}
              onChangeText={(userPass) => this.setState({userPass})}
              onSubmitEditing={() => this.login()}  
            />
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonItem}>
            <Button title="登陆" disabled={this.state.disabled} color={Conf.BASE_COLOR} onPress={ () => this.login() } />
          </View>
        </View>

        <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', }}>
          <Text style={{ textAlign: 'center', color: 'green' }} >{this.state.tip}</Text>
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
    flex: 1
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
  form: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formRow: {
    width: '80%',
    marginTop: 20,
  }
});
