import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {chosenUnicorn} from '../../ducks/reducer'
import {Link} from 'react-router-dom'
import orange from '../../images/orange.png'
import rainbow from '../../images/rainbow.png'
import pink from '../../images/pink.png'
import blue from '../../images/blue.png'
import store from '../../ducks/store'


class ListUnicorn extends Component{

    startGame = () => {
        let fileName = this.props.file_name || "rainbow"
        //Pass the currently chosen unicorn's file_name value to Redux store
        this.props.chosenUnicorn(fileName)
        console.log(fileName)
        axios.put('/edit_user_current_unicorn/' + this.props.id)
            .then(
                this.props.history.push('/play_game/' + fileName)
            )
            .catch(err => {console.log(err)});
        
    }

    render(){
        console.log(store.getState())
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
            <div className="list-unicorn">
                <div className="list-unicorn-container">
                    <div>
                        <img src={chosenImgVar} alt=""/>
                    </div>
                    <div className="list-unicorn-content">
                        <h2>{name}</h2>
                        <div className="list-unicorn-buttons">
                            <div className="button edit">
                                <Link to={"/select_unicorn/" + id}>Edit Unicorn</Link>
                            </div>
                            <button className="button play" onClick={this.startGame}>Play!</button>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        )
    }
}

//Pull the chosenUnicorn function that we imported from the reducer file and attach it to the props object
export default connect(null, {chosenUnicorn})(ListUnicorn);
