import React from 'react';
import {Link} from 'react-router-dom'
//import {connect} from 'react-redux'

function Nav(props) {

    // console.log(props)
    // let {username, profile_picture} = props;
    // console.log('navbar ', props)
    return (
        <nav>
            <h1>Navbar</h1>
            {/* <img src={profile_picture} alt="Profile Picture"/>
            <h2>{username}</h2>
            <Link to="/dashboard">Home</Link>
            <Link to="/">Logout</Link>
            <Link to="/new">New Post</Link> */}
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