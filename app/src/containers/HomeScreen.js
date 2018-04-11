/* @flow */

import React, { Component } from 'react';
import {
  Alert,
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
import AlertConfirmPass from '../components/AlertConfirmPass';
import { confirmPass } from '../utils';

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

  state = {
    confirmPassVisible: false,
    passCorrect: true,
    note: null,
  }

  componentDidMount() {
    this.props.getNotes();
  }

  onPressDelete(note) {
    this.setState({ note });

    if (note.locked) {
      this.setState({ confirmPassVisible: true });
    } else {
      this.confirmDelete();
    }
  }

  confirmDelete() {
    Alert.alert('', 'Apagar nota definitivamente?',
      [
        { text: 'CANCELAR', onPress: () => {} },
        { text: 'APAGAR',
          onPress: () => {
            this.props.deleteNote(this.state.note);
            this.setState({ note: null });
          },
        }
      ]
    );
  }

  async confirmPass(pass) {
    const passValid = await confirmPass(pass);

    this.setState({ passCorrect: false });

    if (passValid) {
      this.setState({ confirmPassVisible: false, passCorrect: true });

      this.confirmDelete();
    }
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

  alertConfirmPass() {
    return (
      <AlertConfirmPass
        visible={this.state.confirmPassVisible}
        correct={this.state.passCorrect}
        onPressCancel={() => this.setState({
          confirmPassVisible: false, passCorrect: true
        })}
        onPressConfirm={(pass) => this.confirmPass(pass)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#7325A1' />

        {this.alertConfirmPass()}

        {this.props.notes.length ?
          <ScrollView>
            <View style={{ paddingVertical: 5 }}>

              {this.props.notes.map(note =>
                <Item
                  title={note.title}
                  note={note.note}
                  color={note.color}
                  key={note.key}
                  locked={note.locked}
                  onPress={() =>
                    this.props.navigation.dispatch({ type: NAV_EDIT_NOTE, note })
                  }
                  onPressDelete={() => this.onPressDelete(note)}
                />
              )}
            </View>
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
  },
});
