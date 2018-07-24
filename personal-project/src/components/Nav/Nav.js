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
                home = <div className="home-link">
                        <Link to="/"><i className="fas fa-home fa-lg"></i></Link>
                        </div>
                break;
            case "/login":
                home = <div className="home-link">
                            <Link to="/"><i className="fas fa-home fa-lg"></i></Link>
                        </div>
                break;
            case "/pick_unicorn":
                home = <div className="home-link">
                        <Link to="/"><i className="fas fa-home fa-lg"></i></Link>
                    </div>
                logout = <div className="logout-button">
                    <button className="nav-logout" onClick={this.logout}>Logout</button>
                </div>
                break;
            case "/create_unicorn":
                home = <div className="home-link">
                        <Link to="/"><i className="fas fa-home fa-lg"></i></Link>
                    </div>
                logout = <div className="logout-button">
                    <button className="nav-logout" onClick={this.logout}>Logout</button>
                </div>
                break;
        }
        if(path.indexOf("/select") !== -1){
            home = <div className="home-link">
                    <Link to="/"><i className="fas fa-home fa-lg"></i></Link>
                </div>
            logout = <div className="logout-button">
                <button className="nav-logout" onClick={this.logout}>Logout</button>
            </div>
        }
        if(path.indexOf("/play") !== -1){
            home = <div className="home-link">
                    <Link to="/"><i className="fas fa-home fa-lg"></i></Link>
                </div>
            if(this.props.currentUnicorn.id){
                logout = <div className="logout-button">
                            <button className="nav-logout" onClick={this.logout}>Logout</button>
                    </div>
                restart = <div className="logout-button">
                            <Link to="/pick_unicorn">Restart</Link>
                        </div>
                
                
            }
        }
        return (
            <nav>
                {home}
                <div className="restart-logout-div">
                    {restart}
                    {logout}
                </div>
            </nav>
        )
    }
}

export default Nav;