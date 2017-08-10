import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Picker, Switch, RefreshControl, ToastAndroid, 
  AsyncStorage, TextInput, Button, DeviceEventEmitter, TouchableOpacity, Image, WebView } from 'react-native';
import {BdMap,  Panorama} from 'baidu-map-for-react-native';
import Conf from '../../common/config';
import Icon from 'react-native-vector-icons/EvilIcons';

import { List } from './list';
import Menu from './menu';
import { NavigationActions } from 'react-navigation';

let tmpTitle = '';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      isGotoOther: false,
      panoramaLeft: 9999999,
      panoramaLong: 0,
      panoramaLat: 0,
      panoramaImageUrl: '#',
      isPanoramaLoading: false,
      isPanoramaPass: false,
      selectionProject: null,
      isRefreshing: false,
      isSatellite: params && typeof params.isSatellite === 'boolean' ? params.isSatellite : false,
      marker: [],
      token: '',
      zoom: 13,
      language: 'java',
      deviceSize: {
        width: 0,
        height: 0
      },
      selectType: '',
      center: {
        long: 0.0,
        lat: 0.0
      },
      menus: [],
      isMap: params && typeof params.isMap === 'boolean' ? params.isMap : true,
      gridData: {
        header: [],
        rows: []
      },
      searchValue: params && params.filter ? params.filter : '',
      userInfo: {}
    };

    this.checkToken();
  }

  static navigationOptions = ({ navigation }) => {
    let title = navigation.state.params && navigation.state.params.title ? navigation.state.params.title : Conf.HOME_TITLE;

    if (title.indexOf('全景') === -1) {
      tmpTitle = title;
    }

    return {
      title: title,
      headerStyle:  Conf.NAV_HEADER_STYLE,
      headerTitleStyle: Conf.NAV_HEADER_TITLE_STYLE
    }
  }

  async checkToken() {
    let token = '';
    try {
      token = await AsyncStorage.getItem(Conf.STORAGE_TOKEN);
    } catch (e) {
      ToastAndroid.show('请先登录', ToastAndroid.LONG);
      this.setState({
        center: { long: Conf.LONG, lat: Conf.LAT },
      });
    }

    if (token){
      this.headers = new Headers();
      this.headers.set('access-token', 'Bearer ' + token);
      this.setState({token: token});
      this.getMenus();
    } else {
      ToastAndroid.show('请先登录', ToastAndroid.LONG);
      this.setState({
        center: { long: Conf.LONG, lat: Conf.LAT },
      });
    }
  }

  getMenus() {
    fetch('http://116.62.113.227:3000/api/getMenus', { headers: this.headers })
      .then(response => response.json())
      .then((res) => {
        this.setState({
          menus: res
        });

        if (Array.isArray(res) && res.length) {
          this.setState({selectType: res[0].type})
          this.getProjects(res[0].type);
        } else {
          this.setState({
            center: {
              long: Conf.LONG,
              lat: Conf.LAT
            }
          });
        }
      })
      .catch((e) => {
        ToastAndroid.show('请求错误:' + e.message, ToastAndroid.SHORT);
      });
  }

  getProjects(type) {
    const { params } = this.props.navigation.state;
    
    fetch('http://116.62.113.227:3000/api/getProjectsByType?type=' + type, { headers: this.headers })
      .then((response) => response.json())
      .then((res) => {
        if (!this.state.searchValue) {
          ToastAndroid.show('请求数据成功', ToastAndroid.SHORT);
        }

        const center = {
          long: Conf.LONG,
          lat: Conf.LAT
        };

        const marker = this.state.searchValue ? res.data.rows.filter((item) => item.name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) >= 0) : res.data.rows;

        for (let i = 0; i < marker.length; i++) {
          if (marker[i].long > 0 && marker[i].lat > 0) {
            center.long = marker[i].long;
            center.lat = marker[i].lat;
          }
        }

        this.cacheData = res.data;

        this.setState({
          isRefreshing: false,
          marker: marker,
          center: center,
          gridData: {
            header: res.data.header,
            rows: marker
          },
        });
      })
      .catch((e) => {
        if (!this.state.searchValue) {
          ToastAndroid.show('请求错误:' + e.message, ToastAndroid.SHORT);
        }
      });
  }

  selectMenu(type) {
    this.setState({selectType: type});
    this.getProjects(type);
  }

  listMenu() {
    return this.state.menus.map((item) => { 
      let style = { fontWeight: item.type === this.state.selectType ? 'bold' : 'normal' };
      return (
        <View style={styles.menuItem} key={ item.title }>
          <Text 
            style={[styles.menuItemText, style]}
            onPress={ () => this.selectMenu(item.type) }
          > { item.title } </Text>
        </View>
      )
    })
  }

  resize() {
    const { height, width } = Dimensions.get('window');
    this.setState({
      deviceSize: {
        height: height,
        width: width
      }
    });
  }

  listPickerItem() {
    return this.state.menus.map((item) => { 
      return (
        <Picker.Item label={item.title} value={item.type} key={item.type} style={{  fontSize: 12  }} />
      )
    })
  }

  setDisplayModel(isMap) {
    if (this.state.token) {
      this.setState({
        isMap: isMap
      });
    } else {
      this.goScreen();
    }
  }

  onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.getProjects(this.state.selectType);
    }, 500);
  }

  goScreen(name, option) {
    const { navigate } = this.props.navigation;
    if (this.state.token) {
      navigate(name, option);
    } else {
      navigate('Login', {title: '用户登录'});
    }
  }

  pressSearch() {
    const { navigate } = this.props.navigation;
    
    if (this.cacheData.rows && this.cacheData.rows.length) {
      navigate('Search', {
        title: '搜索项目',
        list: this.cacheData.rows.map(item => item.name),
        isMap: this.state.isMap,
        isSatellite: this.state.isSatellite
      });
    }
  }

  clearSearchResult() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Home',
          params: { title: Conf.HOME_TITLE, isMap: this.state.isMap }
        })
      ]
    });

    this.props.navigation.dispatch(resetAction);
  }

  getPanoramaUrl(item) {
    fetch(`http://apis.map.qq.com/ws/coord/v1/translate?key=YJKBZ-EPGR5-XGDIA-QHAMV-CRH6T-N5FWI&locations=${item.lat},${item.long}&type=3`)
      .then((res) => res.json())
      .then((res) => {
      
        if (Array.isArray(res.locations) && res.locations.length === 1) {
          let o = res.locations[0];

          this.setState({
            panoramaLat: o.lat,
            panoramaLong: o.lng,
            panoramaImageUrl: `http://apis.map.qq.com/ws/streetview/v1/image?size=200x200&location=${o.lat},${o.lng}&key=YJKBZ-EPGR5-XGDIA-QHAMV-CRH6T-N5FWI`
          });
        }
      })
      .catch((e) => {

      });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('selectedMarker');
  }

  componentDidMount() {
    setTimeout(() => {
      DeviceEventEmitter.addListener('selectedMarker', (params) => {
        let title = '';

        for(let i = 0; i < this.cacheData.rows.length; i++){
          if (this.cacheData.rows[i].id === params.id) {
            this.getPanoramaUrl(this.cacheData.rows[i]);            
            this.setState({ selectionProject: this.cacheData.rows[i] });
            break;
          }
        }
      });
    }, 1000);
  }

  toDisplayVule(something) {
    if (typeof something === 'boolean') {
      return something ? '是' : '否';
    }
    return something;
  }

  goPanorama(item) {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    this.setState({ panoramaLeft: 0 });
    this.props.navigation.setParams({
      title: this.state.selectionProject.name + ' - 全景' ,
    });
  }

  closePanorama() {
    this.props.navigation.setParams({
      title: tmpTitle,
    });
    this.setState({ panoramaLeft: 999999 });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container} onLayout={ () => this.resize() }>
        <View style={{width: '100%', height: '100%', position: 'absolute', left: this.state.panoramaLeft, top: 0, zIndex: 99999}}>
          <Panorama
            style={{ flex: 1 }}
            location={{ long: this.state.panoramaLong, lat: this.state.panoramaLat }}
          />
          <Icon
            onPress={ () => this.closePanorama() }
            name="close"
            color="#999" style={{ fontSize: 50, position: 'absolute', right: 10, top: 10, zIndex: 9999 }}
          />
        </View>
        <View style={styles.headers}>
          <View style={{flex:.4, height: '100%'}}>
            <Picker
              enabled={!!this.state.token}
              style={{ color: 'white', alignItems:'center', alignSelf: 'stretch' }}
              selectedValue={this.state.selectType}
              onValueChange={(itemValue, itemIndex) => this.selectMenu(itemValue)}
            >
              { this.listPickerItem() }
            </Picker>
          </View>
          <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center', }}>
            <TouchableOpacity style={styles.searchView} onPress={() => this.state.token && this.pressSearch()} >
              <Icon name="search" color="#999" style={{ fontSize: 30 }} />
              <Text 
                style={[styles.searchText, { color: this.state.searchValue ? Conf.BASE_COLOR : '#999' }]}
              >
                { this.state.searchValue ? this.state.searchValue : '搜索...' }
              </Text>

              <Icon onPress={ () => this.clearSearchResult() } name="close" color="red" style={{ fontSize: 30, opacity: this.state.searchValue ? 1 : 0 }} />
              
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          { this.state.isMap ? <View style={{ flex: 1 }}>
            <BdMap
              style={{ flex: 1, width: '100%', height: '100%', position: this.state.panoramaLeft ? 'relative' : 'absolute', left: this.state.panoramaLeft ? 0 : 999999, top: 0 }}
              zoom={ this.state.zoom }
              center={this.state.center}
              marker={this.state.marker} 
              satellite={this.state.isSatellite}
            />

          </View> : <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    colors={['#ff0000', '#00ff00', '#0000ff','#3ad564']}
                    progressBackgroundColor="#ffffff"
                  />
                }>
            <List
              selectItem={(item) => navigate('Web', { 
                title: item.name,
                url: `http://116.62.113.227:3000/detail/${item.id}`
              })}
              header={this.state.gridData.header}
              rows={this.state.gridData.rows} 
             />
          </ScrollView> }
        </View>

        {this.state.selectionProject ? <View style={{ flex: 1,  backgroundColor: 'white' }}>
          <View style={{ padding: 10, backgroundColor: Conf.BASE_COLOR }}>
            <Icon name="chevron-down" color="white" style={{ fontSize: 30, textAlign: 'center' }} 
              onPress={() => this.setState({selectionProject: null})}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', }}>
            <View style={{ flex: 0.6, padding: 10, backgroundColor: 'white' }}>
              { this.state.gridData.header.map((item) => (
                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 2 }} key={ item.key }>
                  <Text style={{ color: '#999', flex: 0.5 }}>{ item.title }</Text>
                  <Text style={{ color: '#000', flex: 0.5 }}>{ this.toDisplayVule(this.state.selectionProject[item.key]) }</Text>
                </View>
              )) }
            </View>
            <View style={{ flex: 0.4,  alignItems: 'center', justifyContent: 'center', }}>
              <TouchableOpacity
                style={{ width: '90%', height: '90%' }}
                onPress={ () => !this.state.isPanoramaLoading && this.state.isPanoramaPass && this.goPanorama(this.state.selectionProject) }
              >

                <Image 
                  style={{ flex: 1, backgroundColor: '#DDD' }} 
                  source={{ uri: this.state.panoramaImageUrl }}
                  onLoadStart={ () => this.setState({ isPanoramaLoading: true }) }
                  onLoadEnd={ () => this.setState({ isPanoramaLoading: false }) } 
                  onError={ () => this.setState({ isPanoramaPass: false }) }
                  onLoad={ () => this.setState({ isPanoramaPass: true }) }
                />
                
                { !this.state.isPanoramaLoading && this.state.isPanoramaPass && <Button title="进入全景图" onPress={ () => this.goPanorama(this.state.selectionProject) } /> }
                { !this.state.isPanoramaLoading && !this.state.isPanoramaPass && <Button disabled={true} title="无全景图" onPress={ () => this.goPanorama(this.state.selectionProject) } /> }
                { this.state.isPanoramaLoading && <Button disabled={true} title="加载全景中..." onPress={ () => this.goPanorama(this.state.selectionProject) } /> }
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{ height: 50, borderTopColor: '#CCC', borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}
            onPress={ () => navigate('Web', { 
              title: this.state.selectionProject.name,
              url: `http://116.62.113.227:3000/detail/${this.state.selectionProject.id}`
            })} 
          >
            <Text style={{ color: Conf.BASE_COLOR, textAlign: 'right', fontSize: 20 }}>
              查看详情
              <Icon name="chevron-right" color={Conf.BASE_COLOR} style={{ fontSize: 20 }} />
            </Text>
          </TouchableOpacity>
        </View> : <View style={styles.menu}>
          <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRightColor: '#CCC', borderRightWidth: 1 }}>
            <Icon name="navicon" color={Conf.BASE_COLOR} style={{ fontSize: 20 }} onPress={() => this.setDisplayModel(false)} />                
            <Switch
              disabled={!this.state.token}
              onValueChange={(value) => this.setDisplayModel(value)} value={this.state.isMap}
             />
            <Icon name="location" color={Conf.BASE_COLOR} style={{ fontSize: 20 }} onPress={() => this.setDisplayModel(true)} />
          </View>
          {this.state.isMap && <View style={{ width: 120, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRightColor: '#CCC', borderRightWidth: 1 }}>
            <View style={ styles.mapToolsSwitch }>
              <Text onPress={ () => {this.state.token && this.setState({isSatellite: false})}}>普通</Text>
              <Switch
                disabled={!this.state.token}
                onValueChange={(isSatellite) => this.setState({isSatellite})} value={this.state.isSatellite}
              />
              <Text onPress={ () => {this.state.token && this.setState({isSatellite: true})}}>卫星</Text>
            </View>
          </View>}
          <View style={{ flex: 1 }}>
            <Menu
              onChart={() => this.goScreen('Web', { 
                title: '项目建设分析',
                url: `http://116.62.113.227:3000/charts`
              })}

              onUser={() => this.goScreen('User', { title: '用户中心' })}
              onLogin={() => this.goScreen('Login', { title: '系统登陆' })}
            ></Menu>
          </View>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    display: 'flex',
    position: 'relative',
    flex: 1, 
  },
  menu: {
    flexDirection: 'row',
    width: '100%',
    height: Conf.MENU_HEIGHT,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  menuItem: {
    flex: 1,
    width: 150,
    height: '100%',
    backgroundColor: 'white',
  },
  menuItemText: {
    textAlign: 'center',
    color: '#666',
    margin: 10,
  },
  map: {
    // flex: 10,
    // height: height - menuHeight * 1.8,
    width: '100%',
  },
  headers: {
    height: Conf.HEADER_HEIGHT,
    backgroundColor: Conf.BASE_COLOR,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headersText: {
    textAlign: 'center',
    color: 'white',
    margin: 10,
  },
  tipView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    width: '100%',
  },
  tipViewText: {
    textAlign: 'center',    
  },
  searchView: {
    flexDirection: 'row',    
    backgroundColor: 'white',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    borderRadius: 5,
  },
  searchText: {
    flex: 1,
  },
  mapTools: {
    padding: 5,
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 9999,
    flexDirection: 'row',
    // backgroundColor: 'white',
    // opacity: 1,
    borderRadius: 5,
    // borderColor: '#DDD',
    // borderWidth: 1, 
    justifyContent: 'center',      
    
  },
  mapToolsSwitch: {
    flexDirection: 'row',  
    justifyContent: 'center',      
  }
});
