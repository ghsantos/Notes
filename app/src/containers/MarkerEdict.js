/* @flow */

import React, { Component } from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SortableListView from 'react-native-sortable-listview';
import { connect } from 'react-redux';

import { getMarkers, updateMarkers } from '../actions';
import AddItem from '../components/AddItem';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';
import MarkerRow from '../components/MarkerRow';

class MarkerEdict extends Component {
  state = {
    markers: [],
    marker: '',
    markerKey: '',
    addVisible: false,
  }

  componentDidMount() {
    this.props.getMarkers();

    this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.navigation.state.routeName === 'marker') {
        this.goBack();

        return true;
      }

      return false;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.markers) {
      this.setState({ markers: nextProps.markers });
    }
  }

  componentWillUnmount() {
    this.backButtonListener.remove();
  }

  goBack() {
    this.props.updateMarkers([...this.state.markers]);
    this.props.navigation.goBack(null);
  }

  generateKey() {
    return new Date().getTime().toString();
  }

  addMarker() {
    const key = this.generateKey();

    this.setState(prevState => ({
      markers: [...prevState.markers, { text: prevState.marker, key }],
      marker: '',
    }));
  }

  deleteMarker(markerToRemove) {
    this.setState(prevState => ({
      markers: prevState.markers.filter(marker => marker.key !== markerToRemove.key)
    }));
  }

  editMarker() {
    this.setState(prevState => ({
      markers: prevState.markers.map(marker => {
        if (marker.key === prevState.markerKey) {
          return { key: prevState.markerKey, text: prevState.marker };
        }
        return marker;
      }),
      marker: '',
      markerKey: '',
    }));
  }

  onPressEdit(markerToEdit) {
    this.setState({ marker: markerToEdit.text, markerKey: markerToEdit.key, addVisible: true });
  }

  onPressOk() {
    if (this.state.marker.length > 1) {
      if (this.state.markerKey.length > 1) {
        this.editMarker();
      } else {
        this.addMarker();
      }

      this.setState({ addVisible: false });
    }
  }

  _renderRow = (data) => (
    <MarkerRow
      marker={data}
      onPressDelete={() => this.deleteMarker(data)}
      onPressEdit={() => this.onPressEdit(data)}
    />
  );

  alertAddMarker() {
    return (
      <CustomAlert
        visible={this.state.addVisible}
        title='Nome do marcador'
        buttons={[
          {
            text: 'CANCELAR',
            onPress: () => this.setState({ addVisible: false, marker: '' }),
            key: 1,
          },
          {
            text: 'OK',
            onPress: () => this.onPressOk(),
            key: 2,
          },
        ]}
      >
        <TextInput
          value={this.state.marker}
          onChangeText={text => this.setState({ marker: text })}
          autoFocus={this.state.addVisible}
          onSubmitEditing={() => this.onPressOk()}
          placeholder='Nome do marcador'
        />
      </CustomAlert>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          style={{ backgroundColor: '#7325A1' }}
          headerLeft={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => this.goBack()} style={{ paddingHorizontal: 8 }}>
                <CommunityIcons
                  name='arrow-left'
                  size={30}
                  color='#FFFFFF'
                  style={styles.icon}
                />
              </TouchableOpacity>

              <Text
                style={{ color: '#fff', paddingLeft: 20, fontSize: 22, fontWeight: 'bold' }}
              >
                Marcadores
              </Text>
            </View>
          }
        />

        {this.alertAddMarker()}

        <SortableListView
          style={{ flex: 1 }}
          data={this.state.markers}
          order={Object.keys(this.state.markers)}
          onRowMoved={e => {
            this.state.markers.splice(e.to, 0, this.state.markers.splice(e.from, 1)[0]);
            this.forceUpdate();
          }}
          renderRow={this._renderRow}
          activeOpacity={0.95}
        />

        <AddItem onPress={() => this.setState({ addVisible: true })} />
      </View>
    );
  }
}

function mapStateToProps(state) {
    return {
      markers: state.markersReducer.markers,
    };
}

export default connect(mapStateToProps, { getMarkers, updateMarkers })(MarkerEdict);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});
