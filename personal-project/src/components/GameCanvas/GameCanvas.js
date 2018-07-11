import React from 'react'

class GameCanvas extends React.Component {
    constructor() {
        super()
        this.state = {
            bubbleId: 0,
            unicornPos:150,
            score: 0,
            bubbles: [
                {
                    id: 1,
                    styling: {
                        position: 'absolute',
                        top: -60,
                        left: 30,
                        width: 50,
                        height: 50,
                        backgroundColor: "green",
                        borderRadius: 50
                    }
                }
            ],
            creationTimer: null,
            movementTimer: null
        }
    }

    componentDidMount() {
        this.setState({
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
            bubbleId: this.state.bubbleId++
        })

        const newBubble = {
            id: this.state.bubbleId,
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

            return newBubble
        })//.filter( bubble => bubble.top != 'kill me' )

        this.setState({
            bubbles: alteredBubbles
        })
    }

    render(){
        let bubbleArr = this.state.bubbles.map( bub => {
            //const { top, position, left} = bub

            return (
                <div style={bub.styling} className='bubble'>

                </div>
            )
        })
        // let bubbleStyle = {
        //     position: 'absolute',
        //     top: 50,
        //     left: "column",
        //     width: 50,
        //     height: 50,
        //     backgroundColor: "green",
        //     borderRadius: 50
        // }
        // let bubble = <div key="2" className="bubble" style={bubbleStyle}></div>
        let canvasStyle = {
            position: "relative",
            width: 600,
            height: 400,
            backgroundColor: "blue",
            overflow: 'hidden'
        }

        return(
            <div className='container' style={canvasStyle}>
            Heya, buddy
                { bubbleArr }
                {/* {bubble} */}
            </div>
        )
    }
}

export default GameCanvas;