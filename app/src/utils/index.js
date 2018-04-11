import { AsyncStorage } from 'react-native';
import CryptoJS from 'crypto-js';

export async function confirmPass(pass) {
  const cryptoPass = await getCryptoPass();

  if (CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex) === cryptoPass) {
    return true;
  }

  return false;
}

async function getCryptoPass() {
  try {
    let password;

    await AsyncStorage.getItem('password', (err, pass) => {
      password = pass;
    });

    return password;
  } catch (e) {
    return null;
  }
}

export async function hasCryptoPass() {
  const pass = await getCryptoPass();

  return !!pass;
}

export function savePass(pass) {
  const cryptoPass = CryptoJS.SHA256(pass).toString(CryptoJS.enc.Hex);

  AsyncStorage.setItem('password', cryptoPass);
}
