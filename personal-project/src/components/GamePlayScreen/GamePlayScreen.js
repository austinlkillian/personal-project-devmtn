import React, {Component} from 'react';
import Nav from '../Nav/Nav';
import GameCanvas from '../GameCanvas/GameCanvas'

class GamePlayScreen extends Component {
    render(){
        return (
            <div>
                <Nav />
                <GameCanvas />
            </div>
        )
    }
}

export default GamePlayScreen;