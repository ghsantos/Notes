/* @flow */

import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class MarkerRow extends Component {
  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      transform: [{
        scale: this._active.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.04],
        }),
      }],
      elevation: this._active.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2],
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.isActive) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.isActive),
      }).start();
    }
  }

  render() {
    return (
      <TouchableOpacity
        {...this.props.sortHandlers}
      >
        <Animated.View style={[styles.container, this._style]}>
        <View style={styles.icon}>
          <CommunityIcons
            name='tag'
            size={35}
            color='#0000009A'
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>{this.props.marker.text}</Text>
        </View>

        <TouchableOpacity style={styles.icon} onPress={() => this.props.onPressEdit()}>
          <MaterialIcons
            name='edit'
            size={35}
            color='#0000009A'
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} onPress={() => this.props.onPressDelete()}>
          <CommunityIcons
            name='delete'
            size={35}
            color='#0000009A'
          />
        </TouchableOpacity>
      </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    elevation: 0,
  },
  icon: {
    paddingHorizontal: 4,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 16,
  },
});
