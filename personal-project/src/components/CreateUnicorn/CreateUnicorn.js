import React, {Component} from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import orange from '../../images/orange.png'
import rainbow from '../../images/rainbow.png'
import pink from '../../images/pink.png'
import blue from '../../images/blue.png'
import {orangeUnicorn} from '../../svg_images'
import {pinkUnicorn} from '../../svg_images'
import {rainbowUnicorn} from '../../svg_images'
import {raspberryUnicorn} from '../../svg_images'

class CreateUnicorn extends Component{
    constructor(){
        super()
        this.state = {
            name: "",
            file_name: "", //This is the chosen unicorn's file
            currentUser: {}
        }
    }

    componentDidMount(){
        axios.get('/current_user')
        .then(res => {
            //This object contains all the data for the current user
            if(res.data[0]){
                this.setState({
                    currentUser: res.data[0]
                })
            }
        })
        .catch(err => {console.log(err)})
    }

    newUnicorn = () => {
        let {name, file_name, currentUser} = this.state;
        axios.post('/new_unicorn', {name: name, file_name: file_name, user_id: currentUser.id})
            .then( response => {
                this.props.history.push('/pick_unicorn')
            })
            .catch(err => {console.log(err)})
    }

    updateChosenUnicorn = (e) => {
        this.setState({
            file_name: e.target.value
        })
    }

    //Makes it so pressing Enter creates new unicorn
    onEnter = (e) => {
        if(e.key==="Enter"){
            this.newUnicorn();
        }
    }

    render(){
        // console.log(this.state.currentUser, this.state.chosenUnicorn)
        let {file_name} = this.state;
        let chosenImgVar;
        switch(file_name){
            case ("orange"):
                chosenImgVar = orangeUnicorn({}, 195, 222);
                break;
            case ("blue"):
                chosenImgVar = raspberryUnicorn({}, 195, 222);
                break;
            case ("pink"):
                chosenImgVar = pinkUnicorn({}, 195, 222);
                break;
            case ("rainbow"):
                chosenImgVar = rainbowUnicorn({}, 195, 222);
                break;
            default:
                chosenImgVar = rainbowUnicorn({}, 195, 222);
        }
        return (
            <div onKeyDown={e => this.onEnter(e)}>
                <Nav {...this.props} />
                <div className="format-unicorn">
                    <h1 className="title">Create Your Unicorn!</h1>
                    <div className="content-main">
                        <div>
                            <div>
                                {chosenImgVar}
                                {/* <img className="main-image" src={chosenImgVar} alt=""/> */}
                            </div>
                            <div className="image-choices">
                                <div className="thumbnails">
                                    <label htmlFor="rainbow">
                                        {rainbowUnicorn({}, 50, 57)}
                                        {/* <img className="thumbnail" src={rainbow} alt=""/> */}
                                    </label>
                                    <label htmlFor="pink">
                                        {pinkUnicorn({}, 50, 57)}
                                        {/* <img className="thumbnail" src={pink} alt=""/> */}
                                    </label>
                                    <label htmlFor="orange">
                                        {orangeUnicorn({}, 50, 57)}
                                        {/* <img className="thumbnail" src={orange} alt=""/> */}
                                    </label>
                                    <label htmlFor="blue">
                                        {raspberryUnicorn({}, 50, 57)}
                                        {/* <img className="thumbnail" src={blue} alt=""/> */}
                                    </label>
                                </div>
                                <div>
                                    <input
                                        className="radio"
                                        name="chosen"
                                        value="rainbow"
                                        id="rainbow"
                                        type="radio"
                                        onClick={e => this.updateChosenUnicorn(e)}
                                        defaultChecked={true}/>

                                    <input
                                        className="radio"
                                        name="chosen"
                                        value="pink"
                                        id="pink"
                                        type="radio"
                                        onClick={e => this.updateChosenUnicorn(e)}/>

                                    <input
                                        className="radio"
                                        name="chosen"
                                        value="orange"
                                        id="orange"
                                        type="radio"
                                        onClick={e => this.updateChosenUnicorn(e)}/>

                                    <input
                                        className="radio"
                                        name="chosen"
                                        value="blue"
                                        id="blue"
                                        type="radio"
                                        onClick={e => this.updateChosenUnicorn(e)}/>
                                </div>
                            </div>
                        </div>
                        <div className="name-and-save">
                            <input
                            type="text"
                            placeholder="Name your unicorn!"
                            onChange={(e) => {this.setState({name: e.target.value})}}
                            value={this.state.name}
                            maxLength="25"
                            className="unicorn-name-input"
                            autoFocus={true}/>
                            <button onClick={this.newUnicorn} className="button">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateUnicorn;