import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  StackNavigator,
  DrawerNavigator,
} from 'react-navigation';
import { Animated, Easing } from 'react-native';

import HomeScreen from '../containers/HomeScreen';
import ArchiveScreen from '../containers/ArchiveScreen';
import TrashScreen from '../containers/TrashScreen';
import Edict from '../containers/Edict';
import MarkerEdict from '../containers/MarkerEdict';
import CustomDrawer from '../components/CustomDrawer';
import { addListener } from '../utils/redux';

const transitionConfig = () => ({
    transitionSpec: {
      duration: 350,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { position, layout, scene, index, scenes } = sceneProps;
      const toIndex = index;
      const thisSceneIndex = scene.index;
      const width = layout.initWidth;

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        outputRange: [width, 0, 0],
      });

      const slideFromRight = { transform: [{ translateX }] };

      const lastSceneIndex = scenes[scenes.length - 1].index;

      if (lastSceneIndex - toIndex > 1) {
        if (scene.index === toIndex) return;
        if (scene.index !== lastSceneIndex) return { opacity: 0 };
      }

      return slideFromRight;
    },
});

const Home = StackNavigator({
  main: { screen: HomeScreen, params: { type: 'note' } },
  edict: { screen: Edict },
},
{
  transitionConfig,
});

const Archive = StackNavigator({
  main: { screen: ArchiveScreen },
  edict: { screen: Edict },
},
{
  transitionConfig,
});

const Trash = StackNavigator({
  main: { screen: TrashScreen },
  edict: { screen: Edict },
},
{
  transitionConfig,
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
