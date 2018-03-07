/* @flow */

import React, { Component } from 'react';
import {
  Alert,
  View,
  TextInput,
  StatusBar,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { addNote, updateNote, deleteNote } from '../actions';
import colors from '../styles/colors';
import Header from '../components/Header';

class Edict extends Component {
  static navigationOptions = { header: null, drawerLockMode: 'locked-closed' };

  constructor(props) {
    super(props);

    this.backButtonListener = null;
  }

  state = {
    type: 'ADD',
    key: '',
    title: '',
    note: '',
    color: '#FFFFFF',
  }

  componentWillMount() {
    if (this.props.navigation.state.params) {
      const { key, title, note, color } = this.props.navigation.state.params.note;
      this.setState({ type: 'UPDATE', key, title, note, color });
    } else {
      const key = this.generateKey();
      this.setState({ key });
    }
  }

  componentDidMount() {
    this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.navigation.state.routeName === 'edict') {
        this.goBack();

        return true;
      }

      return false;
    });
  }

  componentWillUnmount() {
    this.backButtonListener.remove();
  }

  generateKey() {
    return new Date().getTime().toString();
  }

  goBack() {
    this.saveNote();
    this.props.navigation.goBack(null);
  }

  delete() {
    if (this.state.title !== '' || this.state.note !== '') {
      Alert.alert('', 'Apagar nota definitivamente?',
        [
          { text: 'CANCELAR', onPress: () => {} },
          { text: 'APAGAR', onPress: () => this.onDeleteNote() }
        ]
      );
    }
  }

  onDeleteNote() {
    if (this.state.type === 'UPDATE') {
      const note = { key: this.state.key, title: this.state.title, note: this.state.note };
      this.props.deleteNote(note);
    }
    this.props.navigation.goBack(null);
  }

  saveNote() {
    if (this.state.title !== '' || this.state.note !== '') {
      const note = {
        key: this.state.key,
        title: this.state.title,
        note: this.state.note,
        color: this.state.color
      };

      if (this.state.type === 'ADD') {
        this.props.addNote(note);
      } else {
        this.props.updateNote(note);
      }
    }
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.color }]}>
        <StatusBar backgroundColor={this.state.color} barStyle='dark-content' />

        <Header
          style={{ backgroundColor: this.state.color }}
          headerLeft={
            <TouchableOpacity onPress={() => this.goBack()}>
              <Icon
                name='arrow-left'
                size={30}
                color='#0000009A'
                style={styles.icon}
              />
            </TouchableOpacity>
          }
          headerRight={
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.delete()}>
                <Icon
                  name='delete'
                  size={30}
                  color='#0000009A'
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          }
        />

        <View style={{ flex: 1, padding: 8 }}>
          <TextInput
            value={this.state.title}
            onChangeText={text => this.setState({ title: text })}
            autoFocus
            placeholder='Título'
            underlineColorAndroid='transparent'
            style={{ fontSize: 18, fontWeight: 'bold' }}
            onSubmitEditing={() => this.refs.nota.focus()}
          />

          <View style={{ flex: 1 }}>
            <TextInput
              ref='nota'
              value={this.state.note}
              onChangeText={text => this.setState({ note: text })}
              placeholder='Nota'
              underlineColorAndroid='transparent'
              multiline
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {colors.map(color => <TouchableOpacity
              key={color}
              style={[styles.colorBox, { backgroundColor: color }]}
              onPress={() => this.setState({ color })}
            />)}
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
    return {};
}

export default connect(mapStateToProps, { addNote, updateNote, deleteNote })(Edict);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  colorBox: {
    height: 30,
    width: 30,
    borderRadius: 2,
    elevation: 2,
  },
  icon: {
    marginHorizontal: 7,
  },
});
