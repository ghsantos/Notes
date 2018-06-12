/* @flow */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-navigation';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import { getMarkers, setMarkerKey } from '../actions';
import DrawerItem from './DrawerItem';
import Line from './Line';

class CustomDrawer extends Component {
  componentDidMount() {
    this.props.getMarkers();
  }

  render() {
    return (
      <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', }}>
          <DrawerItem
            text='Notas'
            active={
              this.props.activeItemKey === 'Home' &&
              !this.props.markerKey
            }
            onPress={() => {
              this.props.navigation.navigate('Home');
              this.props.setMarkerKey('');
            }}
            icon={
              <CommunityIcons
                name='note'
                size={30}
                color='#0000009A'
              />
            }
          />

          <Line />
          <View
            style={{
              marginVertical: 8,
              marginHorizontal: 16,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Marcadores</Text>
          </View>

          {
            this.props.markers.map(marker => (
              <DrawerItem
                key={marker.key}
                text={marker.text}
                active={this.props.markerKey === marker.key}
                onPress={() => {
                  this.props.navigation.navigate('Home');
                  this.props.setMarkerKey(marker.key);
                }}
                icon={
                  <CommunityIcons
                    name='tag'
                    size={30}
                    color='#0000009A'
                  />
                }
              />
            ))
          }

          <DrawerItem
            text='Editar marcadores'
            active={this.props.activeItemKey === 'marker'}
            onPress={() => {
              this.props.navigation.navigate('DrawerClose');
              this.props.navigation.navigate('marker');
            }}
            icon={
              <MaterialIcons
                name='edit'
                size={30}
                color='#0000009A'
              />
            }
          />

          <Line />

          <DrawerItem
            text='Arquivo'
            active={
              this.props.activeItemKey === 'Archive' &&
              !this.props.navigation.getParam('markerKey', false)
            }
            onPress={() => {
              this.props.navigation.navigate('Archive');
              this.props.setMarkerKey('');
            }}
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
            active={
              this.props.activeItemKey === 'Trash' &&
              !this.props.navigation.getParam('markerKey', false)
            }
            onPress={() => {
              this.props.navigation.navigate('Trash');
              this.props.setMarkerKey('');
            }}
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

function mapStateToProps(state) {
    return {
      markers: state.markersReducer.markers,
      markerKey: state.markerKeyReducer.markerKey,
    };
}

export default connect(mapStateToProps, { getMarkers, setMarkerKey })(CustomDrawer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
