/* @flow */

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

import CustomAlert from './CustomAlert';

export default class AlertConfirmPass extends Component {
  state = {
    pass: '',
    check: '',
    correct: true,
  }

  onPressConfirm() {
    this.props.onPressConfirm(this.state.pass, this.state.check);
    this.setState({ pass: '', check: '', correct: false });
  }

  onPressCancel() {
    this.setState({ pass: '', check: '', correct: true });
    this.props.onPressCancel();
  }

  render() {
    return (
      <CustomAlert
        visible={this.props.visible}
        title='Insira uma senha para bloquear a mensagem'
        buttons={[
          {
            text: 'CANCELAR',
            onPress: () => this.onPressCancel(),
            key: 1,
          },
          {
            text: 'OK',
            onPress: () =>
              this.onPressConfirm(),
            key: 2,
          },
        ]}
      >
        {
          !this.state.correct &&
          <Text style={styles.textIncorrect}>
            Senhas não coincidem, tente novamente.
          </Text>
        }

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
          value={this.state.check}
          onChangeText={text => this.setState({ check: text })}
        />
      </CustomAlert>
    );
  }
}

const styles = StyleSheet.create({
  textIncorrect: {
    color: '#F44336',
  },
});
