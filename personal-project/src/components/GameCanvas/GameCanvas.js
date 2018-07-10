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
            timer: null
        }
    }

    makeBubbles = () => {
        const column = Math.floor( Math.random() * 500)

        const newBubble = {
            id: this.state.bubbleId += 1,
            position: 'absolute',
            top: -60,
            left: column,
            width: 50,
            height: 50,
            backgroundColor: "green",
            borderRadius: 50
        }

        let newBubbles = this.state.bubbles;
        newBubbles.push(newBubble)
        let score = this.state.score
        let alteredBubbles = newBubbles.map( bubble => {
            let updates = {
                top: bubble.top + 10
            }
            let newObj = Object.assign({}, bubble, updates);
            // if(newObj.top === 440) {
            //     if(this.state.unicornPos === bubble.left) {
            //         score += 1000
            //         bubble.top = 'kill me'
            //     }
            // }

            return newObj
        })//.filter( bubble => bubble.top != 'kill me' )

        this.setState({
            bubbles: alteredBubbles
        })
    }

    componentDidMount() {
       this.setState({
            timer: this.timer = setInterval(this.makeBubbles, 1000)
       })
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    render(){
        let bubbleArr = this.state.bubbles.map( bub => {
            //const { top, position, left} = bub

            return (
                <div style={bub} className='bubble'>

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
            backgroundColor: "blue"
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