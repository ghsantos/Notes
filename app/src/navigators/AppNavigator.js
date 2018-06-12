import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  StackNavigator,
  DrawerNavigator,
} from 'react-navigation';

import HomeScreen from '../containers/HomeScreen';
import ArchiveScreen from '../containers/ArchiveScreen';
import TrashScreen from '../containers/TrashScreen';
import Edict from '../containers/Edict';
import MarkerEdict from '../containers/MarkerEdict';
import CustomDrawer from '../components/CustomDrawer';
import { addListener } from '../utils/redux';

const Home = StackNavigator({
  main: { screen: HomeScreen, params: { type: 'note' } },
  edict: { screen: Edict },
},
{
  headerMode: 'float',
});

const Archive = StackNavigator({
  main: { screen: ArchiveScreen },
  edict: { screen: Edict },
},
{
  headerMode: 'float',
});

const Trash = StackNavigator({
  main: { screen: TrashScreen },
  edict: { screen: Edict },
},
{
  headerMode: 'float',
});

const MainNavigator = DrawerNavigator({
  Home: { screen: Home },
  Archive: { screen: Archive },
  Trash: { screen: Trash },
},
{
  contentComponent: (props) => <CustomDrawer {...props} />,
});

export const AppNavigator = StackNavigator({
  main: { screen: MainNavigator },
  marker: { screen: MarkerEdict },
},
{
  headerMode: 'none',
});

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener,
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
