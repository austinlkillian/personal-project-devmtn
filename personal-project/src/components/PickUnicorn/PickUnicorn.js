import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ListUnicorn from '../ListUnicorn/ListUnicorn';
import Nav from '../Nav/Nav'


class PickUnicorn extends Component{
    render(){
        return (
            <div>
                <Nav />
                <h1>Choose Your Unicorn!</h1>
                <ListUnicorn {...this.props}/>
                <Link to="/create_unicorn">Create New Unicorn</Link>
            </div>
        )
    }
}

export default PickUnicorn;