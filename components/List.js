import React, { Component } from 'react';
import Conf from './Config';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';


class List extends Component {
  static propTypes = {
    header: React.PropTypes.array,
    rows: React.PropTypes.array,
  
  }
  
  toDisplayVule(key, value) {
    if (typeof value === 'boolean') {
      return value ? '是' : '否';
    }

    if (key === 'status' && Conf.STATUS_MAPPING[value]) {
      return Conf.STATUS_MAPPING[value].text;
    }

    return value;
  }

  listItems() {
    const {header, rows} = this.props;
    
    return rows.map((row, i) => (
      <View style={[styles.box, { borderColor: Conf.STATUS_MAPPING[row.status].mainColor }]} key={row.id}>
        <View style={{ flex: 1 }}>
          {header.map((h) => (
            <View style={{ flex: 0.5, flexDirection: 'row', marginBottom: 2 }} key={`${i}_${h.key}`}>
              <Text style={{ color: '#999', flex: 0.5 }}>{ h.title }</Text>
              <Text style={{ color: '#000', flex: 0.5 }}>{ this.toDisplayVule(h.key, row[h.key]) }</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={{ borderTopColor: '#CCC', borderTopWidth: 1, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}
          onPress={ () => this.props.selectItem(row) }>
          <Text style={{ color: Conf.BASE_COLOR, textAlign: 'center', fontSize: 16 }}>
            查看详情
            <Icon name="chevron-right" color={Conf.BASE_COLOR} style={{ fontSize: 16 }} />
          </Text>
        </TouchableOpacity>
      </View>
    ));
  }

  render() {
    return  (
      <View style={{ flex: 1, padding: 10 }}>
        { this.listItems() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  }
});

export { List }
