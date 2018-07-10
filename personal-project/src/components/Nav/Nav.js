import React from 'react';
import {Link} from 'react-router-dom'
//import {connect} from 'react-redux'

function Nav(props) {
    function logout(){
        // axios to req.session.destroy()
        //Use props.history.push to navigate to the home page
        // .then -> props.history.push('/home');
    }

    // console.log(props)
    // let {username, profile_picture} = props;
    // console.log('navbar ', props)
    return (
        <nav>
            <Link to="/">Home</Link>
            {/* Logout link also needs to logout user, not just navigate */}
            <button onClick={logout}>Logout</button>
            <Link to="/restart_game">Restart Game</Link>
        </nav>
    )
}

// function mapStateToProps(state){
//     return {
//         username: state.username,
//         profile_picture: state.profile_picture
//     }
// }

export default Nav;
//export default connect(mapStateToProps)(Nav);