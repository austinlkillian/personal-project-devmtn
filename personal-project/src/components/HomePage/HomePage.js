import React from 'react';
import {Link} from "react-router-dom"
import {rainbowUnicorn} from '../../svg_images';
import {pinkUnicorn} from '../../svg_images';
import {raspberryUnicorn} from '../../svg_images'
import Particles from 'react-particles-js';

function HomePage(){
    return (
        <div className='home-page'>
            <Particles style={{
                width: '100%',
                minHeight: '100vh',
                height: "100%",
                position: "absolute"
              }}
              params={{"particles":{"number":{"value":346,"density":{"enable":true,"value_area":7496.902595506591}},"color":{"value":"#fff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":60.1279522824571,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":500,"color":"#ffffff","opacity":0.4,"width":2},"move":{"enable":true,"speed":2,"direction":"bottom","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"bubble"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}}/>
            <div className="home-container">
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
                {rainbowUnicorn({}, 280, null)}
                {pinkUnicorn({}, 150, null)}
                {raspberryUnicorn({}, 180, null)}
            </div>
        </div>
    )
}


export default HomePage;


