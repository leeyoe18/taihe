/**
 * Created by liqun on 2017/8/10.
 */
import React from 'react';
import { StackNavigator } from 'react-navigation';

import Main from './containers/main';
import Detail from './containers/detail';
import Web from './containers/web';
import User from './containers/user';
import Login from './containers/login';
import Search from './containers/search';
import Pano from './containers/pano';
import Analysis from './containers/analysis';

const App = StackNavigator({
    Home: { screen: Main },
    Detail: { screen: Detail },
    Web: { screen: Web },
    Login: { screen: Login },
    User: { screen: User },
    Search: { screen: Search },
    Pano: { screen: Pano },
    Analysis: { screen: Analysis}
});

export default App;
