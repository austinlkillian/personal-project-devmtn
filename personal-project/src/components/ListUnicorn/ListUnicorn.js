import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import orange from '../../images/orange.png'
import rainbow from '../../images/rainbow.png'
import pink from '../../images/pink.png'
import blue from '../../images/blue.png'

class ListUnicorn extends Component{
    constructor(){
        super()
        this.state = {
            unicorn: {}
        }
    }

    startGame = () => {
        let fileName = this.props.file_name || "rainbow"
        axios.put('/edit_user_current_unicorn/' + this.props.id)
            .then(
                this.props.history.push('/play_game/' + fileName)
            )
            .catch(err => {console.log(err)});
    }

    render(){
        console.log(this.state.unicorn)
        let {name, file_name, id} = this.props
        let chosenImgVar;
        switch(file_name){
            case ("orange"):
                chosenImgVar = orange;
                break;
            case ("blue"):
                chosenImgVar = blue;
                break;
            case ("pink"):
                chosenImgVar = pink;
                break;
            case ("rainbow"):
                chosenImgVar = rainbow;
                break;
            default:
                chosenImgVar = rainbow;
        }

        return (
            <div>
                <h1>List Unicorn</h1>
                <img src={chosenImgVar} alt=""/>
                {name}
                <Link to={"/select_unicorn/" + id}>Edit Unicorn</Link>
                <button onClick={this.startGame}>Play!</button>
                <hr/>
            </div>
        )
    }
}

export default ListUnicorn;