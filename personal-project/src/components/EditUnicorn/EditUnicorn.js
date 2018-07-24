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

class EditUnicorn extends Component{
    constructor(){
        super()
        this.state = {
            name: "",
            file_name: "",
            unicornId: null, //This is the chosen unicorn's file
            currentUser: {},
        }
    }

    componentDidMount(){
        //Get current user info
        axios.get('/current_user')
            .then(res => {
                //This object contains all the data for the current user
                if(res.data[0]){
                    this.setState({
                        currentUser: res.data[0],
                    })
                }
            })
            .catch(err => {console.log(err)})
        //Get current chosen unicorn
        axios.get('/select_unicorn/' + parseInt(this.props.match.params.id))
            .then(unicorn => {
                this.setState({
                    currentUnicorn: unicorn.data[0],
                    name: unicorn.data[0].name,
                    file_name: unicorn.data[0].file_name,
                    unicornId: unicorn.data[0].id
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    editUnicorn = () => {
        let {name, file_name, unicornId} = this.state;
        axios.put('/edit_unicorn', {name: name, file_name: file_name, id: unicornId})
            .then( response => {
                this.props.history.push('/pick_unicorn')
            })
            .catch(err => {console.log(err)})
    }

    deleteUnicorn = () => {
        let {unicornId} = this.state;
        axios.delete('/delete_unicorn/' + unicornId)
            .then(
                this.props.history.push("/pick_unicorn")
            )
            .catch(err => {console.log(err)})
    }

    updateChosenUnicorn = (e) => {
        this.setState({
            file_name: e.target.value
        })
    }

    //Makes it so pressing Enter edits your unicorn
    onEnter = (e) => {
        if(e.key==="Enter"){
            this.editUnicorn();
        }
    }

    render(){
        let {file_name} = this.state;
        let chosenImgVar;
        let rainbowCheck;
        let pinkCheck;
        let orangeCheck;
        let blueCheck;
        switch(file_name){
            case ("orange"):
                chosenImgVar = orangeUnicorn({}, 260, 298);
                orangeCheck = true;
                break;
            case ("blue"):
                chosenImgVar = raspberryUnicorn({}, 260, 298);
                blueCheck = true;
                break;
            case ("pink"):
                chosenImgVar = pinkUnicorn({}, 260, 298);
                pinkCheck = true;
                break;
            case ("rainbow"):
                chosenImgVar = rainbowUnicorn({}, 260, 298);
                rainbowCheck = true;
                break;
            default:
                chosenImgVar = rainbowUnicorn({}, 260, 298);
        }
        let imageElement;
        if(this.state.file_name){
            imageElement = <img className="main-image" src={chosenImgVar} alt=""/>
        }

        return (
            <div onKeyDown={e => this.onEnter(e)}>
                <Nav {...this.props} />
                <div className="format-unicorn">
                    <h1 className="title">Edit Your Unicorn!</h1>
                    <div className="content-main">
                        <div>
                            <div>
                                {chosenImgVar}
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
                                        name="chosen"
                                        value="rainbow" 
                                        id="rainbow" 
                                        type="radio" 
                                        onClick={e => this.updateChosenUnicorn(e)}
                                        defaultChecked={rainbowCheck}
                                        className="radio"/>
                                        
                                    <input 
                                        name="chosen"
                                        value="pink" 
                                        id="pink" 
                                        type="radio" 
                                        onClick={e => this.updateChosenUnicorn(e)}
                                        defaultChecked={pinkCheck}
                                        className="radio"/>

                                    <input
                                        name="chosen"
                                        value="orange"
                                        id="orange"
                                        type="radio"
                                        onClick={e => this.updateChosenUnicorn(e)}
                                        defaultChecked={orangeCheck}
                                        className="radio"/>
                                    <input
                                        name="chosen"
                                        value="blue"
                                        id="blue"
                                        type="radio"
                                        onClick={e => this.updateChosenUnicorn(e)}
                                        defaultChecked={blueCheck}
                                        className="radio"/>
                                </div>

                            </div>
                        </div>
                        <div className="name-and-save">
                            <input
                                type="text"
                                onChange={(e) => {this.setState({name: e.target.value})}}
                                value={this.state.name}
                                maxLength="25"
                                className="unicorn-name-input"
                                autoFocus={true}/>
                            <button className="button delete-button" onClick={this.deleteUnicorn}>Delete</button>
                            <button className="button button-edit-save" onClick={this.editUnicorn}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditUnicorn;