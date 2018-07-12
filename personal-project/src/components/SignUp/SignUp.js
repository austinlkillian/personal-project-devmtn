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
        axios.post('/new_user', {username: username, password: password})
            .then(response => {
                this.setState({
                    username: '',
                    password: ''
                })
                this.props.history.push("/pick_unicorn")
            })
            .catch(err => {
                console.log(err)
            });
    }

    render(){
        return (
            <div>
                <Nav {...this.props} />
                <h1>Sign Up</h1>
                <input type="text" onChange={(e) => {this.setState({username: e.target.value})}} placeholder="Username" value={this.state.username}/>
                <input type="text" onChange={(e) => {this.setState({password: e.target.value})}} placeholder="Password" value={this.state.password}/>
                <button onClick={this.newUser}>Submit</button>
            </div>
        )
    }
}

export default SignUp;
//export default connect(null, {gatherUserId: gatherUserId})(Auth);