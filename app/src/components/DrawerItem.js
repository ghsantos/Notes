/* @flow weak */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const DrawerItem = (props) => (
  <TouchableOpacity
    style={[
      styles.drawerItem,
      props.active ? styles.drawerItemSelect : {}
    ]}
    onPress={() => props.onPress()}
  >
    {props.icon}
    <Text style={styles.text}>
      {props.text}
    </Text>
  </TouchableOpacity>
);

export default DrawerItem;

const styles = StyleSheet.create({
  drawerItem: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  drawerItemSelect: {
    backgroundColor: '#E5E5E5'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 12,
  },
});
