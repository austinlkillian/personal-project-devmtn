import React from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {levelUpStore} from '../../ducks/reducer'
import {scoreUp} from '../../ducks/reducer'
import orange from '../../images/orange.png'
import rainbow from '../../images/rainbow.png'
import pink from '../../images/pink.png'
import blue from '../../images/blue.png'
import store from '../../ducks/store'

class GameCanvas extends React.Component {
    constructor() {
        super()
        this.state = {
            playingGame: true,
            showLevelPopup: false,
            showWinPopup: false,
            unicornId: null,
            unicornFile: "",
            unicornStyle: {
                width: 60,
                height: 60,
                position: "absolute",
                top: 280,
                left: 270
            },
            // This is the distance of the top of the unicorn from the top of the canvas
            unicornTop: 280,
            //Distance of the bottom of the unidorn from the top of the canvas
            unicornBottom: 340,
            //Unicorn's rignt corner from left side of canvas
            unicornRight:330,
            //Unicorn's left corner from left side of canvas
            unicornLeft:270,
            bubbleId: 0,
            bubbles: [],
            creationTimer: null,
            movementTimer: null,
            leftBtnStyle: {position: "absolute", bottom: 5, left: 260},
            rightBtnStyle: {position: "absolute", bottom: 5, left:300},
            upBtnStyle: {position: "absolute", bottom: 25, left:260},
            downBtnStyle: {position: "absolute", bottom: 25, left:300},
            makeBubbleSpeed: 3500,
            moveBubbleSpeed: 200
        }
    }

    moveLeft = () => {
        if(this.state.playingGame){
            if(this.state.unicornLeft >= 1){
                this.setState({
                    unicornStyle: Object.assign({}, this.state.unicornStyle, {
                        left: this.state.unicornStyle.left - 20
                    }),
                    unicornRight: this.state.unicornRight - 20,
                    unicornLeft: this.state.unicornLeft - 20
                })
            }
        }
    }

    moveRight = () => {
        if(this.state.playingGame){
            if(this.state.unicornRight <= 600){
                this.setState({
                    unicornStyle: Object.assign({}, this.state.unicornStyle, {
                        left: this.state.unicornStyle.left + 20
                    }),
                    unicornRight: this.state.unicornRight + 20,
                    unicornLeft: this.state.unicornLeft + 20
                })
            }
        }
    }

    moveUp = () => {
        if(this.state.playingGame){
            if(this.state.unicornTop >= 20){
                this.setState({
                    unicornStyle: Object.assign({}, this.state.unicornStyle, {
                        top: this.state.unicornStyle.top - 20
                    }),
                    unicornTop: this.state.unicornTop - 20,
                    unicornBottom: this.state.unicornBottom - 20
                })
            }
        }
    }

    moveDown = () => {
        if(this.state.playingGame){
            if(this.state.unicornTop <= 260){
                this.setState({
                    unicornStyle: Object.assign({}, this.state.unicornStyle, {
                        top: this.state.unicornStyle.top + 20
                    }),
                    unicornTop: this.state.unicornTop + 20,
                    unicornBottom: this.state.unicornBottom + 20
                })
            }
        }
    }

    componentDidMount() {
        document.body.onkeydown = this.onArrowDown
        this.setState({
            unicornFile: this.props.unicornFile,
            unicornId: this.props.unicornId,
            creationTimer: this.creationTimer = setInterval(this.makeBubbles, this.state.makeBubbleSpeed),
            movementTimer: this.movementTimer = setInterval(this.moveBubbles, this.state.moveBubbleSpeed)
       })
     }

     componentWillUnmount() {
         document.body.onkeydown = null
         clearInterval(this.state.creationTimer);
         clearInterval(this.state.movementTimer);
         this.restart();
     }


    makeBubbles = () => {
        const column = Math.floor( Math.random() * 500)
        this.setState({
            bubbleId: this.state.bubbleId + 1
        })

        const newBubble = {
            index: this.state.bubbles.length,
            popped: false,
            id: this.state.bubbleId,
            //Bottom edge of bubble
            bubbleBottom: -10,
            //Left edge of bubble
            bubbleLeft: column,
            bubbleRight: column + 50,
            styling: {
                position: 'absolute',
                top: -50,
                left: column,
                width: 50,
                height: 50,
                backgroundColor: "aqua",
                borderRadius: 50
            }
        }

        let newBubbles = this.state.bubbles;
        newBubbles.push(newBubble)
        //Update this.state with new bubbles
        this.setState({
            bubbles: newBubbles
        })
    }
    //Reset unicorn position, used when user levels up
    resetUnicorn = () => {
        clearInterval(this.state.creationTimer);
        clearInterval(this.state.movementTimer);
        this.setState({
            unicornStyle: {
                creationTimer: null,
                movementTimer: null,
                width: 60,
                height: 60,
                position: "absolute",
                top: 280,
                left: 270
            },
            playingGame: false,
            unicornTop: 280,
            //Distance of the bottom of the unidorn from the top of the canvas
            unicornBottom: 340,
            //Unicorn's rignt corner from left side of canvas
            unicornRight:330,
            //Unicorn's left corner from left side of canvas
            unicornLeft:270
        })
    }

