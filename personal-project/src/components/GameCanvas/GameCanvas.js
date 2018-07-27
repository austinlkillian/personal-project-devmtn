import React from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {levelUpStore} from '../../ducks/reducer'
import {scoreUp} from '../../ducks/reducer'
import {scoreDown} from '../../ducks/reducer';
import {orangeUnicorn} from '../../svg_images'
import {pinkUnicorn} from '../../svg_images'
import {rainbowUnicorn} from '../../svg_images'
import {raspberryUnicorn} from '../../svg_images'


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
                // width: 60,
                // height: 60,
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
            //These values are used to set the size of the unicorn SVG
            unicornWidth: 0,
            unicornHeight: 0,
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
            // makeBubbleSpeed: 250,
            // moveBubbleSpeed: 100,
            makeBubbleSpeed: 1100,
            moveBubbleSpeed: 75,
            //This value gets updated using window.innerWidth on componentDidMount
            gameWidth: 0,
            gameHeight: 0,
            //Increases to these increase speed of bubble creation and movement
            makeSpeedUp: 0,
            moveSpeedUp: 0,
            popLeft: 0,
            popBottom: 0,
            popBubble: false,
            poppedBubbles: []
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
            if(this.state.unicornTop >= 10){
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
        let currentUnicornWidth;
        let currentUnicornHeight;
        if(window.innerWidth > 500){
            currentUnicornWidth = 105;
            currentUnicornHeight = 120;
        } else {
            currentUnicornWidth = 77;
            currentUnicornHeight = 88;
        }
        if(window.innerWidth > 700){
            currentScreenWidth  = window.innerWidth * 0.47;
        } else if (window.innerWidth < 700 && window.innerWidth > 450){
            currentScreenWidth = window.innerWidth * 0.70
        } else {
            currentScreenWidth = window.innerWidth;
        }
        if(window.innerHeight > 600){
            currentScreenHeight = window.innerHeight * 0.7;
        } else {
            currentScreenHeight = window.innerHeight;
        }
        this.setState({
            unicornWidth: currentUnicornWidth,
            unicornHeight: currentUnicornHeight, 
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
                width: currentUnicornWidth,
                height: currentUnicornHeight,
                position: "absolute",
                //Top value was originally 280, so half of 600, which was the original height of the game canvas
                //left value was originally 270, half of the width of the original game canvas
                top: currentScreenHeight-150,
                //The left value is the current screen width divided in half, minus half the unicorn's width
                left: (currentScreenWidth/2) - (currentUnicornWidth / 2 )
            },
            // This is the distance of the top of the unicorn from the top of the canvas
            unicornTop: currentScreenHeight-150,
            //Distance of the bottom of the unidorn from the top of the canvas
            unicornBottom: (currentScreenHeight-150) + currentUnicornHeight,
            //Unicorn's rignt corner from left side of canvas
            unicornRight: ((currentScreenWidth/2) -(currentUnicornWidth / 2)) + (currentUnicornWidth - 15),
            //Unicorn's left corner from left side of canvas
            unicornLeft: ((currentScreenWidth/2) - (currentUnicornWidth / 2)) +10,
            //Start making bubbles and moving bubbles
            creationTimer: this.creationTimer = setInterval(this.makeBubbles, this.state.makeBubbleSpeed),
            movementTimer: this.movementTimer = setInterval(this.moveBubbles, this.state.moveBubbleSpeed)
       })
     }

     //Reset unicorn position, used when user levels up
    resetUnicorn = (makeSpeed, moveSpeed) => {
        let currentScreenWidth = this.state.gameWidth;
        let currentScreenHeight = this.state.gameHeight;
        let currentUnicornWidth;
        let currentUnicornHeight;
        if(window.innerWidth > 500){
            currentUnicornWidth = 105;
            currentUnicornHeight = 120;
        } else {
            currentUnicornWidth = 77;
            currentUnicornHeight = 88;
        }
        this.setState({
            unicornWidth: currentUnicornWidth,
            unicornHeight: currentUnicornHeight, 
            makeSpeedUp:makeSpeed,
            moveSpeedUp: moveSpeed,
            unicornStyle: {
                width: currentUnicornWidth,
                height: currentUnicornHeight,
                position: "absolute",
                //Top value was originally 280, so half of 600, which was the original height of the game canvas
                //left value was originally 270, half of the width of the original game canvas
                top: currentScreenHeight-150,
                //The left value is the current screen width divided in half, minus half the unicorn's width
                left: (currentScreenWidth/2) - (currentUnicornWidth / 2 )
            },
            // This is the distance of the top of the unicorn from the top of the canvas
            unicornTop: currentScreenHeight-150,
            //Distance of the bottom of the unidorn from the top of the canvas
            unicornBottom: (currentScreenHeight-150) + currentUnicornHeight,
            //Unicorn's rignt corner from left side of canvas
            unicornRight: ((currentScreenWidth/2) -(currentUnicornWidth / 2)) + (currentUnicornWidth - 15),
            //Unicorn's left corner from left side of canvas
            unicornLeft: ((currentScreenWidth/2) - (currentUnicornWidth / 2)) +10,
            playingGame: false,
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
        if(window.innerWidth > 500){
            bubbleSize = 85;
        } else {
            bubbleSize = 60;
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
                left: column
                // width: bubbleSize,
                // height: bubbleSize,
                // backgroundColor: "aqua",
                // borderRadius: 50
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
            makeBubbleSpeed: 1200,
            moveBubbleSpeed: 70,
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
                     let bubbleCoordinates = {
                         left: bubble.bubbleLeft,
                         bottom: bubble.bubbleBottom
                     }
                     let newPoppedArray = this.state.poppedBubbles.map(val => val);
                     newPoppedArray.push(bubbleCoordinates);
                     this.setState({
                        popLeft: bubble.bubbleLeft,
                        popBottom: bubble.bubbleBottom,
                        popBubble: true,
                        poppedBubbles: newPoppedArray
                     })
                     bubble.popped = true;
                     //Conditional logic to level up and win game
                     //Pull the score from Redux store (access to this data is set up in the mapStateToProps function)
                     let scoreUp;
                     switch(this.props.level){
                        case 1:
                        //scoreUp = 2;
                            scoreUp = 5;
                            break;
                        case 2:
                            scoreUp = 5;
                            break;
                        case 3:
                            scoreUp = 3;
                            break;
                        case 4:
                            scoreUp = 5;
                            break;
                        case 5:
                            scoreUp = 2;
                            break;
                        case 6:
                            scoreUp = 5;
                            break;
                        case 7:
                            scoreUp = 5;
                            break;
                        case 8:
                            scoreUp = 5;
                            break;
                        case 9:
                            scoreUp = 5;
                            break;
                        case 10:
                            scoreUp = 5;
                            break;
                        default:
                            scoreUp = 5;
                     }
                     let myScore = this.props.score+scoreUp;
                     //Depending on the score, level up OR just update the score
                     if((myScore > 99 && myScore < 200) && this.props.level === 1){
                            let makeChange;
                            let moveChange;
                            if(window.innerWidth < 700){
                                makeChange = 150;
                                moveChange = 25;
                            } else {
                                makeChange = 100;
                                moveChange = 15;
                            }
                            this.showLevelUp();
                            //reset unicorn position
                            //First number is "make creation speed increase" for bubbles. Second number is "make movement  speed increase"
                            this.levelUp(makeChange, moveChange);
                            //increase Redux store's score value
                            this.props.scoreUp(myScore);
                            //update Redux store level's value
                            this.props.levelUpStore(this.props.level + 1);
                     } else if ((myScore > 199 && myScore < 300) && this.props.level === 2) {
                            let makeChange;
                            let moveChange;
                            if(window.innerWidth < 700){
                                makeChange = 710;
                                moveChange = -10;
                            } else {
                                makeChange = 590;
                                moveChange = -10;
                            }
                            this.showLevelUp();
                            this.levelUp(makeChange, moveChange);
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                     } else if ((myScore > 299 && myScore < 400) && this.props.level === 3){
                            let makeChange;
                            let moveChange;
                            if(window.innerWidth < 700){
                                makeChange = -400;
                                moveChange = 30;
                            } else {
                                makeChange = -600;
                                moveChange = 38;
                            }
                            this.showLevelUp();
                            this.levelUp(makeChange, moveChange);
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                     } else if ((myScore > 399 && myScore < 500) && this.props.level === 4) {
                            let makeChange;
                            let moveChange;
                            if(window.innerWidth < 700){
                                makeChange = 395;
                                moveChange = 105;
                            } else {
                                makeChange = 805;
                                moveChange = -70;
                            }
                            this.showLevelUp();
                            this.levelUp(makeChange, moveChange);
                            this.props.scoreUp(myScore);
                            this.props.levelUpStore(this.props.level + 1)
                    //  } else if ((myScore > 499 && myScore < 600) && this.props.level === 5) {
                    //     this.showLevelUp();
                    //         this.levelUp();
                    //         this.props.scoreUp(myScore);
                    //         this.props.levelUpStore(this.props.level + 1)
                    //  } else if ((myScore > 599 && myScore < 700) && this.props.level === 6) {
                    //     this.showLevelUp();
                    //         this.levelUp();
                    //         this.props.scoreUp(myScore);
                    //         this.props.levelUpStore(this.props.level + 1)
                    //  } else if ((myScore > 699 && myScore < 800) && this.props.level === 7) {
                    //     this.showLevelUp();
                    //         this.levelUp();
                    //         this.props.scoreUp(myScore);
                    //         this.props.levelUpStore(this.props.level + 1)
                    //  } else if ((myScore > 799 && myScore < 900) && this.props.level === 8) {
                    //     this.showLevelUp();
                    //         this.levelUp();
                    //         this.props.scoreUp(myScore);
                    //         this.props.levelUpStore(this.props.level + 1)
                    // } else if ((myScore > 899 && myScore < 1000) && this.props.level === 9) {
                    //     this.showLevelUp();
                    //         this.levelUp();
                    //         this.props.scoreUp(myScore);
                    //         this.props.levelUpStore(this.props.level + 1)
                    } else if(myScore > 499) {
                        this.showWin();
                            this.levelUp();
                            this.props.scoreUp(myScore);
                    } else {
                        this.props.scoreUp(myScore);
                    }
                    // switch(myScore){
                    //     case 15:
                    //         this.showLevelUp();
                    //         //reset unicorn position
                    //         //First number is "make creation speed increase" for bubbles. Second number is "make movement  speed increase"
                    //         this.levelUp(900, 75);
                    //         //increase Redux store's score value
                    //         this.props.scoreUp(myScore);
                    //         //update Redux store level's value
                    //         this.props.levelUpStore(this.props.level + 1);
                    //         break;
                    //     case 25:
                    //         this.showLevelUp();
                    //         //this.levelUp(myScore)
                    //         this.levelUp(200, 10);
                    //         this.props.scoreUp(myScore);
                    //         this.props.levelUpStore(this.props.level + 1)
                    //         break;
                        // case 40:
                        //     this.showLevelUp();
                        //     //this.levelUp(myScore)
                        //     this.levelUp(600, 20);
                        //     this.props.scoreUp(myScore);
                        //     this.props.levelUpStore(this.props.level + 1)
                        //     break;
                        // case 50:
                        //     this.showLevelUp();
                        //     //this.levelUp(myScore)
                        //     this.levelUp();
                        //     this.props.scoreUp(myScore);
                        //     this.props.levelUpStore(this.props.level + 1)
                        //     break;
                        // case 60:
                        //     this.showLevelUp();
                        //     //this.levelUp(myScore)
                        //     this.levelUp();
                        //     this.props.scoreUp(myScore);
                        //     this.props.levelUpStore(this.props.level + 1)
                        //     break;
                        // case 70:
                        //     this.showLevelUp();
                        //     //this.levelUp(myScore)
                        //     this.levelUp();
                        //     this.props.scoreUp(myScore);
                        //     this.props.levelUpStore(this.props.level + 1)
                        //     break;
                        // case 80:
                        //     this.showLevelUp();
                        //     //this.levelUp(myScore)
                        //     this.levelUp();
                        //     this.props.scoreUp(myScore);
                        //     this.props.levelUpStore(this.props.level + 1)
                        //     break;
                        // case 90:
                        //     this.showLevelUp();
                        //     //this.levelUp(myScore)
                        //     this.levelUp();
                        //     this.props.scoreUp(myScore);
                        //     this.props.levelUpStore(this.props.level + 1)
                        //     break;
                        // case 100:
                        //     this.showLevelUp();
                        //     //this.levelUp(myScore)
                        //     this.levelUp();
                        //     this.props.scoreUp(myScore);
                        //     this.props.levelUpStore(this.props.level + 1)
                        //     break;
                        // case 110:
                        //     this.showWin();
                        //     this.levelUp();
                        //     this.props.scoreUp(myScore);
                        //     break;
                        // default:
                        //If none of the levels are being "won" on this score, JUST increase the score
                            //this.props.scoreUp(myScore);
                    //}
                }
            }
            //Is bubble off the screen? If so, set bubble to "popped"
            if(bubble.bubbleBottom > this.state.gameHeight-20){
                this.setState({
                    popLeft: bubble.bubbleLeft,
                    popBottom: bubble.bubbleBottom
                 })
                bubble.popped = true;
                //If bubble pops at bottom, player loses points
                //this.props.level > 3
                if(true){
                    let lowerScore = this.props.score-3;
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
        let currentUnicornWidth;
        let currentUnicornHeight;
        if(window.innerWidth > 500){
            currentUnicornWidth = 105;
            currentUnicornHeight = 120;
        } else {
            currentUnicornWidth = 77;
            currentUnicornHeight = 88;
        }
        if(window.innerWidth > 700){
            currentScreenWidth  = window.innerWidth * 0.47;
        } else if (window.innerWidth < 700 && window.innerWidth > 450){
            currentScreenWidth = window.innerWidth * 0.70
        } else {
            currentScreenWidth = window.innerWidth;
        }
        if(window.innerHeight > 600){
            currentScreenHeight = window.innerHeight * 0.7;
        } else {
            currentScreenHeight = window.innerHeight;
        }
        
        this.setState({
            unicornWidth: currentUnicornWidth,
            unicornHeight: currentUnicornHeight, 
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
                width: currentUnicornWidth,
                height: currentUnicornHeight,
                position: "absolute",
                //Top value was originally 280, so half of 600, which was the original height of the game canvas
                //left value was originally 270, half of the width of the original game canvas
                top: currentScreenHeight-150,
                //The left value is the current screen width divided in half, minus half the unicorn's width
                left: (currentScreenWidth/2) - (currentUnicornWidth / 2 )
            },
            // This is the distance of the top of the unicorn from the top of the canvas
            unicornTop: currentScreenHeight-150,
            //Distance of the bottom of the unidorn from the top of the canvas
            unicornBottom: (currentScreenHeight-150) + currentUnicornHeight,
            //Unicorn's rignt corner from left side of canvas
            unicornRight: ((currentScreenWidth/2) -(currentUnicornWidth / 2)) + (currentUnicornWidth - 15),
            //Unicorn's left corner from left side of canvas
            unicornLeft: ((currentScreenWidth/2) - (currentUnicornWidth / 2)) +10,
            //Start making bubbles and moving bubbles
            creationTimer: this.creationTimer = setInterval(this.makeBubbles, this.state.makeBubbleSpeed),
            movementTimer: this.movementTimer = setInterval(this.moveBubbles, this.state.moveBubbleSpeed),
            gameOver: false,
            showWinPopup: false
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

    // // This is the distance of the top of the unicorn from the top of the canvas
    // unicornTop: 280,
    // //Distance of the bottom of the unidorn from the top of the canvas
    // unicornBottom: 340,
    // //Unicorn's rignt corner from left side of canvas
    // unicornRight:330,
    // //Unicorn's left corner from left side of canvas
    // unicornLeft:270,
    // //These values are

    //.container is ALWAYS 145 px from the top of the screen
    //it's also always centered horizontally, so the horizontal middle of the game is also always the middle of the screen
    handleTouchStart = (e) => {
        console.log(e.touches[0].clientX);
        console.log("Y up-down coordinate:" + e.touches[0].clientY);
        //x handles the left-right width
        //starts low on left, gets higher to the right
        let x = e.touches[0].clientX;
        //y handles the up-down height
        //lower at top, higher at bottom
        let y = e.touches[0].clientY;
        //
        let currentScreenWidth = window.innerWidth;

        let gameHeight = this.state.gameHeight;
        let moveLeft;
        let moveRight;
        let moveUp;
        let moveDown;

        let unicornTopCoordinates = this.state.unicornTop + 70;
        let unicornBottomCoordinates = this.state.unicornTop + 70 + this.state.unicornHeight;
        let unicornLeftCoordinates = ((window.innerWidth - this.state.gameWidth)/2) + this.state.unicornLeft;
        let unicornRightCoordinates = ((window.innerWidth - this.state.gameWidth)/2) + this.state.unicornLeft + this.state.unicornWidth;

        console.log(x, y)

        if(x > unicornRightCoordinates){
            moveRight = true;
        }   else if(x < unicornLeftCoordinates){
            moveLeft = true;
        }

        if(y > unicornBottomCoordinates){
            moveDown = true;
        } else if (y < unicornTopCoordinates) {
            moveUp = true;
        }
        this.twoMovesAtOnce(moveLeft, moveRight, moveUp, moveDown, x, y, unicornTopCoordinates, unicornBottomCoordinates, unicornLeftCoordinates, unicornRightCoordinates);
        // if(moveLeft){
        //     console.log("Move left")
        //     this.moveLeft();
        // }
        // if(moveRight){
        //     console.log("Move right")
        //     this.moveRight();
        // }
        // if(moveUp){
        //     console.log("Move up")
        //     this.moveUp();
        // }
        // if(moveDown){
        //     console.log("Move down")
        //     this.moveDown();
        // }
    }

    twoMovesAtOnce = async(moveLeft, moveRight, moveUp, moveDown, x, y, unicornTopCoordinates, unicornBottomCoordinates, unicornLeftCoordinates, unicornRightCoordinates) => {
        console.log("Unicorn top coordinates:" + unicornTopCoordinates)
        if(moveLeft && (y < unicornBottomCoordinates && y > unicornTopCoordinates)){
            this.moveLeft();
        } else if (moveRight && (y < unicornBottomCoordinates && y > unicornTopCoordinates)) {
            this.moveRight()
        } else if (moveUp && (x > unicornLeftCoordinates && x < unicornRightCoordinates)) {
            this.moveUp();
        } else if (moveDown && (x > unicornLeftCoordinates && x < unicornRightCoordinates)) {
            this.moveDown();
        } else {
            if(moveLeft){
                console.log("Move left")
                await this.moveLeft();
            }
            if(moveRight){
                console.log("Move right")
                await this.moveRight();
            }
            if(moveUp){
                console.log("Move up")
                this.moveUp();
            }
            if(moveDown){
                console.log("Move down")
                this.moveDown();
            }
        }
    }

    levelUp = async(makeSpeed, moveSpeed) => {
        await this.resetTimers();
        this.resetUnicorn(makeSpeed, moveSpeed);
    }

    handleScreenClick = (e) => {
        console.log(e)
    }

    bubblePop = () => {
        console.log( 'pop!' )
        return <div 
        
        style={{
            position: "absolute", 
            left: this.state.popLeft-30, 
            top: this.state.popBottom-40
        }}
        className="bubble-pop"
    >
        <div className="pop1"></div>
        <div className="pop2"></div>
        <div className="pop3"></div>
        <div className="pop4"></div>
        <div className="pop5"></div>
        <div className="pop6"></div>
    </div>
    }

    render(){
        let poppedArray = this.state.poppedBubbles.map((val, index) => {
            return <div
            key={index}
            style={{
                position: "absolute",
                left: val.left-30,
                top: val.bottom-40
            }}
            className="bubble-pop"
        >
            <div className="pop1"></div>
            <div className="pop2"></div>
            <div className="pop3"></div>
            <div className="pop4"></div>
            <div className="pop5"></div>
            <div className="pop6"></div>
        </div>
        })
        // let pop;
        // if(this.state.popBubble){
        //     pop = this.bubblePop();
        //     // pop = <div style={{height:"20px",width:"20px",position: "absolute", left: this.state.popLeft, top: this.state.popBottom, background:"red"}}/>
        //     // pop = <div 
        //     //     style={{
        //     //         position: "absolute", 
        //     //         left: this.state.popLeft, 
        //     //         top: this.state.popBottom
        //     //     }}
        //     //     className="bubble-pop"
        //     // >
        //     //     <div className="pop1"></div>
        //     //     <div className="pop2"></div>
        //     //     <div className="pop3"></div>
        //     //     <div className="pop4"></div>
        //     //     <div className="pop5"></div>
        //     //     <div className="pop6"></div>
        //     // </div>
        // }
         
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
                {playAgain}
            </div>
        }
        //Creating bubble elements to display
        let showBubbles;
        showBubbles = this.state.bubbles.map((bubble, index) => {
            //Select correct bubble SVG for screen size
            let myBubble;
            if(window.innerWidth < 500){
                myBubble = <svg key={index} style={bubble.styling} width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clipPath='url(#clip0)'>
                    <g filter='url(#filter0_dii)' transform='translate(1 1)'>
                        <circle cx='29.5' cy='29.5' r='29.5' fill='#FADCDC' fillOpacity='0.6'
                        />
                        <circle cx='29.5' cy='29.5' r='27.5' stroke='#F3EAF4' strokeWidth='4'
                        />
                        <circle cx='29.5' cy='29.5' r='27.5' stroke='url(#paint0_linear)' strokeWidth='4'
                        />
                    </g>
                    <path d='M29.121 9.78364C29.121 15.187 22.6021 19.5673 14.5605 19.5673C6.51897 19.5673 1.68202e-06 15.187 1.68202e-06 9.78364C1.68202e-06 4.38029 6.51897 -1.06121e-06 14.5605 -1.06121e-06C22.6021 -1.06121e-06 29.121 4.38029 29.121 9.78364Z'
                    transform='rotate(-30.694 80.146 -18.406)' fill='#fff' fillOpacity='0.05'
                    filter='url(#filter1_di)' />
                    <ellipse cx='5.527' cy='3.517' rx='5.527' ry='3.517' transform='rotate(-43.696 26.944 -6.402)'
                    fill='#fff' />
                    <circle cx='1.651' cy='1.651' r='1.651' transform='translate(13.92 23.538)'
                    fill='#fff' />
                </g>
                <defs>
                    <filter id='filter0_dii' x='-44' y='-49' width='108' height='117' filterUnits='userSpaceOnUse'
                    colorInterpolationFilters='sRGB'>
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        />
                        <feOffset dy='4' />
                        <feGaussianBlur stdDeviation='2' />
                        <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0' />
                        <feBlend in2='BackgroundImageFix' result='effect1_dropShadow' />
                        <feBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        result='hardAlpha' />
                        <feOffset dx='-45' dy='-75' />
                        <feGaussianBlur stdDeviation='25' />
                        <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
                        <feColorMatrix values='0 0 0 0 0.619608 0 0 0 0 0.0980392 0 0 0 0 0.27451 0 0 0 0.25 0'
                        />
                        <feBlend in2='shape' result='effect2_innerShadow' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        result='hardAlpha' />
                        <feOffset dy='4' />
                        <feGaussianBlur stdDeviation='2' />
                        <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
                        <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
                        <feBlend in2='effect2_innerShadow' result='effect3_innerShadow' />
                    </filter>
                    <filter id='filter1_di' x='-75.345' y='-71.913' width='226.967' height='222.452'
                    filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation='50' />
                        <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0' />
                        <feBlend mode='darken' in2='BackgroundImageFix' result='effect1_dropShadow'
                        />
                        <feBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        result='hardAlpha' />
                        <feOffset dx='200' />
                        <feGaussianBlur stdDeviation='10' />
                        <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
                        <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0' />
                        <feBlend in2='shape' result='effect2_innerShadow' />
                    </filter>
                    <linearGradient id='paint0_linear' x2='1' gradientUnits='userSpaceOnUse'
                    gradientTransform='matrix(0 59 -59 0 59 0)'>
                        <stop stopColor='#fff' />
                        <stop offset='1' stopColor='#fff' stopOpacity='0' />
                    </linearGradient>
                    <clipPath id='clip0'>
                        <rect width='60' height='60' fill='#fff' />
                    </clipPath>
                </defs>
            </svg>
            } else {
                myBubble = <svg key={index} style={bubble.styling} width='85' height='85' viewBox='0 0 85 85' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clipPath='url(#clip0)'>
                    <g filter='url(#filter0_dii)' transform='translate(2 2)'>
                        <circle cx='40' cy='40' r='40' fill='#FADCDC' fillOpacity='0.6' />
                        <circle cx='40' cy='40' r='38' stroke='#F3EAF4' strokeWidth='4' />
                        <circle cx='40' cy='40' r='38' stroke='url(#paint0_linear)' strokeWidth='4'
                        />
                    </g>
                    <path d='M39.4861 13.266C39.4861 20.5925 30.6469 26.5319 19.7431 26.5319C8.83928 26.5319 2.2807e-06 20.5925 2.2807e-06 13.266C2.2807e-06 5.93937 8.83928 -1.43893e-06 19.7431 -1.43893e-06C30.6469 -1.43893e-06 39.4861 5.93937 39.4861 13.266Z'
                    transform='rotate(-30.694 110.168 -25.809)' fill='#fff' fillOpacity='0.05'
                    filter='url(#filter1_di)' />
                    <ellipse cx='7.494' cy='4.769' rx='7.494' ry='4.769' transform='rotate(-43.696 37.66 -9.162)'
                    fill='#fff' />
                    <circle cx='2.238' cy='2.238' r='2.238' transform='translate(19.518 32.56)'
                    fill='#fff' />
                </g>
                <defs>
                    <filter id='filter0_dii' x='-43' y='-48' width='129' height='138' filterUnits='userSpaceOnUse'
                    colorInterpolationFilters='sRGB'>
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        />
                        <feOffset dy='4' />
                        <feGaussianBlur stdDeviation='2' />
                        <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0' />
                        <feBlend in2='BackgroundImageFix' result='effect1_dropShadow' />
                        <feBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        result='hardAlpha' />
                        <feOffset dx='-45' dy='-75' />
                        <feGaussianBlur stdDeviation='25' />
                        <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
                        <feColorMatrix values='0 0 0 0 0.619608 0 0 0 0 0.0980392 0 0 0 0 0.27451 0 0 0 0.25 0'
                        />
                        <feBlend in2='shape' result='effect2_innerShadow' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        result='hardAlpha' />
                        <feOffset dy='4' />
                        <feGaussianBlur stdDeviation='2' />
                        <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
                        <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
                        <feBlend in2='effect2_innerShadow' result='effect3_innerShadow' />
                    </filter>
                    <filter id='filter1_di' x='-65.925' y='-61.272' width='236.565' height='230.443'
                    filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation='50' />
                        <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0' />
                        <feBlend mode='darken' in2='BackgroundImageFix' result='effect1_dropShadow'
                        />
                        <feBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
                        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
                        result='hardAlpha' />
                        <feOffset dx='200' />
                        <feGaussianBlur stdDeviation='10' />
                        <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
                        <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0' />
                        <feBlend in2='shape' result='effect2_innerShadow' />
                    </filter>
                    <linearGradient id='paint0_linear' x2='1' gradientUnits='userSpaceOnUse'
                    gradientTransform='matrix(0 80 -80 0 80 0)'>
                        <stop stopColor='#fff' />
                        <stop offset='1' stopColor='#fff' stopOpacity='0' />
                    </linearGradient>
                    <clipPath id='clip0'>
                        <rect width='85' height='85' fill='#fff' />
                    </clipPath>
                </defs>
            </svg>
            }
            return (
                myBubble
                //<div key={index} style={bubble.styling} className='bubble'></div>
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
        let currentUnicornWidth = this.state.unicornWidth;
        let currentUnicornHeight = this.state.unicornHeight;
        // if(window.innerWidth > 500){
        //     currentUnicornWidth = 105;
        //     currentUnicornHeight = 120;
        // } else {
        //     currentUnicornWidth = 77;
        //     currentUnicornHeight = 88;
        // }
        switch(this.props.unicornFile){
            case ("orange"):
                chosenImgVar = orangeUnicorn(this.state.unicornStyle, currentUnicornWidth, currentUnicornHeight);
                break;
            case ("blue"):
                chosenImgVar = raspberryUnicorn(this.state.unicornStyle, currentUnicornWidth, currentUnicornHeight);
                break;
            case ("pink"):
                chosenImgVar = pinkUnicorn(this.state.unicornStyle, currentUnicornWidth, currentUnicornHeight);
                break;
            case ("rainbow"):
                chosenImgVar = rainbowUnicorn(this.state.unicornStyle, currentUnicornWidth, currentUnicornHeight);
                break;
            default:
                chosenImgVar = rainbowUnicorn(this.state.unicornStyle, currentUnicornWidth, currentUnicornHeight);
        }

        return(
            <div 
                className='container' 
                style={canvasStyle} 
                //This makes it so you can use the buttons 
                autoFocus={true}
                onTouchStart={this.handleTouchStart}
                onClick={this.handleScreenClick}
            >
                <h2>Level: {this.props.level} Score {this.props.score}</h2>
                { showBubbles }
                {/* <img id="unicornImage" src={chosenImgVar} alt="" style={this.state.unicornStyle}/> */}
                {chosenImgVar}
                {poppedArray}
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