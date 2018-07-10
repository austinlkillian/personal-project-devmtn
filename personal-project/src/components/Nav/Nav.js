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
        return (
            <nav>
                <Link to="/">Home</Link>
                {/* Logout link also needs to logout user, not just navigate */}
                <button onClick={this.logout}>Logout</button>
                <Link to="/restart_game">Restart Game</Link>
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