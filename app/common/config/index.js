

const BASE_COLOR = '#5d85f5';

export default Conf = {
  MENU_HEIGHT: 50,
  HEADER_HEIGHT: 50,
  NAV_HEIGHT: 70,
  BASE_COLOR: BASE_COLOR,
  LONG: 116.4017,
  LAT: 39.908802,
  NAV_HEADER_TITLE_STYLE: {
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    height: 20
  },
  NAV_HEADER_STYLE: {
    backgroundColor: BASE_COLOR,
  },
  HOME_TITLE: '欢迎使用太和系统移动端',
  // HOME_TITLE: '',
  STORAGE_TOKEN: '@AsyncStorageDemo:key_token',
  STORAGE_USER_INFO: '@AsyncStorageDemo:key_info',
  STATUS_MAPPING: {
    '0': {
      mainColor: 'red',
      text: '红灯',
      textColor: 'white'
    },
    '1': {
      mainColor: 'yellow',
      text: '黄灯',
      textColor: 'black'
    },
    '2': {
      mainColor: 'green',
      text: '绿灯',
      textColor: 'white'
    },
    '3': {
      mainColor: BASE_COLOR,
      text: '蓝灯',
      textColor: 'white'
    },
    '4': {
      mainColor: 'gray',
      text: '白灯',
      textColor: '#999'
    },
  },
  url: 'http://118.31.46.186:3000'
};