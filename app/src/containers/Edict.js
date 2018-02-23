/* @flow */

import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { addNote, updateNote } from '../actions';

class Edict extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: '#7325A1' },
    headerTintColor: 'white',
    gesturesEnabled: false,
    drawerLockMode: 'locked-closed',
    headerLeft: (
      <Icon
        name='arrow-left'
        onPress={() => navigation.state.params.onPressBack()}
        size={30} color="white"
      />),
  })

  constructor(props) {
    super(props);

    this.backButtonListener = null;
  }

  state = {
    type: 'ADD',
    key: '',
    title: '',
    note: '',
  }

  componentWillMount() {
    this.props.navigation.setParams({ onPressBack: () => this.goBack() });

    if (this.props.navigation.state.params) {
      const { key, title, note } = this.props.navigation.state.params.note;
      this.setState({ type: 'UPDATE', key, title, note });
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

  saveNote() {
    if (this.state.title !== '' || this.state.note !== '') {
      const note = { key: this.state.key, title: this.state.title, note: this.state.note };

      if (this.state.type === 'ADD') {
        this.props.addNote(note);
      } else {
        this.props.updateNote(note);
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.title}
          onChangeText={text => this.setState({ title: text })}
          autoFocus
          placeholder='Título'
          underlineColorAndroid='transparent'
          style={{ fontSize: 18, fontWeight: 'bold' }}
          onSubmitEditing={() => this.refs.nota.focus()}
        />

        <View style={{ height: '90%' }}>
          <TextInput
            ref='nota'
            value={this.state.note}
            onChangeText={text => this.setState({ note: text })}
            placeholder='Nota'
            underlineColorAndroid='transparent'
            multiline
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
    return {};
}

export default connect(mapStateToProps, { addNote, updateNote })(Edict);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    marginBottom: 10,
  },
});
