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
import {orangeUnicorn} from '../../svg_images'
import {pinkUnicorn} from '../../svg_images'
import {rainbowUnicorn} from '../../svg_images'
import {raspberryUnicorn} from '../../svg_images'


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
                chosenImgVar = orangeUnicorn({}, 284, 325);
                break;
            case ("blue"):
                chosenImgVar = raspberryUnicorn({}, 284, 325);
                break;
            case ("pink"):
                chosenImgVar = pinkUnicorn({}, 284, 325);
                break;
            case ("rainbow"):
                chosenImgVar = rainbowUnicorn({}, 284, 325);
                break;
            default:
                chosenImgVar = rainbowUnicorn({}, 284, 325);
        }

        return (
            <div className="list-unicorn">
                <div className="list-unicorn-container">
                    <div className="image-edit">
                        {chosenImgVar}
                        {/* <img src={chosenImgVar} alt=""/> */}
                        <div className="button edit">
                            <Link to={"/select_unicorn/" + id}>Edit</Link>
                        </div>
                    </div>
                    <div className="list-unicorn-content">
                        <div className="list-unicorn-buttons">
                            <div className="unicorn-name">
                                <h2>{name}</h2>
                            </div>
                            <button className="button play" onClick={this.startGame}>Play Game!</button>
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
