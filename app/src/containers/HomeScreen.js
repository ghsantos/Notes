/* @flow */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { getNotes, deleteNote } from '../actions';
import { NAV_ADD_NOTE, NAV_EDIT_NOTE } from '../actions/types';
import Item from '../components/Item';
import AddItem from '../components/AddItem';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: '#7325A1' },
    title: 'Notas',
    headerTintColor: 'white',
    gesturesEnabled: false,
    headerLeft: <Icon
      name='menu'
      size={30}
      color='white'
      style={{ marginLeft: 12 }}
      onPress={() => {
          navigation.navigate('DrawerOpen');
      }}
    />
  })

  componentDidMount() {
    this.props.getNotes();
  }

  emptyState() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CommunityIcon name='note' size={70} color='#CFCFCF' />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          Suas notas adicionadas aparecem aqui
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#7325A1' />

        {!!this.props.notes.length ?
          <ScrollView>
            {this.props.notes.map(note =>
              <Item
                title={note.title}
                note={note.note}
                color={note.color}
                key={note.key}
                onPress={() =>
                  this.props.navigation.dispatch({ type: NAV_EDIT_NOTE, note })
                }
                onPressDelete={() => this.props.deleteNote(note)}
              />
            )}
          </ScrollView>
        : this.emptyState() }

        <AddItem onPress={() => this.props.navigation.dispatch({ type: NAV_ADD_NOTE })} />
      </View>
    );
  }
}

function mapStateToProps(state, props) {
    return {
      notes: state.noteReducer.notes
    };
}

export default connect(mapStateToProps, { getNotes, deleteNote })(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
});
