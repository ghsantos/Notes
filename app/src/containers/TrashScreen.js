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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import { getNotes, deleteNote } from '../actions';
import { NAV_EDIT_NOTE } from '../actions/types';
import Item from '../components/Item';
import AlertConfirmPass from '../components/AlertConfirmPass';
import { confirmPass } from '../utils';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: '#7325A1' },
    title: 'Lixeira',
    headerTintColor: 'white',
    gesturesEnabled: false,
    headerLeft: <MaterialIcons
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
    this.props.getNotes('trash');
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
        <MaterialIcons name='delete' size={70} color='#CFCFCF' />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          Lixeira vazia
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
        <StatusBar backgroundColor='#7325A1' animated />

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
      </View>
    );
  }
}

function mapStateToProps(state, props) {
    return {
      notes: state.trashReducer.notes
    };
}

export default connect(mapStateToProps, { getNotes, deleteNote })(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
