import React from 'react';
import {Link} from "react-router-dom"

function HomePage(){
    return (
        <div className='home-page'>
            <div className="home-title">
                <h1 className="home-title-text-unicorn">Unicorns</h1>
                <h1 className="home-title-text-vs">vs</h1>
                <h1 className="home-title-text-bubbles">Bubbles</h1>
            </div>
            <div className="link home-play">
                <Link to="play_game/rainbow" className="link">Play</Link>
            </div>
            <div className="home-message">
                <p>Sign up or log in to create your own unicorns!</p>
            </div>
            <div className='link home-auth sign-up'>
                <Link to="sign_up">Sign Up</Link>
            </div>
            <div className='link home-auth login'>
                <Link to="login">Log In</Link>
            </div>
        </div>
    )
}


export default HomePage;