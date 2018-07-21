import React from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {levelUpStore} from '../../ducks/reducer'
import {scoreUp} from '../../ducks/reducer'
import {scoreDown} from '../../ducks/reducer';
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
            gameOver: false,
            showLevelPopup: false,
            showWinPopup: false,
            unicornId: null,
            unicornFile: "",
            unicornStyle: {
                width: 60,
                height: 60,
                position: "absolute",
                //Top value was originally 280, so half of 600, which was the original height of the game canvas
                //left value was originally 270, half of the width of the original game canvas
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
            //Creates bubbles using setInterval
            creationTimer: null,
            //Moves bubbles using setInterval
            movementTimer: null,
            // leftBtnStyle: {position: "absolute", bottom: 5, left: 260},
            // rightBtnStyle: {position: "absolute", bottom: 5, left:300},
            // upBtnStyle: {position: "absolute", bottom: 25, left:260},
            // downBtnStyle: {position: "absolute", bottom: 25, left:300},
            //Set the speed for the setInterval functions that create and move bubbles
            makeBubbleSpeed: 3100,
            moveBubbleSpeed: 120,
            //This value gets updated using window.innerWidth on componentDidMount
            gameWidth: 0,
            gameHeight: 0,
            //Increases to these increase speed of bubble creation and movement
            makeSpeedUp: 0,
            moveSpeedUp: 0
        }
    }

    //Move functions for moving the unicorn around the screen
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
            //this.state.screenWidth * 0.7 used to be 600
            if(this.state.unicornRight <= this.state.gameWidth){
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
            if(this.state.unicornTop <= this.state.gameHeight - 100){
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
        let currentScreenWidth;
        let currentScreenHeight;
        if(window.innerWidth > 700){
            currentScreenWidth  = window.innerWidth * 0.55;
        } else {
            currentScreenWidth = 300;
        }
        if(window.innerHeight > 600){
            currentScreenHeight = window.innerHeight * 0.7;
        } else {
            currentScreenHeight = 400;
        }
        this.setState({
            currentUser: this.props.currentUser,
            //Set current screen width
            gameWidth: currentScreenWidth,
            //Set current game height
            gameHeight: currentScreenHeight,
            //Import unicorn file name and id
            unicornFile: this.props.unicornFile,
            unicornId: this.props.unicornId,
            //Set placement of unicorn
            unicornStyle: {
                width: 60,
                height: 60,
                position: "absolute",
                //Top value was originally 280, so half of 600, which was the original height of the game canvas
                //left value was originally 270, half of the width of the original game canvas
                top: currentScreenHeight-150,
                //The left value is the current screen width divided in half, minus half the unicorn's width
                left: (currentScreenWidth/2) -30
            },
            // This is the distance of the top of the unicorn from the top of the canvas
            unicornTop: currentScreenHeight-150,
            //Distance of the bottom of the unidorn from the top of the canvas
            unicornBottom: (currentScreenHeight-150) + 60,
            //Unicorn's rignt corner from left side of canvas
            unicornRight: ((currentScreenWidth/2) -30) + 60,
            //Unicorn's left corner from left side of canvas
            unicornLeft: (currentScreenWidth/2) -30,
            //Start making bubbles and moving bubbles
            creationTimer: this.creationTimer = setInterval(this.makeBubbles, this.state.makeBubbleSpeed),
            movementTimer: this.movementTimer = setInterval(this.moveBubbles, this.state.moveBubbleSpeed)
       })
     }

     //Reset unicorn position, used when user levels up
    resetUnicorn = (makeSpeed, moveSpeed) => {
        let currentScreenWidth = this.state.gameWidth;
        let currentScreenHeight = this.state.gameHeight;
        this.setState({
            makeSpeedUp:makeSpeed,
            moveSpeedUp: moveSpeed,
            unicornStyle: {
                width: 60,
                height: 60,
                position: "absolute",
                //Top value was originally 280, so half of 600, which was the original height of the game canvas
                //left value was originally 270, half of the width of the original game canvas
                top: currentScreenHeight-150,
                //The left value is the current screen width divided in half, minus half the unicorn's width
                left: (currentScreenWidth/2) -30
            },
            playingGame: false,
            // This is the distance of the top of the unicorn from the top of the canvas
            unicornTop: currentScreenHeight-150,
            //Distance of the bottom of the unidorn from the top of the canvas
            unicornBottom: (currentScreenHeight-150) + 60,
            //Unicorn's rignt corner from left side of canvas
            unicornRight: ((currentScreenWidth/2) -30) + 60,
            //Unicorn's left corner from left side of canvas
            unicornLeft: (currentScreenWidth/2) -30,
            bubbles: [],
            creationTimer: null,
            movementTimer: null,
            gameOver: false
        })
    }

     componentWillUnmount() {
         document.body.onkeydown = null
         //Stop bubbles from being made and moved
         clearInterval(this.state.creationTimer);
         clearInterval(this.state.movementTimer);
         this.restart();
     }

     //Create array of bubbles
    makeBubbles = () => {
        let bubbleSize;
        if(this.state.gameWidth > 600){
            bubbleSize = 60;
        } else {
            bubbleSize = 40;
        }
        const column = Math.floor( Math.random() * (this.state.gameWidth - 100))
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
            bubbleRight: column + bubbleSize,
            styling: {
                position: 'absolute',
                top: -bubbleSize,
                left: column,
                width: bubbleSize,
                height: bubbleSize,
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
    //Reset timers for bubble creation and movement
    resetTimers = () => {
        clearInterval(this.state.creationTimer);
        clearInterval(this.state.movementTimer);
    }
    resetBubbleSpeeds = () => {
        this.setState({
            //Set the speed for the setInterval functions that create and move bubbles
            makeBubbleSpeed: 3100,
            moveBubbleSpeed: 120,
            //Increases to these increase speed of bubble creation and movement
            makeSpeedUp: 0,
            moveSpeedUp: 0
        })
    }
    
    
    //Asynchronous function allows the bubbles to be removed from the page before the page repopulates
    levelUp = async(makeSpeed, moveSpeed) => {
        await this.resetTimers();
        this.resetUnicorn(makeSpeed, moveSpeed);
    }

    //Moves bubbles
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
                            //First number is "make creation speed increase" for bubbles. Second number is "make movement  speed increase"
                            this.levelUp(900, 75);
                            //increase Redux store's score value
                            this.props.scoreUp(myScore);
                            //update Redux store level's value
                            this.props.levelUpStore(this.props.level + 1);
                            break;
                        case 25:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.levelUp(200, 10);
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 40:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.levelUp(600, 20);
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 50:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.levelUp();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 60:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.levelUp();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 70:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.levelUp();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 80:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.levelUp();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 90:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.levelUp();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 100:
                            this.showLevelUp();
                            //this.levelUp(myScore)
                            this.levelUp();
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                            break;
                        case 110:
                            this.showWin();
                            this.levelUp();
                            this.props.scoreUp(myScore);
                            break;
                        default:
                        //If none of the levels are being "won" on this score, JUST increase the score
                            this.props.scoreUp(myScore);
                    }
                }
            }
            //Is bubble off the screen? If so, set bubble to "popped"
            if(bubble.bubbleBottom > this.state.gameHeight-100){
                bubble.popped = true;
                //If bubble pops at bottom, player loses points
                //this.props.level > 3
                if(true){
                    let lowerScore = this.props.score-2;
                    //Game over if score goes less than 0
                    if(lowerScore < 0){
                        this.setState({
                            gameOver: true,
                            playingGame: false
                        })
                    }
                    this.props.scoreDown(lowerScore);
                }
            }
            if(!this.state.playingGame){
                bubble.popped =true;
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

    //Moves unicorn on user arrow keystrokes
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
    hideLevelUp = async (makeSpeedUp, moveSpeedUp) => {
        await this.resetTimers();
        //Set new speeds for bubble creation and movement
        let newBubbleMakeTime = this.state.makeBubbleSpeed - makeSpeedUp;
        let newBubbleMoveTime = this.state.moveBubbleSpeed - moveSpeedUp;
        let playing = this.state.playingGame;

        this.setState({
            playingGame: true,
            showLevelPopup: false,
            //Reset the setInterval timers to implement new bubble speeds
            creationTimer: this.creationTimer = setInterval(this.makeBubbles, newBubbleMakeTime),
            movementTimer: this.movementTimer = setInterval(this.moveBubbles, newBubbleMoveTime),
            //Reset bubble speeds on state
            makeBubbleSpeed: newBubbleMakeTime,
            moveBubbleSpeed: newBubbleMoveTime
        })
    }

    //Hide win-game popup
    hideWin = () => {
        this.setState({
            showWinPopup: false
        })
    }

    //Allow continue play on level-up popup by pressing Enter button
    levelPopupEnter = (e) => {
        if(e.key==="Enter"){
            this.hideLevelUp(this.state.makeSpeedUp, this.state.moveSpeedUp)
        }
    }

    playAgainFunc = async() => {
        //Stop bubbles from being made and moved
        await this.resetTimers();
        await this.resetBubbleSpeeds();
        document.body.onkeydown = this.onArrowDown
        let currentScreenWidth;
        let currentScreenHeight;
        if(window.innerWidth > 700){
            currentScreenWidth  = window.innerWidth * 0.55;
        } else {
            currentScreenWidth = 300;
        }
        if(window.innerHeight > 600){
            currentScreenHeight = window.innerHeight * 0.7;
        } else {
            currentScreenHeight = 400;
        }
        this.setState({
            playingGame: true,
            //Set current screen width
            gameWidth: currentScreenWidth,
            //Set current game height
            gameHeight: currentScreenHeight,
            //Import unicorn file name and id
            unicornFile: this.props.unicornFile,
            unicornId: this.props.unicornId,
            //Set placement of unicorn
            unicornStyle: {
                width: 60,
                height: 60,
                position: "absolute",
                //Top value was originally 280, so half of 600, which was the original height of the game canvas
                //left value was originally 270, half of the width of the original game canvas
                top: currentScreenHeight-150,
                //The left value is the current screen width divided in half, minus half the unicorn's width
                left: (currentScreenWidth/2) -30
            },
            // This is the distance of the top of the unicorn from the top of the canvas
            unicornTop: currentScreenHeight-150,
            //Distance of the bottom of the unidorn from the top of the canvas
            unicornBottom: (currentScreenHeight-150) + 60,
            //Unicorn's rignt corner from left side of canvas
            unicornRight: ((currentScreenWidth/2) -30) + 60,
            //Unicorn's left corner from left side of canvas
            unicornLeft: (currentScreenWidth/2) -30,
            //Start making bubbles and moving bubbles
            creationTimer: this.creationTimer = setInterval(this.makeBubbles, this.state.makeBubbleSpeed),
            movementTimer: this.movementTimer = setInterval(this.moveBubbles, this.state.moveBubbleSpeed),
            gameOver: false
            // makeBubbleSpeed: 3100,
            // moveBubbleSpeed: 120,
            // //Increases to these increase speed of bubble creation and movement
            // makeSpeedUp: 0,
            // moveSpeedUp: 0
       })
        
        this.props.levelUpStore(1);
        this.props.scoreUp(0);
        //Reset Unicorn
        // this.resetUnicorn();
    }


    render(){
        //Set the "play again" link for if the user is logged in or not
        let playAgain;
        if(this.props.currentUser.id){
            playAgain = <Link className="button play-again" to="/pick_unicorn">Play Again?</Link>
        } else {
            playAgain = <button className="button play-again" onClick={this.playAgainFunc}>Play Again?</button>
        }
        let gameOverPopup;
        if(this.state.gameOver){
            gameOverPopup = <div 
                className="popup" 
                style={{zIndex: 100}}
                >
                <h1>Game Over!</h1>
                {playAgain}
                {/* <Link className="button play-again" to="/pick_unicorn">Play Again?</Link> */}
            </div>
        }
        let levelPopup;
        let winPopup;
        //Determines whether the "level-up" popup should be visible
        //
        if(this.state.showLevelPopup){
            levelPopup = <div 
                className="popup" 
                style={{zIndex: 100}}
                onKeyDown={e => this.levelPopupEnter(e)
                }>
                <h1>You beat level {this.props.level-1}!</h1>
                <button className="button" onClick={() => this.hideLevelUp(this.state.makeSpeedUp, this.state.moveSpeedUp) } autoFocus={true}>Keep Playing</button>
            </div>
        }
        //Determines whether the "won-game" popup should be visible
        //
        if(this.state.showWinPopup){
            winPopup = <div className="popup">
                <h1>Congratulations!</h1>
                <h2>You won the game!</h2>
                <Link className="button play-again" to="/pick_unicorn">Play Again?</Link>
            </div>
        }
        //Creating bubble elements to display
        let showBubbles;
        showBubbles = this.state.bubbles.map((bubble, index) => {
            return (
                <div key={index} style={bubble.styling} className='bubble'></div>
                )
        })

        let canvasStyle = {
            position: "relative",
            width: this.state.gameWidth,
            height: this.state.gameHeight,
            backgroundColor: "white",
            overflow: 'hidden'
        }

        //Selects which image should be show, based on the unicorn file_name value that was passed to props
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
                //This makes it so you can use the buttons 
                autoFocus={true}
            >
                <h2>Level: {this.props.level} Score {this.props.score}</h2>
                { showBubbles }
                <img id="unicornImage" src={chosenImgVar} alt="" style={this.state.unicornStyle}/>
                {/* <button 
                    onClick={this.moveUp} 
                    style={this.state.upBtnStyle}
                >Up</button>
                <button onClick={this.moveDown} style={this.state.downBtnStyle}>Down</button>
                <button onClick={this.moveLeft} style={this.state.leftBtnStyle}>Left</button>
                <button onClick={this.moveRight} style={this.state.rightBtnStyle}>Right</button> */}
                <div className="popup-container">
                    {levelPopup}
                    {winPopup}
                    {gameOverPopup}
                </div>
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

export default connect(mapStateToProps, {levelUpStore, scoreUp, scoreDown})(GameCanvas);