import React, {Component} from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import orange from '../../images/orange.png'
import rainbow from '../../images/rainbow.png'
import pink from '../../images/pink.png'
import blue from '../../images/blue.png'

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
    render(){
        // console.log(this.state.currentUser, this.state.chosenUnicorn)
        let {file_name} = this.state;
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
                <Nav {...this.props} />
                <h1>Create Your Unicorn!</h1>
                <img src={chosenImgVar} alt=""/>
                <input
                    type="text"
                    placeholder="Name your unicorn!"
                    onChange={(e) => {this.setState({name: e.target.value})}}
                    value={this.state.name}/>
                <br/>
                <label htmlFor="rainbow">Rainbow</label>
                <input 
                    name="chosen"
                    value="rainbow" 
                    id="rainbow" 
                    type="radio" 
                    onClick={e => this.updateChosenUnicorn(e)}
                    defaultChecked={true}/>
                <label htmlFor="pink">Pink</label>
                <input 
                    name="chosen"
                    value="pink" 
                    id="pink" 
                    type="radio" 
                    onClick={e => this.updateChosenUnicorn(e)}/>
                <label htmlFor="orange">Orange</label>
                <input 
                    name="chosen"
                    value="orange" 
                    id="orange" 
                    type="radio"
                    onClick={e => this.updateChosenUnicorn(e)}/>
                <label htmlFor="blue">Blue</label>
                <input 
                    name="chosen"
                    value="blue" 
                    id="blue" 
                    type="radio"
                    onClick={e => this.updateChosenUnicorn(e)}/>
                <br/>
                <button onClick={this.newUnicorn}>Save</button>
            </div>
        )
    }
}

export default CreateUnicorn;