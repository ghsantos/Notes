/* @flow */

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  DrawerItems,
  SafeAreaView,
} from 'react-navigation';

export default class CustomDrawer extends Component {
  render() {
    return (
      <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', }}>
          <Text>Notas</Text>
          <DrawerItems {...this.props} />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uglyDrawerItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E73536',
    padding: 15,
    margin: 5,
    borderRadius: 2,
    borderColor: '#E73536',
    borderWidth: 1,
    textAlign: 'center'
  },
});
