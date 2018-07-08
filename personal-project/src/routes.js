import React from 'react';
import {Switch, Route} from 'react-router-dom';
import SignUp from "./components/SignUp/SignUp";
import Home from './components/Home/Home';


export default (
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/sign_up" component={SignUp}/>
    </Switch>
)