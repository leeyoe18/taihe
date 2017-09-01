/**
 * Created by yoe on 2017/9/1.
 */
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import Conf from '../../common/config';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Picker } from 'react-native';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View style={styles.headers}>
                <View style={{flex:.4, height: '100%'}}>
                    <Picker
                        enabled={!!this.props.token}
                        style={styles.picker}
                        selectedValue={this.props.selectType}
                        onValueChange={(itemValue, itemIndex) => this.props.selectMenu(itemValue)}
                    >
                        { this.props.listPickerItem() }
                    </Picker>
                </View>
                <View style={styles.view}>
                    <TouchableOpacity style={styles.searchView} onPress={() => this.props.token && this.props.pressSearch()} >
                        <Icon name="search" color="#999" style={{ fontSize: 30 }} />
                        <Text
                            style={[styles.searchText, { color: this.props.searchValue ? Conf.BASE_COLOR : '#999' }]}
                        >
                            { this.props.searchValue ? this.props.searchValue : '搜索...' }
                        </Text>
                        <Icon onPress={this.props.clearSearchResult} name="close" color="red" style={{ fontSize: 30, opacity: this.props.searchValue ? 1 : 0 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
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
    picker: {
        color: 'white',
        alignItems:'center',
        alignSelf: 'stretch'
    },
    view: {
        flex: 0.6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchText: {
        flex: 1,
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
});

export default Header;