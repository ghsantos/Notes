/* @flow */

import React, { Component } from 'react';
import {
  Alert,
  View,
  TextInput,
  StatusBar,
  StyleSheet,
  BackHandler,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CryptoJS from 'crypto-js';

import { addNote, updateNote, deleteNote } from '../actions';
import colors from '../styles/colors';
import Header from '../components/Header';

import AlertConfirmPass from '../components/AlertConfirmPass';
import AlertSetPass from '../components/AlertSetPass';
import { hasCryptoPass, savePass, confirmPass } from '../utils';

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
    typeAnnotation: 'note',
    color: '#FFFFFF',
    locked: false,
    confirmPassVisible: false,  // CustomAlert confirm pass
    setPassVisible: false,      // CustomAlert set pass
    passChecked: '',
    passCorrect: true,
    noteIsCrypto: false,
  }

  componentWillMount() {
    if (this.props.navigation.state.params) {
      const { key, title, color } = this.props.navigation.state.params.note;
      const { locked: locked = false } = this.props.navigation.state.params.note;
      const { typeAnnotation: typeAnnotation = 'note' } = this.props.navigation.state.params.note;

      this.setState({
        type: 'UPDATE',
        key,
        title,
        color,
        locked,
        typeAnnotation,
      });

      if (locked) {
        this.setState({ confirmPassVisible: true, noteIsCrypto: true });
      } else {
          const note = this.props.navigation.state.params.note.note;
          this.setState({ note });
      }
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

  actionGoBack() {
    this.props.navigation.goBack(null);
  }

  generateKey() {
    return new Date().getTime().toString();
  }

  getNoteToSave() {
    let noteToSave;

    if (this.state.locked) {
      noteToSave = CryptoJS.AES.encrypt(this.state.note, this.state.passChecked).toString();
    } else {
      noteToSave = this.state.note;
    }

    const note = {
      key: this.state.key,
      title: this.state.title,
      note: noteToSave,
      color: this.state.color,
      typeAnnotation: this.state.typeAnnotation,
      locked: this.state.locked,
    };

    return note;
  }

  goBack() {
    this.saveNote();
    this.actionGoBack();
  }

  archive() {
    if (this.state.title !== '' || this.state.note !== '') {
      const note = this.getNoteToSave();

      this.props.deleteNote(note);
      this.props.addNote({ ...note, typeAnnotation: 'archive' });

      this.actionGoBack();
    }
  }

  unarchive() {
    const note = this.getNoteToSave();

    this.props.deleteNote(note);
    this.props.addNote({ ...note, typeAnnotation: 'note' });

    this.actionGoBack();
  }

  delete() {
    if (this.state.title !== '' || this.state.note !== '') {
      if (this.state.typeAnnotation === 'trash') {
        Alert.alert('', 'Apagar nota definitivamente?',
          [
            { text: 'CANCELAR', onPress: () => {} },
            { text: 'APAGAR', onPress: () => this.onDeleteNote() }
          ]
        );
      } else {
        Alert.alert('', 'Mover nota para a lixeira?',
          [
            { text: 'CANCELAR', onPress: () => {} },
            { text: 'MOVER', onPress: () => this.onDeleteNote() }
          ]
        );
      }
    }
  }

  restore() {
    const note = this.getNoteToSave();

    this.props.deleteNote(note);
    this.props.addNote({ ...note, typeAnnotation: 'note' });

    this.actionGoBack();
  }

  onDeleteNote() {
    const note = this.getNoteToSave();

    if (this.state.type === 'UPDATE') {
      this.props.deleteNote(note);
    }

    if (note.typeAnnotation !== 'trash') {
      this.props.addNote({ ...note, typeAnnotation: 'trash' });
    }

    this.actionGoBack();
  }

  saveNote() {
    if (this.state.title !== '' || this.state.note !== '') {
      const note = this.getNoteToSave();

      if (this.state.type === 'ADD') {
        this.props.addNote(note);
      } else {
        this.props.updateNote(note);
      }
    }
  }

  async onPressLock() {
    const hasPass = await hasCryptoPass();

    if (this.state.locked) {
      this.setState({ locked: false });
    } else if (!this.state.passChecked) {
      if (hasPass) {
        this.setState({ confirmPassVisible: true });
      } else {
        this.setState({ setPassVisible: true });
      }
    } else {
      this.setState({ locked: true });
    }
  }

  checkPass(pass, passCheck) {
    if (pass !== '' && pass === passCheck) {
      this.setState({ setPassVisible: false, passChecked: pass, locked: true });

      savePass(pass);
    }
  }

  async confirmPass(pass) {
    const passValid = await confirmPass(pass);

    this.setState({ passCorrect: false });

    if (passValid) {
      if (this.state.noteIsCrypto) {
        const cryptoNote = this.props.navigation.state.params.note.note;
        const note = CryptoJS.AES.decrypt(cryptoNote, pass).toString(CryptoJS.enc.Utf8);

        this.setState({ noteIsCrypto: false, note });
      }

      this.setState({
        passChecked: pass,
        confirmPassVisible: false,
        locked: true,
        passCorrect: true,
      });
    }
  }

  cancelConfirmationPass() {
    this.setState({ confirmPassVisible: false, passCorrect: true });

    if (this.state.noteIsCrypto) {
      this.actionGoBack();
    }
  }

  headerButton() {
    if (this.state.typeAnnotation === 'note') {
      return (
        <TouchableOpacity onPress={() => this.archive()}>
          <MaterialIcons
            name='archive'
            size={30}
            color='#0000009A'
            style={styles.icon}
          />
        </TouchableOpacity>
      );
    } else if (this.state.typeAnnotation === 'archive') {
      return (
        <TouchableOpacity onPress={() => this.unarchive()}>
          <MaterialIcons
            name='unarchive'
            size={30}
            color='#0000009A'
            style={styles.icon}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={() => this.restore()}>
        <CommunityIcons
          name='delete-restore'
          size={30}
          color='#0000009A'
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  }

  header() {
    return (
      <Header
        style={{ backgroundColor: this.state.color }}
        headerLeft={
          <TouchableOpacity onPress={() => this.goBack()}>
            <CommunityIcons
              name='arrow-left'
              size={30}
              color='#0000009A'
              style={styles.icon}
            />
          </TouchableOpacity>
        }
        headerRight={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
              this.state.typeAnnotation !== 'trash' &&
              <TouchableOpacity onPress={() => this.onPressLock()}>
                <CommunityIcons
                  name={this.state.locked ? 'lock' : 'lock-open'}
                  size={28}
                  color='#0000009A'
                  style={styles.icon}
                />
              </TouchableOpacity>
            }

            {this.headerButton()}

            <TouchableOpacity onPress={() => this.delete()}>
              <CommunityIcons
                name='delete'
                size={30}
                color='#0000009A'
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        }
      />
    );
  }

  alertConfirmPass() {
    return (
      <AlertConfirmPass
        visible={this.state.confirmPassVisible}
        correct={this.state.passCorrect}
        onPressCancel={() => this.cancelConfirmationPass()}
        onPressConfirm={(pass) => this.confirmPass(pass)}
      />
    );
  }

  alertSetPass() {
    return (
      <AlertSetPass
        visible={this.state.setPassVisible}
        onPressCancel={() => this.setState({ setPassVisible: false })}
        onPressConfirm={(pass, check) => this.checkPass(pass, check)}
      />
    );
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.color }]}>
        {
          Platform.Version >= 23 &&
          <StatusBar backgroundColor={this.state.color} barStyle='dark-content' />
        }

        {this.header()}
        {this.alertConfirmPass()}
        {this.alertSetPass()}

        <View style={{ flex: 1, padding: 8 }}>
          <TextInput
            value={this.state.title}
            onChangeText={text => this.setState({ title: text })}
            autoFocus={!this.props.navigation.state.params}
            editable={this.state.typeAnnotation === 'note'}
            placeholder='Título'
            underlineColorAndroid='transparent'
            style={{ fontSize: 18, fontWeight: 'bold', color: '#111' }}
            onSubmitEditing={() => this.refs.nota.focus()}
          />

          <View style={{ flex: 1 }}>
            <TextInput
              ref='nota'
              value={this.state.note}
              onChangeText={text => this.setState({ note: text })}
              editable={this.state.typeAnnotation === 'note'}
              placeholder='Nota'
              underlineColorAndroid='transparent'
              multiline
              style={{ flex: 1, textAlignVertical: 'top', color: '#333' }}
            />
          </View>

          {
            this.state.typeAnnotation !== 'trash' &&
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {colors.map(color => <TouchableOpacity
                key={color}
                style={[styles.colorBox, { backgroundColor: color }]}
                onPress={() => this.setState({ color })}
              />)}
            </View>
          }
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
