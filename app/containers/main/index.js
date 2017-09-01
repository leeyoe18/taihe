import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Picker, Switch, RefreshControl, ToastAndroid, 
  AsyncStorage, TextInput, DeviceEventEmitter, TouchableOpacity, Image, WebView } from 'react-native';
import {BdMap,  Panorama} from 'baidu-map-for-react-native';
import Conf from '../../common/config';
import Icon from 'react-native-vector-icons/EvilIcons';
import Footer from './footer';
import { List } from './list';
import Menu from './menu';
import  { Button } from 'antd-mobile';
import { NavigationActions } from 'react-navigation';
import BaiduMap from './map';
import Table from '../../components/table';

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
      // isSatellite: params && typeof params.isSatellite === 'boolean' ? params.isSatellite : false,
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
  };

  async checkToken() {
    let token = '';
    try {
      token = await AsyncStorage.getItem(Conf.STORAGE_TOKEN);
    } catch (e) {
      ToastAndroid.show('请先登录', ToastAndroid.LONG);
      this.goScreen();
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
      this.goScreen();
      this.setState({
        center: { long: Conf.LONG, lat: Conf.LAT },
      });
    }
  }

  getMenus = () => {
    fetch(`${Conf.url}/api/getMenus`, { headers: this.headers })
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
  };

  getProjects = (type) => {
    const { params } = this.props.navigation.state;
    
    fetch(`${Conf.url}/api/getProjectsByType?type=${type}` , { headers: this.headers })
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
  };

  selectMenu = (type) => {
    this.setState({selectType: type});
    this.getProjects(type);
  };

  listMenu = () => {
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
  };

  resize = () => {
    const { height, width } = Dimensions.get('window');
    this.setState({
      deviceSize: {
        height: height,
        width: width
      }
    });
  }

  listPickerItem = () => {
    return this.state.menus.map(item =>
      (
        <Picker.Item label={item.title} value={item.type} key={item.type} style={{  fontSize: 12  }} />
      ))
  }

  onRefresh = () => {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.getProjects(this.state.selectType);
    }, 500);
  };

  goScreen = (name, option) => {
    const { navigate } = this.props.navigation;
    if (this.state.token) {
      navigate(name, option);
    } else {
      navigate('Login', {title: '用户登录'});
    }
  };

  pressSearch = () => {
    const { navigate } = this.props.navigation;
    
    if (this.cacheData.rows && this.cacheData.rows.length) {
      navigate('Search', {
        title: '搜索项目',
        list: this.cacheData.rows.map(item => item.name),
        isMap: this.state.isMap,
        // isSatellite: this.state.isSatellite
      });
    }
  };

  clearSearchResult = () => {
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
  };

  getPanoramaUrl = (item) => {
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

  goPanorama = (item) => {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    this.setState({ panoramaLeft: 0 });
    this.props.navigation.setParams({
      title: this.state.selectionProject.name + ' - 全景' ,
    });
  };

  closePanorama = () => {
    this.props.navigation.setParams({
      title: tmpTitle,
    });
    this.setState({ panoramaLeft: 999999 });
  };

  changeMapType = (bool) => {
    this.setState({
      isMap: bool
    });
  };

  handleClick = (data) => {
    const { navigate } = this.props.navigation;
    navigate('Detail', {
      path: data.id,
      title: data.name
    });
  };

  render() {
    const { navigate } = this.props.navigation;
    const columns = this.state.gridData.header.map(data => {
      let render = null;
      if(data.key === 'isAttention') {
        render = (rowData) => {
          return <Text style={rowData.isAttention? styles.green : ''}>{rowData.isAttention ? '是' : '否'}</Text>;
        };
      } else if(data.key === 'long' || data.key === 'lat') {
        render = (rowData) => {
          return <Text>{(rowData[data.key]).toFixed(4)}</Text>;
        }
      } else if(data.key === 'status') {
        render = (rowData) => {
          return <View style={styles['style' + rowData.status]} />;
        }
      }
      return {
        title: data.title,
        dataIndex: data.key,
        key: data.key,
        render
      };
    });
    columns.push({
      title: 'Action',
      key: 'Action',
      isBtn: true,
      render: (data) => (
          <Button style={styles.btn} onClick={() => {this.handleClick(data)}}>
            详情
          </Button>
      )
    });
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
          {this.state.isMap ?
            <BaiduMap
                {...this.props}
                {...this.state}
            /> : <Table
              columns={columns}
              data={this.state.gridData.rows}
              header={this.state.header}
          />
          }
        </View>
        <Footer
            {...this.state}
            {...this.props}
            changeMapType={this.changeMapType}
            goScreen={this.goScreen}
        />
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
