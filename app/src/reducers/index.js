import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import {
  NAV_ADD_NOTE,
  NAV_EDIT_NOTE,
  ADD_NOTE,
  NOTES_AVAILABLE,
  UPDATE_NOTE,
  DELETE_NOTE,
} from '../actions/types';
import { AppNavigator } from '../navigators/AppNavigator';

const INITIAL_STATE = { notes: [] };

function noteReducer(state = INITIAL_STATE, action) {
  let nextState;

  let notes = JSON.parse(JSON.stringify(state.notes));
  let note;
  let index;

  switch (action.type) {
    case ADD_NOTE:
      notes.unshift(action.note);
      nextState = { notes };
      break;

      case NOTES_AVAILABLE:
        notes = JSON.parse(JSON.stringify(action.notes));
        nextState = { notes };
        break;

    case UPDATE_NOTE:
      note = action.note;
      index = getIndex(notes, note.key);

      if (index !== -1) {
        notes[index].title = note.title;
        notes[index].note = note.note;
        notes[index].color = note.color;
      }
      nextState = { notes };
      break;

    case DELETE_NOTE:
      note = action.note;
      index = getIndex(notes, note.key);

      if (index !== -1) {
        notes.splice(index, 1);
      }

      nextState = { notes };
      break;
    default:

  }

  return nextState || state;
}

function nav(state, action) {
  let nextState;

  switch (action.type) {
    case NAV_ADD_NOTE:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'edict' }),
        state
      );
      break;

    case NAV_EDIT_NOTE:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: 'edict',
          params: { note: action.note }
        }),
        state
      );
      break;

    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

function getIndex(data, key) {
  const clone = JSON.parse(JSON.stringify(data));
  return clone.findIndex((obj) => parseInt(obj.key, 10) === parseInt(key, 10));
}

const AppReducer = combineReducers({
  nav,
  noteReducer,
});

export default AppReducer;
