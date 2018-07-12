import React, {Component } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav'

//import {connect} from 'react-redux'
//import {gatherUserId} from '../../ducks/reducer'

class Login extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: ''
        }
    }

    login =() => {
        let {username, password} = this.state;
        axios.post('/login', {username: username, password: password})
            .then(response => {
                console.log("You logged in!")
                // this.props.gatherUserId(username);
                this.setState({
                    username: '',
                    password: ''
                })
                this.props.history.push('/pick_unicorn');
            })
            .catch(err => {
                console.log(err)
            });
    }

    onEnter = (e) => {
        if(e.key==="Enter" && (this.state.username && this.state.password)){
            this.login()
        }
    }

    render(){
        return (
            <div onKeyDown={e => this.onEnter(e)}>
                <Nav {...this.props} />
                <h1>Login</h1>
                <input
                    type="text"
                    onChange={(e) => {this.setState({username: e.target.value})}} placeholder="Username" 
                    value={this.state.username}/>

                <input 
                    type="text" 
                    onChange={(e) => {this.setState({password: e.target.value})}} placeholder="Password" 
                    value={this.state.password}/>

                <button onClick={this.login}>Login</button>
            </div>
        )
    }
}

export default Login;
//export default connect(null, {gatherUserId: gatherUserId})(Auth);