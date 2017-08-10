import React, { Component } from 'react';
import Conf from './Config';
import { StyleSheet, Text, View, Dimensions, ScrollView, Picker, Switch } from 'react-native';

const ROW_HEIGHT = 60;
const COL_WIDTH = 150;
const MARGIN_H = 10;
const styles = StyleSheet.create({
  table: {
    width: '100%',
    height:  '100%',
  },
  header: {
    height: 40,
    // width: '100%',
    flexDirection: 'row',
    backgroundColor: '#CCC',
  },
  headerView: {
    height: '100%',
    // flex: ,
    width: COL_WIDTH,
    // marginLeft: 10,
  },
  headerViewText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    margin: 10,
  },
  body: {
    // width: '100%',
    // flexDirection: 'row',
    backgroundColor: 'white',
  },
  rows: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    // paddingTop: 10,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  col: {
    height: '100%',
    width: COL_WIDTH,
    justifyContent: 'center', 
    alignItems: 'center',
    // marginLeft: 10,
  },
  colText: {
    textAlign: 'center',
    color: '#333',
    // margin: 10,
    fontWeight: 'normal',
    fontFamily: 'sans-serif-light',
  }
});

class Table extends Component {
  static propTypes = {
    header: React.PropTypes.array,
    rows: React.PropTypes.array,    
  }

  header() {
    const {header} = this.props;

    return header.map((item) => {
      return (
        <View style={styles.headerView} key={item.key}>
          <Text style={styles.headerViewText}>{ item.title }</Text>
        </View>
      )
    });
  }

  colPress(item, index) {
    if (index === 0) {
      this.props.selectItem(item)
    }
  }

  rows() {
    const {header, rows} = this.props;
    
    return rows.map((row, i) => {
      return (
        <View style={[styles.rows, {backgroundColor: i%2 === 0 ? '#F5F5F5': 'white'}]} key={i}>
          <View style={{width: MARGIN_H}}></View>          
          {
            header.map((h, index) => (
              <View style={styles.col} key={`${row[h.key]}${i}`}>
                <Text
                  onPress={() => this.colPress(row, index)}
                  style={[styles.colText, {color: index === 0 ? Conf.BASE_COLOR : styles.colText.color}]}
                  ellipsizeMode='tail'
                  numberOfLines={2}
                >{ row[h.key] }</Text>
              </View>
            ))
          }
          <View style={{width: MARGIN_H}}></View>          
        </View>
      )
    });
  }

  render() {
    const { rows, header, style } = this.props;
    width = COL_WIDTH * 1 * header.length + MARGIN_H * 2;
    return  (
      <ScrollView  horizontal={true}>
        <View>
          <View style={[ styles.header, { width: width }]}>
            { this.header() }
          </View>

          <View style={[styles.body, {height: rows.length * (ROW_HEIGHT * 1), width: width}]}>
            { this.rows() }
          </View>
        </View>
      </ScrollView>
    )
  }
}

export { Table }
