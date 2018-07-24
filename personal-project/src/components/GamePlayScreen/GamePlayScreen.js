import React, {Component} from 'react';
import axios from 'axios'
import Nav from '../Nav/Nav';
import GameCanvas from '../GameCanvas/GameCanvas'

class GamePlayScreen extends Component {

    constructor(){
        super();
        this.state = {
            current_unicorn: {},
            current_user: {}
        }
    }

    componentDidMount(){
        let unicornId;
        let currentUnicorn;
        axios.get('/current_user')
            .then(user => {
                unicornId = user.data[0].current_unicorn
                axios.get('/select_unicorn/' + unicornId)
                    .then(unicorn => {
                        currentUnicorn = unicorn.data[0]
                        this.setState({
                            current_unicorn: currentUnicorn,
                            current_user: user.data[0]
                       })
                    })
                    .catch(err => {console.log(err)})
            })
            .catch(err => {console.log(err)})
    }

    render(){
        // console.log(this.state.current_user)
        let unicornFile = this.props.match.params.file_name
        return (
            <div className="game-play-screen">
                <Nav {...this.props} currentUnicorn={this.state.current_unicorn}/>
                <GameCanvas unicornFile={unicornFile} currentUser={this.state.current_user}/>
            </div>
        )
    }
}

export default GamePlayScreen;