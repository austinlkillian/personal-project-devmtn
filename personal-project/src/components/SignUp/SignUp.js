import React, {Component } from 'react';
import axios from 'axios';
import Nav from "../Nav/Nav"
//import {connect} from 'react-redux'
//import {gatherUserId} from '../../ducks/reducer'

class SignUp extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: ''
        }
    }

    newUser = () => {
        let {username, password} = this.state;
        axios.get('/all_usernames')
            .then(usernames => {
                let nameArray = usernames.data.map(val => {
                    return val.username
                })
                //Check to see if username already exists in the database
                if(nameArray.indexOf(username) === -1){
                    axios.post('/new_user', {username: username, password: password})
                        .then(response => {
                            //Create a single default unicorn that all users have access to
                            let newUserId = response.data[0].id;
                            axios.post('/new_unicorn', {name: "Bubbles", file_name: "rainbow", user_id: newUserId})
                                .then( response => {
                        //Navigate back to the "Pick Your Unicorn" page
                                    this.props.history.push('/pick_unicorn')
                                })
                                .catch(err => {console.log(err)})
                            //Set the username and password fields to be blank
                            this.setState({
                            username: '',
                            password: ''
                            })
                        })
                        .catch(err => {
                            console.log("Unable to create new user.",err)
                        });
                }  else{
                    alert("Please choose a different username. This username is already taken.")
                }
            })
            .catch(err => {
                console.log("Unable to access username info.", err)
            })
    }

    onEnter = (e) => {
        if(e.key==="Enter" && (this.state.username && this.state.password)){
            this.newUser()
        }
    }

    render(){
        return (
            <div onKeyDown={e => this.onEnter(e)}>
                <Nav {...this.props} />
                <div className="auth-container">
                    <h1 className="auth-title">Sign Up</h1>
                    <input 
                        autoFocus={true} 
                        className="auth-input" 
                        type="text" 
                        onChange={(e) => {this.setState({username: e.target.value})}} 
                        placeholder="Username" 
                        value={this.state.username}
                        maxLength="25"/>
                    <input 
                        className="auth-input" 
                        type="password" 
                        onChange={(e) => {this.setState({password: e.target.value})}} 
                        placeholder="Password" 
                        value={this.state.password}
                        maxLength="25"/>
                    <button className="auth-submit button" onClick={this.newUser}>Submit</button>
                </div>
            </div>
        )
    }
}

export default SignUp;
//export default connect(null, {gatherUserId: gatherUserId})(Auth);