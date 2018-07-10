import React, {Component} from 'react';

class ListUnicorn extends Component{

    startGame = () => {
        this.props.history.push('/play_game');
    }
    render(){
        console.log('listunicord props:', this.props)
        return (
            <div>
                <h1>List Unicorn</h1>
                <button onClick={this.startGame}>Play!</button>
            </div>
        )
    }
}

export default ListUnicorn;