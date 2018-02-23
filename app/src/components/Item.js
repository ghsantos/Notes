/* @flow */

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Swipeable from 'react-native-swipeable';

export default class Item extends Component {
  render() {
    const rightButton = ([
      <TouchableOpacity style={styles.deleteButton} onPress={this.props.onPressDelete}>
        <Text style={{ color: '#fff' }}>
          Apagar
        </Text>
      </TouchableOpacity>
    ]);

    return (
      <Swipeable rightButtons={rightButton} style={styles.container}>
        <TouchableOpacity style={{ flex: 1 }} onPress={this.props.onPress}>
          <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
          <Text numberOfLines={1} style={styles.nota}>{this.props.note}</Text>
        </TouchableOpacity>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderBottomWidth: 0,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 2,
    marginHorizontal: 3,
    elevation: 1,
    backgroundColor: 'white',
  },
  title: {
    paddingLeft: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nota: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    //flex: 1,
    width: 68,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 2,
  },
});
