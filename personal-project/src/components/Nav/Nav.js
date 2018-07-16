import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'
//import {connect} from 'react-redux'

class Nav extends Component {
    logout = () => {
        axios.get('/logout')
            .then(
                this.props.history.push("/")
            )
            .catch()
    }

    // console.log(props)
    // let {username, profile_picture} = props;
    // console.log('navbar ', props)
    render(){
        let logout;
        let home;
        let restart;
        let path = this.props.location.pathname
        switch(path){
            case "/sign_up":
                home = <Link to="/">Home</Link>
                break;
            case "/login":
                home = <Link to="/">Home</Link>
                break;
            case "/pick_unicorn":
                home = <Link to="/">Home</Link>
                logout = <button onClick={this.logout}>Logout</button>
                break;
            case "/create_unicorn":
                home = <Link to="/">Home</Link>
                logout = <button onClick={this.logout}>Logout</button>
                break;
        }
        if(path.indexOf("/select") !== -1){
            home = <Link to="/">Home</Link>
            logout = <button onClick={this.logout}>Logout</button>
        }
        if(path.indexOf("/play") !== -1){
            home = <Link to="/">Home</Link>
            if(this.props.currentUnicorn.id){
                logout = <button onClick={this.logout}>Logout</button>
                restart = <Link to="/pick_unicorn">Restart Game</Link>
            }
        }
        return (
            <nav>
                {home}
                {logout}
                {restart}
                {/* <Link to="/">Home</Link> */}
                {/* Logout link also needs to logout user, not just navigate */}
                {/* <button onClick={this.logout}>Logout</button> */}
                {/* <Link to="/restart_game">Restart Game</Link> */}
            </nav>
        )
    }
}

// function mapStateToProps(state){
//     return {
//         username: state.username,
//         profile_picture: state.profile_picture
//     }
// }

export default Nav;
//export default connect(mapStateToProps)(Nav);