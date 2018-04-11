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
  }

  onPressConfirm() {
    this.props.onPressConfirm(this.state.pass);
    this.setState({ pass: '' });
  }

  render() {
    return (
      <CustomAlert
        visible={this.props.visible}
        title='Confirme sua senha'
        buttons={[
          {
            text: 'CANCELAR',
            onPress: () => this.props.onPressCancel(),
            key: 1,
          },
          {
            text: 'OK',
            onPress: () => this.onPressConfirm(),
            key: 2,
          },
        ]}
      >
        {
          !this.props.correct &&
          <Text style={styles.textIncorrect}>
            Senha incorreta, tente novamente.
          </Text>
        }

        <TextInput
          autoFocus
          secureTextEntry
          autoCapitalize='none'
          value={this.state.pass}
          onChangeText={text => this.setState({ pass: text })}
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
