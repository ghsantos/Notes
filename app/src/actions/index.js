import { AsyncStorage } from 'react-native';

import {
  ADD_NOTE,
  NOTES_AVAILABLE,
  UPDATE_NOTE,
  DELETE_NOTE,
  ARCHIVES_AVAILABLE,
  ADD_ARCHIVE,
  UPDATE_ARCHIVE,
  DELETE_ARCHIVE,
  ADD_TRASH,
  TRASH_AVAILABLE,
  DELETE_TRASH,
} from './types';

export function getNotes(typeAnnotation) {
  return dispatch => {
    AsyncStorage.getItem(typeAnnotation, (err, notes) => {
      if (notes !== null) {
        if (typeAnnotation === 'note') {
          dispatch({ type: NOTES_AVAILABLE, notes: JSON.parse(notes) });
        } else if (typeAnnotation === 'archive') {
          dispatch({ type: ARCHIVES_AVAILABLE, notes: JSON.parse(notes) });
        } else if (typeAnnotation === 'trash') {
          dispatch({ type: TRASH_AVAILABLE, notes: JSON.parse(notes) });
        }
      }
    });
  };
}

export function addNote(note) {
  return dispatch => {
    AsyncStorage.getItem(note.typeAnnotation, (err, notes) => {
      let newNotes = [];
      if (notes !== null) {
        newNotes = JSON.parse(notes);
      }
      newNotes.unshift(note);
      AsyncStorage.setItem(note.typeAnnotation, JSON.stringify(newNotes), () => {
        if (note.typeAnnotation === 'note') {
          dispatch({ type: ADD_NOTE, note });
        } else if (note.typeAnnotation === 'archive') {
          dispatch({ type: ADD_ARCHIVE, note });
        } else if (note.typeAnnotation === 'trash') {
          dispatch({ type: ADD_TRASH, note });
        }
      });
    });
  };
}

export function updateNote(note) {
  return dispatch => {
    AsyncStorage.getItem(note.typeAnnotation, (err, notes) => {
      if (notes !== null) {
        const newNotes = JSON.parse(notes);
        const index = getIndex(newNotes, note.key);

        if (index !== -1) {
          newNotes[index].title = note.title;
          newNotes[index].note = note.note;
          newNotes[index].color = note.color;
          newNotes[index].locked = note.locked;
          newNotes[index].typeAnnotation = note.typeAnnotation;

          AsyncStorage.setItem(note.typeAnnotation, JSON.stringify(newNotes), () => {
            if (note.typeAnnotation === 'note') {
              dispatch({ type: UPDATE_NOTE, note });
            } else if (note.typeAnnotation === 'archive') {
              dispatch({ type: UPDATE_ARCHIVE, note });
            }
          });
        }
      }
    });
  };
}

export function deleteNote(note) {
  return dispatch => {
    AsyncStorage.getItem(note.typeAnnotation, (err, notes) => {
      if (notes !== null) {
        const newNotes = JSON.parse(notes);
        const index = getIndex(newNotes, note.key);

        if (index !== -1) {
          newNotes.splice(index, 1);

          AsyncStorage.setItem(note.typeAnnotation, JSON.stringify(newNotes), () => {
            if (note.typeAnnotation === 'note') {
              dispatch({ type: DELETE_NOTE, note });
            } else if (note.typeAnnotation === 'archive') {
              dispatch({ type: DELETE_ARCHIVE, note });
            } else if (note.typeAnnotation === 'trash') {
              dispatch({ type: DELETE_TRASH, note });
            }
          });
        }
      }
    });
  };
}

function getIndex(data, key) {
  const clone = JSON.parse(JSON.stringify(data));
  return clone.findIndex((obj) => parseInt(obj.key, 10) === parseInt(key, 10));
}
