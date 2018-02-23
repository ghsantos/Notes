import { AsyncStorage } from 'react-native';

import { ADD_NOTE, DELETE_NOTE, UPDATE_NOTE, NOTES_AVAILABLE } from './types';

export function addNote(note) {
  //return { type: ADD_NOTE, note };
  console.log('asewafvevewvr');
  return dispatch => {
    AsyncStorage.getItem('data', (err, notes) => {
      let newNotes = [];
      if (notes !== null) {
        newNotes = JSON.parse(notes);
      }
      newNotes.unshift(note);
      console.log('new on', newNotes);
      AsyncStorage.setItem('data', JSON.stringify(newNotes), () => {
        dispatch({ type: ADD_NOTE, note });
      });
    });
  };
}

export function getNotes() {
  //return { type: NOTES_AVAILABLE };
  return dispatch => {
    AsyncStorage.getItem('data', (err, notes) => {
      if (notes !== null) {
        dispatch({ type: NOTES_AVAILABLE, notes: JSON.parse(notes) });
      }
    });
  };
}

export function updateNote(note) {
  //return { type: UPDATE_NOTE, note };
  return dispatch => {
    AsyncStorage.getItem('data', (err, notes) => {
      if (notes !== null) {
        const newNotes = JSON.parse(notes);
        const index = getIndex(newNotes, note.key);

        if (index !== -1) {
          newNotes[index].title = note.title;
          newNotes[index].note = note.note;

          AsyncStorage.setItem('data', JSON.stringify(newNotes), () => {
            dispatch({ type: UPDATE_NOTE, note });
          });
        }
      }
    });
  };
}

export function deleteNote(note) {
  //return { type: DELETE_NOTE, note };
  return dispatch => {
    AsyncStorage.getItem('data', (err, notes) => {
      if (notes !== null) {
        const newNotes = JSON.parse(notes);
        const index = getIndex(newNotes, note.key);

        if (index !== -1) {
          newNotes.splice(index, 1);

          AsyncStorage.setItem('data', JSON.stringify(newNotes), () => {
            dispatch({ type: DELETE_NOTE, note });
          });
        }
      }
    });
  };
}

function getIndex(data, key) {
  const clone = JSON.parse(JSON.stringify(data));
  return clone.findIndex((obj) => parseInt(obj.key) === parseInt(key));
}
