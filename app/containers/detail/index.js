import React, {
    Component,
    PropTypes
} from 'react';

import {
    StyleSheet, View, Platform, PixelRatio, Text
} from 'react-native';
import Dimensions from 'Dimensions';
import { Tabs, Toast } from 'antd-mobile';
import { get } from '../../services/project';
import BaseInfo from './base-info';
import Status from './node-status';
import Issue from './issue';
import Inspect from './inspect';
import Invest from './invest';
import Progress from './progress';

const TabPane = Tabs.TabPane;
import Conf from '../../common/config';

export default class Detail extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle:  Conf.NAV_HEADER_STYLE,
    headerTitleStyle: Conf.NAV_HEADER_TITLE_STYLE
  });

  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    Toast.loading('Loading...', 0);
    const { params } = this.props.navigation.state;
    fetch(`${Conf.url}/api/getProject／${params.path}`, { headers: params.headers })
        .then(response => response.json())
        .then((res) => {
          Toast.hide();
          if(res.pass) {
            this.setState({
              data: res.data
            });
          }
        });
  }

  render() {
    const mapData = [];
    if(this.state.data.geo) {
      mapData[0] = this.state.data.geo;
    }
    return (
        <View style={styles.container}>
          <Tabs>
            <TabPane tab="基础信息" key="baseInfo">
              <BaseInfo data={this.state.data}/>
            </TabPane>
            <TabPane tab="工作进度" key="progress">
              <Progress data={this.state.data}/>
            </TabPane>
            <TabPane tab="项目月度投资" key="month">
              <Invest data={this.state.data}/>
            </TabPane>
            <TabPane tab="项目节点状态" key="node">
              <Status data={this.state.data}/>
            </TabPane>
            <TabPane tab="项目问题" key="problem">
              <Issue data={this.state.data}/>
            </TabPane>
            <TabPane tab="项目督查" key="ducha">
              <Inspect data={this.state.data}/>
            </TabPane>
          </Tabs>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    overflow: 'scroll',
    backgroundColor: '#fff'
  },
  map: {
    height: Dimensions.get('window').height - 60
  },
  mapStyle: {
    marginTop: 16,
    width: Dimensions.get('window').width - 32,
    height: Dimensions.get('window').height - 170
  }
});