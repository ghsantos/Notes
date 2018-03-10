/* @flow */

import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  View,
  TextInput,
  StatusBar,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CryptoJS from 'crypto-js';

import { addNote, updateNote, deleteNote } from '../actions';
import colors from '../styles/colors';
import Header from '../components/Header';
import CustomAlert from '../components/CustomAlert';

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
    locked: false,
    confirmPassVisible: false,  // CustomAlert confirm pass
    setPassVisible: false,      // CustomAlert set pass
    cryptoPass: '',
    passChecked: '',
    pass: '',
    passCheck: '',
    noteIsCrypto: false,
  }

  componentWillMount() {
    if (this.props.navigation.state.params) {
      const { key, title, color } = this.props.navigation.state.params.note;
      this.setState({ type: 'UPDATE', key, title, color });

      const { locked } = this.props.navigation.state.params.note || false;
      this.setState({ locked });

      let note;

      if (locked) {
        this.getCryptoPass(this.setState({ confirmPassVisible: true, noteIsCrypto: true }));
      } else {
          note = this.props.navigation.state.params.note.note;
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
        locked: this.state.locked,
      };

      if (this.state.type === 'ADD') {
        this.props.addNote(note);
      } else {
        this.props.updateNote(note);
      }
    }
  }

  onPressLock() {
    if (this.state.locked) {
      this.setState({ locked: false });
    } else if (!this.state.passChecked) {
      this.getCryptoPass(
        () => this.setState({ confirmPassVisible: true }),
        () => this.setState({ setPassVisible: true }),
      );
    } else {
      this.setState({ locked: true });
    }
  }

  getCryptoPass(getPassSucess = () => {}, getPassFail = () => {}) {
    AsyncStorage.getItem('password', (err, pass) => {
      if (pass !== null) {
        this.setState({ cryptoPass: pass });
        getPassSucess();
      } else {
        getPassFail();
      }
    });
  }

  checkPass() {
    const { pass, passCheck } = this.state;
    this.setState({ pass: '', passCheck: '' });

    if (pass !== '' && pass === passCheck) {
      const cryptoPass = CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex);

      this.setState({ setPassVisible: false, passChecked: pass, locked: true });
      AsyncStorage.setItem('password', cryptoPass);
    }
  }

  confirmPass() {
    const { pass, cryptoPass } = this.state;

    console.log(pass);
    console.log(cryptoPass);

    if (CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex) === cryptoPass) {
      if (this.state.noteIsCrypto) {
        const cryptoNote = this.props.navigation.state.params.note.note;
        const note = CryptoJS.AES.decrypt(cryptoNote, pass).toString(CryptoJS.enc.Utf8);

        this.setState({ noteIsCrypto: false, note });
      }

      this.setState({ passChecked: pass, confirmPassVisible: false, locked: true });
    }

    this.setState({ pass: '' });
  }

  cancelConfirmationPass() {
    this.setState({ confirmPassVisible: false });

    if (this.state.noteIsCrypto) {
      this.props.navigation.goBack(null);
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => this.onPressLock()}>
                <Icon
                  name={this.state.locked ? 'lock' : 'lock-open'}
                  size={28}
                  color='#0000009A'
                  style={styles.icon}
                />
              </TouchableOpacity>

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

        <CustomAlert
          visible={this.state.confirmPassVisible}
          title='Confirme sua senha'
          buttons={[
            {
              text: 'CANCELAR',
              onPress: () => this.cancelConfirmationPass(),
              key: 1,
            },
            {
              text: 'OK',
              onPress: () => this.confirmPass(),
              key: 2,
            },
          ]}
        >
          <TextInput
            autoFocus
            secureTextEntry
            autoCapitalize='none'
            value={this.state.pass}
            onChangeText={text => this.setState({ pass: text })}
          />
        </CustomAlert>

        <CustomAlert
          visible={this.state.setPassVisible}
          title='Insira uma senha para bloquear a mensagem'
          buttons={[
            {
              text: 'CANCELAR',
              onPress: () => this.setState({ setPassVisible: false }),
              key: 1,
            },
            {
              text: 'OK',
              onPress: () => this.checkPass(),
              key: 2,
            },
          ]}
        >
          <Text>Senha</Text>
          <TextInput
            autoFocus
            secureTextEntry
            autoCapitalize='none'
            value={this.state.pass}
            onChangeText={text => this.setState({ pass: text })}
            onSubmitEditing={() => this.refs.check.focus()}
          />
          <Text>Confirme sua senha</Text>
          <TextInput
            ref='check'
            secureTextEntry
            autoCapitalize='none'
            value={this.state.passCheck}
            onChangeText={text => this.setState({ passCheck: text })}
          />
        </CustomAlert>

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
