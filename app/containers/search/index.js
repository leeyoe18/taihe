
import { StyleSheet, Text, View, Dimensions, ScrollView, TextInput, Switch, Button, AsyncStorage, ToastAndroid, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Conf from '../../common/config';
import { NavigationActions } from 'react-navigation';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle:  Conf.NAV_HEADER_STYLE,
    headerTitleStyle: Conf.NAV_HEADER_TITLE_STYLE
  })

  search(value) {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    if (value) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
            params: {
              title: '搜索结果', 
              filter: value,
              isMap: params.isMap,
              isSatellite: params.isSatellite
            }
          })
        ]
      });

      this.props.navigation.dispatch(resetAction);
    } else {
      ToastAndroid.show('请输入搜索内容', ToastAndroid.SHORT);
    }
  }

  changeText(searchText) {
    this.setState({searchText});
  }

  listItem() {
    const { params } = this.props.navigation.state;
    return params.list
      .filter((item) => this.state.searchText !== '' && item.toLowerCase().indexOf(this.state.searchText.toLowerCase()) >= 0)
      .map((item, i) => (
        <TouchableOpacity style={styles.listView} key={item} onPress={() => this.search(item)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      ));
  }

  render() {
    return  (
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput
            style={styles.searchViewText}
            keyboardType="phone-pad"
            onChangeText={(searchText) => this.changeText(searchText)}
          />
          <Button
            title="搜索"
            disabled={!this.state.searchText}
            color={Conf.BASE_COLOR}
            onPress={ () => this.state.searchText && this.search(this.state.searchText) }
          />
        </View>

        <View style={styles.searchList}>
          <ScrollView >
            { this.listItem()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  searchView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  searchViewText: {
    flex: 1
  },
  searchList: {
    width: '90%', 
  },
  listView: {
    // flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    justifyContent: 'center',
    height: 50,
  },
  listViewText: {

  }
});

