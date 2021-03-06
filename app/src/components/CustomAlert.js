/* @flow */

import React, { Component } from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class CustomAlert extends Component {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.props.visible}
        onRequestClose={() => {}}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor='#333' animated />

          <View style={styles.alert}>
            <Text style={styles.title}>{this.props.title}</Text>

            <ScrollView>
              {this.props.children}
            </ScrollView>

            <View style={styles.buttonContainer}>
              {this.props.buttons.map(
                button => <TouchableOpacity
                  onPress={() => button.onPress()}
                  key={button.key}
                  style={styles.button}
                >
                  <Text style={styles.textButton}>{button.text}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1119',
    paddingVertical: 50,
  },
  alert: {
    backgroundColor: '#fff',
    borderRadius: 3,
    width: '85%',
    paddingVertical: 18,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  textButton: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#009688',
  },
});