    moveBubbles = () => {
        let alteredBubbles = this.state.bubbles.map( bubble => {
            let newBubble = Object.assign({}, bubble);
            let updates = {
                top: newBubble.styling.top + 10
            }
            let newObj = Object.assign({}, newBubble.styling, updates);

            newBubble.styling = newObj;
            newBubble.bubbleBottom = newBubble.bubbleBottom + 10;

            return newBubble
        })
        let {unicornTop, unicornLeft, unicornRight, unicornBottom} = this.state;
        let newArr = alteredBubbles.map( (bubble, index, arr) => {
            //Is bubble at unicorn collision height and within the unicorn's width parameters?
            if(unicornTop===bubble.bubbleBottom || (unicornTop < bubble.bubbleBottom &&bubble.bubbleBottom < (unicornBottom + 40))){
                //Is the bubble within the unicorn's width? If so, bubble is set to popped, and it will get filtered out of the array
                if((bubble.bubbleRight > unicornLeft && !(bubble.bubbleLeft > unicornRight))){
                     console.log("Pop!")
                     //This is set to true so that the bubble will be filtered out of the array
                     bubble.popped = true;
                     //Conditional logic to level up and win game
                     //Pull the score from Redux store (access to this data is set up in the mapStateToProps function)
                     let myScore = this.props.score+5;
                     //Depending on the score, level up OR just update the score
                    switch(myScore){
                        case 15:
                            this.showLevelUp();
                            //reset unicorn position
                            this.resetUnicorn();
                            //increase Redux store's score value
                            this.props.scoreUp(myScore);
                            //update Redux store level's value
                            this.props.levelUpStore(this.props.level + 1);
                            break;
                        case 25:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.resetUnicorn();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 40:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.resetUnicorn();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 50:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.resetUnicorn();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 60:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.resetUnicorn();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 70:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.resetUnicorn();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 80:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.resetUnicorn();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 90:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.resetUnicorn();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 100:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.resetUnicorn();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 110:
                            this.showWin();
                            break;
                        default:
                        //If none of the levels are being "won" on this score, JUST increase the score
                            this.props.scoreUp(myScore);
                    }
                }
            }
            //Is bubble off the screen?
            if(bubble.bubbleBottom > 380){
                bubble.popped = true;
            }
            // console.log(`unicornLeft: ${unicornLeft} unicornRight: ${unicornRight} bubbleLeft: ${bubble.bubbleLeft} bubbleRight: ${bubble.bubbleRight}`)
            return bubble;
        }).filter(bubble => {
            return bubble.popped === false;
        });


        this.setState({
            bubbles: newArr
        })
    }

    onArrowDown = (e) => {
        //ArrowUp, ArrowDown, ArrowRight, ArrowLeft
        switch(e.key){
            case "ArrowUp":
                this.moveUp();
                break;
            case "ArrowDown":
                this.moveDown();
                break;
            case "ArrowRight":
                this.moveRight();
                break;
            case "ArrowLeft":
                this.moveLeft();
                break;
        }
    }

    //Restart button functionality
    restart = () => {
        this.resetUnicorn();
        this.props.scoreUp(0);
        this.props.levelUpStore(1);
    //     this.setState({
    //         creationTimer: this.creationTimer = setInterval(this.makeBubbles, 3400),
    //         movementTimer: this.movementTimer = setInterval(this.moveBubbles,   400)
    //     })
    }

    //Show level-up popup -- set showLevelPopup to true
    showLevelUp = () => {
        this.setState({
            showLevelPopup: true
        })
    }
    //Show win-game popup -- set showWinPopup to true
    showWin = () => {
        this.setState({
            showWinPopup: true
        })
    }
    //Hide level-up popup
    hideLevelUp = () => {
        this.setState({
            playingGame: true,
            showLevelPopup: false,
            creationTimer: this.creationTimer = setInterval(this.makeBubbles, 3400),
            movementTimer: this.movementTimer = setInterval(this.moveBubbles, 400)
        })
    }
    //Hide win-game popup
    hideWin = () => {
        this.setState({
            showWinPopup: false
        })
    }


    render(){
        console.log(store.getState())
        let levelPopup;
        let winPopup;
        if(this.state.showLevelPopup){
            levelPopup = <div className="popup" style={{zIndex: 100}}>
                <h1>You beat level {this.props.level-1}!</h1>
                <button onClick={this.hideLevelUp}>Keep Playing</button>
            </div>
        }
        if(this.state.showWinPopup){
            winPopup = <div className="popup ">
                <h1>Congratulations!</h1>
                <h2>You won the game!</h2>
                <Link to="/pick_unicorn">Play Again?</Link>
            </div>
        }
        //Creating bubbles to display
        let showBubbles;
        showBubbles = this.state.bubbles.map((bubble, index) => {
            return (
                <div key={index} style={bubble.styling} className='bubble'>

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
            <div 
                className='container' 
                style={canvasStyle} 
                // onKeyDown={e => this.onArrowDown(e)}
                //This makes it so you can use the buttons 
                autoFocus={true}
            >
                <h2>Level: {this.props.level} Score: {this.props.score}</h2>
                {/* <button onClick={this.restart}>Restart Game</button> */}
                { showBubbles }
                <img id="unicornImage" src={chosenImgVar} alt="" style={this.state.unicornStyle}/>
                <button 
                    onClick={this.moveUp} 
                    style={this.state.upBtnStyle}
                >Up</button>
                <button onClick={this.moveDown} style={this.state.downBtnStyle}>Down</button>
                <button onClick={this.moveLeft} style={this.state.leftBtnStyle}>Left</button>
                <button onClick={this.moveRight} style={this.state.rightBtnStyle}>Right</button>
                {levelPopup}
                {winPopup}
            </div>
        )
    }
}

//Pulls variables FROM store and makes them available on the props object
//this.props.level will be the current (old) store level value
//this.props.score will be the current (old) store score value
function mapStateToProps(state){
    return {
        level: state.level,
        score: state.score
    }
}

export default connect(mapStateToProps, {levelUpStore, scoreUp})(GameCanvas);