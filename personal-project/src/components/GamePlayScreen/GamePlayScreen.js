import React, {Component} from 'react';
import axios from 'axios'
import Nav from '../Nav/Nav';
import GameCanvas from '../GameCanvas/GameCanvas'

class GamePlayScreen extends Component {

    constructor(){
        super();
        this.state = {
            current_unicorn: {}
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
                            current_unicorn: currentUnicorn
                       })
                    })
                    .catch(err => {console.log(err)})
            })
            .catch(err => {console.log(err)})
    }

    render(){
        let unicornFile = this.props.match.params.file_name
        return (
            <div>
                <Nav {...this.props} currentUnicorn={this.state.current_unicorn}/>
                <div className="popup">Heya, buddy</div>
                <GameCanvas unicornFile={unicornFile} />
            </div>
        )
    }
}

export default GamePlayScreen;