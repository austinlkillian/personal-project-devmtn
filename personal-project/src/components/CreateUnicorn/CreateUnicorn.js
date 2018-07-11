import React, {Component} from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';

class CreateUnicorn extends Component{
    constructor(){
        super()
        this.state = {
            name: "",
            currentUser: {}
        }
    }

    componentDidMount(){
        axios.get('/current_user')
        .then(res => {
            //This object contains all the data for the current user
            if(res.data[0]){
                this.setState({
                    currentUser: res.data[0]
                })
            }
        })
        .catch(err => {console.log(err)})
    }

    newUnicorn = () => {
        axios.post('/new_unicorn', {})
            .then( response => {
                this.props.history.push('/pick_unicorn')
            })
            .catch(err => {console.log(err)})
    }
    render(){
        console.log(this.state.currentUser)
        return (
            <div>
                <Nav {...this.props} />
                <h1>Create Your Unicorn!</h1>
                <input
                    type="text"
                    placeholder="Name your unicorn!"
                    onChange={(e) => {this.setState({name: e.target.value})}}
                    value={this.state.name}/>
                <button onClick={this.newUnicorn}>Save</button>
            </div>
        )
    }
}

export default CreateUnicorn;