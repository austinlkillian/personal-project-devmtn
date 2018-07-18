import React, {Component} from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import orange from '../../images/orange.png'
import rainbow from '../../images/rainbow.png'
import pink from '../../images/pink.png'
import blue from '../../images/blue.png'

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

    render(){
        let {file_name} = this.state;
        let chosenImgVar;
        let rainbowCheck;
        let pinkCheck;
        let orangeCheck;
        let blueCheck;
        switch(file_name){
            case ("orange"):
                chosenImgVar = orange;
                orangeCheck = true;
                break;
            case ("blue"):
                chosenImgVar = blue;
                blueCheck = true;
                break;
            case ("pink"):
                chosenImgVar = pink;
                pinkCheck = true;
                break;
            case ("rainbow"):
                chosenImgVar = rainbow;
                rainbowCheck = true;
                break;
            default:
                chosenImgVar = rainbow;
        }
        let imageElement;
        if(this.state.file_name){
            imageElement = <img src={chosenImgVar} alt=""/>
        }

        return (
            <div>
                <Nav {...this.props} />
                <h1>Edit Your Unicorn!</h1>
                {imageElement}
                <button onClick={this.deleteUnicorn}>Delete Unicorn</button>
                <br/>
                <input
                    type="text"
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
                    defaultChecked={rainbowCheck}/>
                <label htmlFor="pink">Pink</label>
                <input 
                    name="chosen"
                    value="pink" 
                    id="pink" 
                    type="radio" 
                    onClick={e => this.updateChosenUnicorn(e)}
                    defaultChecked={pinkCheck}/>
                <label htmlFor="orange">Orange</label>
                <input 
                    name="chosen"
                    value="orange" 
                    id="orange" 
                    type="radio"
                    onClick={e => this.updateChosenUnicorn(e)}
                    defaultChecked={orangeCheck}/>
                <label htmlFor="blue">Blue</label>
                <input 
                    name="chosen"
                    value="blue" 
                    id="blue" 
                    type="radio"
                    onClick={e => this.updateChosenUnicorn(e)}
                    defaultChecked={blueCheck}/>
                <br/>
                <button onClick={this.editUnicorn}>Save</button>
            </div>
        )
    }
}

export default EditUnicorn;