/* @flow */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-navigation';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DrawerItem from './DrawerItem';

export default class CustomDrawer extends Component {
  render() {
    return (
      <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', }}>
          <DrawerItem
            text='Notas'
            active={this.props.activeItemKey === 'Home'}
            onPress={() => this.props.navigation.navigate('Home')}
            icon={
              <CommunityIcons
                name='note'
                size={30}
                color='#0000009A'
              />
            }
          />
          <DrawerItem
            text='Arquivo'
            active={this.props.activeItemKey === 'Archive'}
            onPress={() => this.props.navigation.navigate('Archive')}
            icon={
              <MaterialIcons
                name='archive'
                size={30}
                color='#0000009A'
              />
            }
          />
          <DrawerItem
            text='Lixeira'
            active={this.props.activeItemKey === 'Trash'}
            onPress={() => this.props.navigation.navigate('Trash')}
            icon={
              <MaterialIcons
                name='delete'
                size={30}
                color='#0000009A'
              />
            }
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
