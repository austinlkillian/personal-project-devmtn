import React, {Component} from 'react';
import Nav from '../Nav/Nav'

class CreateUnicorn extends Component{
    newUnicorn = () => {
        this.props.history.push('/pick_unicorn');
    }
    render(){
        return (
            <div>
                <Nav {...this.props} />
                <h1>Create Your Unicorn!</h1>
                <button onClick={this.newUnicorn}>Save</button>
            </div>
        )
    }
}

export default CreateUnicorn;