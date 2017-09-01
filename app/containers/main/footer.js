/**
 * Created by yoe on 2017/9/1.
 */
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import Conf from '../../common/config';
import { StyleSheet, View, Dimensions, Switch, RefreshControl, ToastAndroid } from 'react-native';
import Menu from './menu';

class Footer extends Component {

    constructor(props) {
        super(props);
    }

    setDisplayModel = (isMap) => {
        if (this.props.token) {
            this.props.changeMapType(isMap)
        } else {
            this.props.goScreen();
        }
    };

    render() {
        return (
            <View style={styles.menu}>
                <View style={styles.menuView}>
                    <Icon name="navicon" color={Conf.BASE_COLOR} style={{ fontSize: 20 }} onPress={() => this.setDisplayModel(false)} />
                    <Switch
                        disabled={!this.props.token}
                        onValueChange={(value) => this.setDisplayModel(value)} value={this.props.isMap}
                    />
                    <Icon name="location" color={Conf.BASE_COLOR} style={{ fontSize: 20 }} onPress={() => this.setDisplayModel(true)} />
                </View>
                <View style={{ flex: 1 }}>
                    <Menu
                        onChart={() => this.props.goScreen('Web', {
                            title: '项目建设分析',
                            url: `http://116.62.113.227:3000/charts`
                        })}
                        onUser={() => this.props.goScreen('User', { title: '用户中心' })}
                        onLogin={() => this.props.goScreen('Login', { title: '系统登陆' })}
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        width: '100%',
        height: Conf.MENU_HEIGHT,
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#CCC',
    },
    menuView: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: '#CCC',
        borderRightWidth: 1
    }
});

export default Footer;