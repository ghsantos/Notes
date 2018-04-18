import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  StackNavigator,
  DrawerNavigator,
} from 'react-navigation';

import HomeScreen from '../containers/HomeScreen';
import Edict from '../containers/Edict';
import SecondScreen from '../containers/SecondScreen';
import CustomDrawer from '../components/CustomDrawer';
import { addListener } from '../utils/redux';

const Stack = StackNavigator({
  main: { screen: HomeScreen },
  edict: { screen: Edict },
},
{
  headerMode: 'float',
});

export const AppNavigator = DrawerNavigator({
  Home: { screen: Stack },
  Archive: { screen: Stack },
  Trash: { screen: Stack },
},
{
  contentComponent: (props) => <CustomDrawer {...props} />,
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
