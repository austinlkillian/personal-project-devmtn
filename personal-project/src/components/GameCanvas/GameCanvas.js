import React from 'react'
import orange from '../../images/orange.png'
import rainbow from '../../images/rainbow.png'
import pink from '../../images/pink.png'
import blue from '../../images/blue.png'

class GameCanvas extends React.Component {
    constructor() {
        super()
        this.state = {
            unicornId: null,
            unicornFile: "",
            unicornStyle: {
                width: 60,
                height: 60,
                position: "absolute",
                top: 300,
                left: 270
            },
            // This is the distance of the top of the unicorn from the bottom of the canvas
            unicornTop: 300,
            //Unicorn's rignt corner from left side of canvas
            unicornRight:330,
            //Unicorn's left corner from left side of canvas
            unicornLeft:270,
            bubbleId: 0,
            score: 0,
            bubbles: [],
            creationTimer: null,
            movementTimer: null,
            leftBtnStyle: {position: "absolute", bottom: 5, left: 260},
            rightBtnStyle: {position: "absolute", bottom: 5, left:300}
        }
    }

    moveLeft = () => {
        this.setState({
            unicornStyle: Object.assign({}, this.state.unicornStyle, {
                left: this.state.unicornStyle.left - 20
            }),
            unicornRight: this.state.unicornRight - 20,
            unicornLeft: this.state.unicornLeft - 20
        })
    }

    moveRight = () => {
        this.setState({
            unicornStyle: Object.assign({}, this.state.unicornStyle, {
                left: this.state.unicornStyle.left + 20
            }),
            unicornRight: this.state.unicornRight + 20,
            unicornLeft: this.state.unicornLeft + 20
        })
    }

    componentDidMount() {
        this.setState({
            unicornFile: this.props.unicornFile,
            unicornId: this.props.unicornId,
            creationTimer: this.creationTimer = setInterval(this.makeBubbles, 2500),
            movementTimer: this.movementTimer = setInterval(this.moveBubbles, 400)
       })
     }

     componentWillUnmount() {
         clearInterval(this.state.creationTimer);
         clearInterval(this.state.movementTimer);
     }


    makeBubbles = () => {
        const column = Math.floor( Math.random() * 500)
        this.setState({
            bubbleId: this.state.bubbleId + 1
        })

        const newBubble = {
            index: this.state.bubbles.length,
            id: this.state.bubbleId,
            //Bottom edge of bubble
            bubbleBottom: -10,
            //Left edge of bubble
            bubbleLeft: column,
            bubbleRight: column + 50,
            styling: {
                position: 'absolute',
                top: -60,
                left: column,
                width: 50,
                height: 50,
                backgroundColor: "green",
                borderRadius: 50
            }
        }

        let newBubbles = this.state.bubbles;
        newBubbles.push(newBubble)
        //Update this.state with new bubbles
        this.setState({
            bubbles: newBubbles
        })
        // let score = this.state.score
    }

    moveBubbles = () => {
        let alteredBubbles = this.state.bubbles.map( bubble => {
            let newBubble = Object.assign({}, bubble);
            let updates = {
                top: newBubble.styling.top + 10
            }
            let newObj = Object.assign({}, newBubble.styling, updates);
            // if(newObj.top === 440) {
            //     if(this.state.unicornPos === bubble.left) {
            //         score += 1000
            //         bubble.top = 'kill me'
            //     }
            // }
            newBubble.styling = newObj;
            newBubble.bubbleBottom = newBubble.bubbleBottom + 10;

            return newBubble
        })//.filter( bubble => bubble.top != 'kill me' )

        this.setState({
            bubbles: alteredBubbles
        })
    }

    render(){
        let {unicornTop, unicornLeft, unicornRight} = this.state;
        let bubbleArr = this.state.bubbles.map( (bub, index) => {
            //Is bubble at unicorn collision height?
            if(unicornTop==bub.bubbleBottom){
                if(){
                    
                }
                //console.log("Pop!")
            }

            return (
                <div key={index} style={bub.styling} className='bubble'>

                </div>
            )
        })

        let canvasStyle = {
            position: "relative",
            width: 600,
            height: 400,
            backgroundColor: "blue",
            overflow: 'hidden'
        }

        let chosenImgVar;
        switch(this.props.unicornFile){
            case ("orange"):
                chosenImgVar = orange;
                break;
            case ("blue"):
                chosenImgVar = blue;
                break;
            case ("pink"):
                chosenImgVar = pink;
                break;
            case ("rainbow"):
                chosenImgVar = rainbow;
                break;
            default:
                chosenImgVar = rainbow;
        }

        return(
            <div className='container' style={canvasStyle}>
                { bubbleArr }
                <img id="unicornImage" src={chosenImgVar} alt="" style={this.state.unicornStyle}/>
                <button onClick={this.moveLeft} style={this.state.leftBtnStyle}>Left</button>
                <button onClick={this.moveRight} style={this.state.rightBtnStyle}>Right</button>
            </div>
        )
    }
}

export default GameCanvas;