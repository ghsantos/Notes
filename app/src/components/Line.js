/* @flow weak */

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

const Line = () => (
  <View style={styles.container} />
);

export default Line;

const styles = StyleSheet.create({
  container: {
    height: 1,
    width: '100%',
    marginVertical: 4,
    backgroundColor: '#0000004A',
  },
});
