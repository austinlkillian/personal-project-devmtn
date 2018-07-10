import React from 'react';
import {Switch, Route} from 'react-router-dom';
import SignUp from "./components/SignUp/SignUp";
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import GamePlayScreen from './components/GamePlayScreen/GamePlayScreen';
import PickUnicorn from './components/PickUnicorn/PickUnicorn';
import CreateUnicorn from './components/CreateUnicorn/CreateUnicorn'


export default (
    <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/sign_up" component={SignUp}/>
        <Route path="/login" component={Login} />
        <Route path="/play_game" component={GamePlayScreen}/>
        <Route path="/pick_unicorn" component={PickUnicorn} />
        <Route path="/create_unicorn" component={CreateUnicorn}/>
    </Switch>
)