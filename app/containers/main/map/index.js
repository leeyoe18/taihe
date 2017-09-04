/**
 * Created by yoe on 2017/8/11.
 */
import React, { Component } from 'react';
import {StyleSheet, Alert, Text, Image, View, TouchableOpacity, ScrollView} from 'react-native';
import { Popover, Card, Button, SegmentedControl, Icon, Popup } from 'antd-mobile';
import {BdMap} from 'baidu-map-for-react-native';
import MapType from './map-type';

export default class BaiduMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            zoom: 13,
            isSatellite: false
        };
    }

    onChangeMapType = () => {
        this.setState({
            isSatellite: !this.state.isSatellite
        });
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <BdMap
                    style={[styles.map]}
                    zoom={ this.state.zoom }
                    center={this.props.center}
                    marker={this.props.marker}
                    satellite={this.state.isSatellite}
                />
                <MapType
                    onValueChange={this.onChangeMapType}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    mapType: {

    }
});