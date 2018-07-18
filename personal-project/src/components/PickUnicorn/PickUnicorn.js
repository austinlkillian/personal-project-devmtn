import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import ListUnicorn from '../ListUnicorn/ListUnicorn';
import Nav from '../Nav/Nav'


class PickUnicorn extends Component{
    constructor(){
        super();
        this.state = {
            currentUser: {},
            unicornList: []
        };
    }

    componentDidMount(){
        //Gets info for current user
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
        //Pulls unicorn list for this specific user
        axios.get('/user_unicorns')
            .then(unicorns => {
                let copyArr = this.state.unicornList.map(unicorn => unicorn);
                copyArr.push(...unicorns.data)
                let newArr = copyArr.reverse();
                this.setState({
                    unicornList: newArr//unicorns.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render(){
        let userUnicorns = this.state.unicornList.map( (unicorn, index) => {
            let {name, file_name, id} = unicorn
            return (
                <ListUnicorn key={index} name={name} file_name={file_name} id={id} {...this.props}/>
            )
        });
        return (
            <div className="choose-unicorn">
                <Nav {...this.props} />
                <div className="choose-unicorn-container">
                    <h1 className="title">Choose Your Unicorn!</h1>
                    <Link to="/create_unicorn" className="button create-unicorn-btn">Create New Unicorn</Link>
                    <hr/>
                    <div className="user-unicorns">
                        {userUnicorns}
                    </div>
                </div>
            </div>
        )
    }
}

export default PickUnicorn;