import React, {Component } from 'react';
import axios from 'axios';
import Nav from "../Nav/Nav"
import {withRouter} from 'react-router-dom'
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
        // let {username, password} = this.state;
        // axios.post('/new_user', {username: username, password: password})
        //     .then(response => {
        //         console.log(response)
        //         this.setState({
        //             username: '',
        //             password: ''
        //         })
        //         //this.history.push('/dashboard')
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     });
        this.props.history.push("/pick_unicorn")
    }

    // login =() => {
    //     let {username, password} = this.state;
    //     axios.get(`/login?username=${username}&password=${password}`)
    //         .then(response => {
    //             console.log(response)
    //             console.log("You logged in!")
    //             this.props.gatherUserId(username);
    //             this.setState({
    //                 username: '',
    //                 password: ''
    //             })
    //             //this.history.push('/dashboard')
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         });
    // }


    render(){
        console.log(this.state.username, this.state.password)
        return (
            <div>
                <Nav />
                <h1>Sign Up</h1>
                {/* <input type="text" onChange={(e) => {this.setState({username: e.target.value})}} placeholder="Username" value={this.state.username}/>
                <input type="text" onChange={(e) => {this.setState({password: e.target.value})}} placeholder="Password" value={this.state.password}/>
                <button onClick={this.login}>Login</button>
                <button onClick={this.newUser}>Register</button> */}
                <button onClick={this.newUser}>Submit</button>
            </div>
        )
    }
}

export default SignUp;
//export default connect(null, {gatherUserId: gatherUserId})(Auth);