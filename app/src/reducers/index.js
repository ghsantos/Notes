import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import {
  NAV_ADD_NOTE,
  NAV_EDIT_NOTE,
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
  MARKERS_AVAILABLE,
  UPDATE_MARKERS,
  SET_MARKER_KEY,
} from '../actions/types';
import { AppNavigator } from '../navigators/AppNavigator';

const INITIAL_NOTES_STATE = { notes: [] };

function noteReducer(state = INITIAL_NOTES_STATE, action) {
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
        notes[index] = { ...note };
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

const INITIAL_ARCHIVE_STATE = { notes: [] };

function archiveReducer(state = INITIAL_ARCHIVE_STATE, action) {
  let nextState;

  let notes = JSON.parse(JSON.stringify(state.notes));
  let note;
  let index;

  switch (action.type) {
    case ADD_ARCHIVE:
      notes.unshift(action.note);
      nextState = { notes };
      break;

    case ARCHIVES_AVAILABLE:
      notes = JSON.parse(JSON.stringify(action.notes));
      nextState = { notes };
      break;

    case UPDATE_ARCHIVE:
      note = action.note;
      index = getIndex(notes, note.key);

      if (index !== -1) {
        notes[index] = { ...note };
      }
      nextState = { notes };
      break;

    case DELETE_ARCHIVE:
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

const INITIAL_TRASH_STATE = { notes: [] };

function trashReducer(state = INITIAL_TRASH_STATE, action) {
  let nextState;

  let notes = JSON.parse(JSON.stringify(state.notes));
  let note;
  let index;

  switch (action.type) {
    case ADD_TRASH:
      notes.unshift(action.note);
      nextState = { notes };
      break;

    case TRASH_AVAILABLE:
      notes = JSON.parse(JSON.stringify(action.notes));
      nextState = { notes };
      break;

    case DELETE_TRASH:
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

const INITIAL_MARKERS_STATE = { markers: [] };

function markersReducer(state = INITIAL_MARKERS_STATE, action) {
  switch (action.type) {
    case MARKERS_AVAILABLE:
      return { markers: [...action.markers] };

    case UPDATE_MARKERS:
      return { markers: [...action.markers] };

    default:
      return state;
  }
}

const INITIAL_MARKER_KEY_STATE = { markerKey: '' };

function markerKeyReducer(state = INITIAL_MARKER_KEY_STATE, action) {
  switch (action.type) {
    case SET_MARKER_KEY:
      return { markerKey: action.markerKey };

    default:
      return state;
  }
}

function getIndex(data, key) {
  const clone = JSON.parse(JSON.stringify(data));
  return clone.findIndex((obj) => parseInt(obj.key, 10) === parseInt(key, 10));
}

const AppReducer = combineReducers({
  nav,
  noteReducer,
  archiveReducer,
  trashReducer,
  markersReducer,
  markerKeyReducer,
});

export default AppReducer;
