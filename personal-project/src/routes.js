import React from 'react';
import {Switch, Route} from 'react-router-dom';
import SignUp from "./components/SignUp/SignUp";
import Home from './components/Home/Home';
import Login from './components/Login/Login'


export default (
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/sign_up" component={SignUp}/>
        <Route path="/login" component={Login} />
    </Switch>
)