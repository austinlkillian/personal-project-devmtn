import React from 'react';
import {Link} from "react-router-dom"

function HomePage(){
    return (
        <div>
            <h1>Home</h1>
            <Link to="play_game/rainbow">Start Playing!</Link>
            <Link to="sign_up">Sign Up</Link>
            <Link to="login">Log In</Link>
        </div>
    )
}


export default HomePage;