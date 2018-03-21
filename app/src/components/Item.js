/* @flow */

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-swipeable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Item extends Component {
  render() {
    const rightButton = ([
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableOpacity style={styles.deleteButton} onPress={this.props.onPressDelete}>
          <Text style={{ color: '#fff' }}>
            Apagar
          </Text>
        </TouchableOpacity>
      </View>
    ]);

    return (
      <Swipeable
        rightButtons={rightButton}
        style={[styles.container, { backgroundColor: this.props.color }]}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row' }}
          onPress={this.props.onPress}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {!!this.props.title &&
              <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
            }

              {!this.props.locked &&
                <Text numberOfLines={this.props.title ? 1 : 2} style={styles.nota}>
                  {this.props.note}
                </Text>
              }
          </View>

          {!!this.props.locked &&
            <View style={{ justifyContent: 'center', }}>
              <Icon
                name='lock'
                size={28}
                color='#0000009A'
                style={styles.icon}
              />
            </View>
          }
        </TouchableOpacity>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginHorizontal: 5,
    elevation: 2,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nota: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    width: 68,
    height: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderRadius: 2,
  },
});
