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
import raspberry from '../../images/raspberry.png'
import {bubbleLarge} from '../../svg_images'
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
            currentScreenWidth  = window.innerWidth * 0.5;
        } else if(window.innerWidth < 700 && window.innerWidth > 500){
            currentScreenWidth = window.innerWidth * 0.80;
        } else {
            currentScreenWidth = window.innerWidth;
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
            currentScreenWidth  = window.innerWidth * 0.65;
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
                chosenImgVar = <svg id="unicornImage" style={this.state.unicornStyle}width="191" height="234" viewBox="0 0 191 234" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5938 66.8091H2.99794C2.89255 66.1216 2.75419 65.1689 2.60413 64.0037C2.27767 61.4689 1.89664 57.9348 1.6783 53.9404C1.23858 45.8963 1.47309 36.1965 3.9991 29.0064C4.57734 27.3605 5.79233 25.037 7.37808 22.3696C8.94961 19.726 10.8345 16.8279 12.6999 14.0571C14.5642 11.2881 16.3998 8.65971 17.8722 6.5536C17.9347 6.46422 17.9966 6.37565 18.058 6.28792C19.4175 4.34345 20.4864 2.81472 20.8944 2.13531L19.6084 1.3631L20.8944 2.13531C21.0195 1.92692 21.2666 1.72346 21.7747 1.60019C22.2946 1.47404 22.9705 1.4669 23.703 1.57944C24.4277 1.69078 25.1191 1.90572 25.6388 2.14605C25.8989 2.26631 26.0855 2.37895 26.2018 2.46607C26.2322 2.48879 26.2535 2.50658 26.2676 2.51908C26.396 2.74816 26.5656 2.9533 26.6776 3.08515C26.8319 3.2668 27.0233 3.4751 27.2338 3.69845C27.4505 3.92843 27.7196 4.20784 28.019 4.51884C28.2833 4.79329 28.5712 5.09235 28.8679 5.40376C30.1717 6.77258 31.8656 8.61007 33.6288 10.8467C37.1678 15.336 40.9205 21.3527 42.3708 28.2953C44.1766 36.9399 43.4297 46.8086 42.1967 54.5956C41.5827 58.4733 40.8536 61.802 40.2786 64.159C40.0057 65.2775 39.7678 66.176 39.5938 66.8091Z" transform="matrix(0.883227 -0.468946 0.463794 0.885943 15.8115 48.4818)" fill="#C4C4C4" stroke="black" strokeWidth="3"/>
                <path d="M4.20537 37.1394L17.7235 37.7869C17.7235 37.7869 22.5145 25.7263 20.4519 15.065C18.7702 6.3725 12.6824 0.700343 12.6824 0.700343C12.6824 0.700343 11.6315 -0.795293 9.75037 0.584764C9.75037 0.584764 2.16353 11.2589 0.764652 15.5583C-2.14957 24.515 4.20537 37.1394 4.20537 37.1394Z" transform="matrix(0.883227 -0.468946 0.463794 0.885943 33.8295 62.0471)" fill="white"/>
                <g filter="url(#filter0_f)">
                <path d="M3.56532 28.3993L17.0834 29.0467C17.0834 29.0467 22.5855 25.7262 20.5229 15.065C18.8412 6.3725 12.7534 0.700342 12.7534 0.700342C12.7534 0.700342 11.7025 -0.795293 9.82135 0.584764C9.82135 0.584764 2.23451 11.2589 0.835632 15.5583C-2.07859 24.515 3.56532 28.3993 3.56532 28.3993Z" transform="matrix(0.883227 -0.468946 0.463794 0.885943 38.6096 72.0541)" fill="#FFAEA6" fillOpacity="0.6"/>
                </g>
                <path d="M37.443 63.5804C37.1918 64.6847 36.9724 65.5746 36.8106 66.2068H2.89522C2.79715 65.5199 2.66896 64.5723 2.53001 63.4152C2.22548 60.8792 1.87004 57.3435 1.66634 53.3471C1.25628 45.3017 1.47407 35.5885 3.83414 28.3837C4.36991 26.7482 5.53568 24.439 7.08468 21.79C8.61929 19.1656 10.4796 16.292 12.3475 13.5526C16.1101 8.03481 19.8055 3.20479 20.8744 2.07407C21.2534 1.67314 21.5657 1.55387 21.7856 1.51651C22.0265 1.47558 22.2956 1.51115 22.592 1.62284C22.8912 1.73559 23.1655 1.90675 23.3743 2.06277C23.4753 2.13832 23.553 2.20424 23.6017 2.24763C23.6259 2.26915 23.6423 2.28461 23.6503 2.29228C23.6518 2.2937 23.653 2.29484 23.6539 2.2957L23.6872 2.32952L23.7289 2.36597L23.7291 2.36607L23.7295 2.36643L23.7296 2.36657L23.7346 2.37091L23.7585 2.39213C23.7807 2.41182 23.8151 2.44253 23.861 2.48399C23.9528 2.56692 24.0905 2.69283 24.2685 2.85959C24.6244 3.19318 25.1407 3.68981 25.7712 4.33242C27.0332 5.61861 28.7475 7.48419 30.5476 9.79275C34.1662 14.4336 38.0442 20.7539 39.3939 27.6831C41.0805 36.3424 40.3824 46.2229 39.2324 54.0121C38.6595 57.8919 37.9794 61.2222 37.443 63.5804Z" transform="matrix(-0.862776 -0.505586 -0.500282 0.865863 191 50.4392)" fill="#C4C4C4" stroke="black" strokeWidth="3"/>
                <mask id="path-5-inside-1" fill="white">
                <path fillRule="evenodd" clipRule="evenodd" d="M44.7051 1.72168e-05L0.0256883 1.13078e-05L0.0257809 49.8507C0.00867266 50.2215 -2.61661e-05 50.5945 -3.53266e-06 50.9695C-3.46024e-05 63.7394 10.0174 74.0915 22.3744 74.0915C34.7314 74.0916 44.7488 63.7395 44.7488 50.9695C44.7488 50.4805 44.7341 49.9951 44.7052 49.5137L44.7051 1.72168e-05Z"/>
                </mask>
                <path fillRule="evenodd" clipRule="evenodd" d="M44.7051 1.72168e-05L0.0256883 1.13078e-05L0.0257809 49.8507C0.00867266 50.2215 -2.61661e-05 50.5945 -3.53266e-06 50.9695C-3.46024e-05 63.7394 10.0174 74.0915 22.3744 74.0915C34.7314 74.0916 44.7488 63.7395 44.7488 50.9695C44.7488 50.4805 44.7341 49.9951 44.7052 49.5137L44.7051 1.72168e-05Z" transform="matrix(0.936292 0.350045 -0.346013 0.938666 62.2955 145.652)" fill="#9E1946"/>
                <path d="M0.0256883 1.13078e-05L0.0256888 -3.99999L-3.97432 -3.99999L-3.97431 1.87339e-05L0.0256883 1.13078e-05ZM44.7051 1.72168e-05L48.7051 1.49235e-05L48.7051 -3.99998L44.7051 -3.99998L44.7051 1.72168e-05ZM0.0257809 49.8507L4.02153 50.0352L4.02578 49.943L4.02578 49.8507L0.0257809 49.8507ZM-3.53266e-06 50.9695L4 50.9695L4 50.9693L-3.53266e-06 50.9695ZM22.3744 74.0915L22.3744 70.0915L22.3744 70.0915L22.3744 74.0915ZM44.7488 50.9695L48.7488 50.9695L48.7488 50.9695L44.7488 50.9695ZM44.7052 49.5137L40.7052 49.5137L40.7052 49.6336L40.7124 49.7534L44.7052 49.5137ZM0.0256878 4.00001L44.7051 4.00002L44.7051 -3.99998L0.0256888 -3.99999L0.0256878 4.00001ZM4.02578 49.8507L4.02569 3.88175e-06L-3.97431 1.87339e-05L-3.97422 49.8508L4.02578 49.8507ZM4 50.9693C3.99998 50.6562 4.00724 50.3448 4.02153 50.0352L-3.96997 49.6663C-3.98989 50.0981 -4.00003 50.5327 -4 50.9698L4 50.9693ZM22.3744 70.0915C12.3494 70.0915 3.99997 61.6552 4 50.9695L-4 50.9695C-4.00004 65.8236 7.68532 78.0915 22.3744 78.0915L22.3744 70.0915ZM40.7488 50.9695C40.7488 61.6553 32.3993 70.0916 22.3744 70.0915L22.3744 78.0915C37.0634 78.0916 48.7488 65.8236 48.7488 50.9695L40.7488 50.9695ZM40.7124 49.7534C40.7365 50.1554 40.7488 50.5609 40.7488 50.9695L48.7488 50.9695C48.7488 50.4002 48.7317 49.8348 48.698 49.274L40.7124 49.7534ZM40.7051 1.951e-05L40.7052 49.5137L48.7052 49.5137L48.7051 1.49235e-05L40.7051 1.951e-05Z" transform="matrix(0.936292 0.350045 -0.346013 0.938666 62.2955 145.652)" fill="black" mask="url(#path-5-inside-1)"/>
                <mask id="path-7-inside-2" fill="white">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.8238 78.7586C33.8768 78.7586 43.6476 67.7545 43.6476 54.1801C43.6476 53.6557 43.633 53.1352 43.6043 52.6189L43.6043 5.13261e-05L0.0242913 1.82981e-05L0.0242919 53.0097C0.0081757 53.3976 -0.000126563 53.7878 -7.47583e-05 54.1802C-3.82624e-05 67.7544 9.77087 78.7586 21.8238 78.7586Z"/>
                </mask>
                <path fillRule="evenodd" clipRule="evenodd" d="M21.8238 78.7586C33.8768 78.7586 43.6476 67.7545 43.6476 54.1801C43.6476 53.6557 43.633 53.1352 43.6043 52.6189L43.6043 5.13261e-05L0.0242913 1.82981e-05L0.0242919 53.0097C0.0081757 53.3976 -0.000126563 53.7878 -7.47583e-05 54.1802C-3.82624e-05 67.7544 9.77087 78.7586 21.8238 78.7586Z" transform="matrix(-0.934962 -0.353575 0.349516 -0.93737 84.9523 211.527)" fill="#C4C4C4"/>
                <path d="M43.6476 54.1801L46.6476 54.1802L46.6476 54.1798L43.6476 54.1801ZM21.8238 78.7586L21.8238 81.7586L21.8238 78.7586ZM43.6043 52.6189L40.6043 52.6189L40.6043 52.7024L40.6089 52.7857L43.6043 52.6189ZM43.6043 5.13261e-05L46.6043 5.11535e-05L46.6043 -2.99995L43.6043 -2.99995L43.6043 5.13261e-05ZM0.0242913 1.82981e-05L0.0242936 -2.99998L-2.97571 -2.99998L-2.97571 1.8329e-05L0.0242913 1.82981e-05ZM0.0242919 53.0097L3.02171 53.1342L3.02429 53.072L3.02429 53.0097L0.0242919 53.0097ZM-7.47583e-05 54.1802L2.99993 54.1802L2.99993 54.1798L-7.47583e-05 54.1802ZM40.6476 54.1801C40.6476 66.4428 31.8946 75.7586 21.8238 75.7586L21.8238 81.7586C35.8589 81.7586 46.6476 69.0661 46.6476 54.1802L40.6476 54.1801ZM40.6089 52.7857C40.6346 53.2463 40.6476 53.7114 40.6476 54.1805L46.6476 54.1798C46.6476 53.6001 46.6315 53.024 46.5996 52.4521L40.6089 52.7857ZM40.6043 5.14987e-05L40.6043 52.6189L46.6043 52.6189L46.6043 5.11535e-05L40.6043 5.14987e-05ZM0.0242891 3.00002L43.6043 3.00005L43.6043 -2.99995L0.0242936 -2.99998L0.0242891 3.00002ZM3.02429 53.0097L3.02429 1.82672e-05L-2.97571 1.8329e-05L-2.97571 53.0097L3.02429 53.0097ZM2.99993 54.1798C2.99988 53.83 3.00728 53.4814 3.02171 53.1342L-2.97312 52.8851C-2.99093 53.3137 -3.00013 53.7456 -3.00007 54.1806L2.99993 54.1798ZM21.8238 75.7586C11.753 75.7586 2.99996 66.4427 2.99993 54.1802L-3.00007 54.1802C-3.00003 69.0661 7.78874 81.7586 21.8238 81.7586L21.8238 75.7586Z" transform="matrix(-0.934962 -0.353575 0.349516 -0.93737 84.9523 211.527)" fill="black" mask="url(#path-7-inside-2)"/>
                <mask id="path-9-inside-3" fill="white">
                <path fillRule="evenodd" clipRule="evenodd" d="M43.872 -1.05145e-05L0.0249287 -2.19571e-05L0.0249784 48.6715C0.00833393 49.0317 -4.35597e-05 49.3941 -5.58661e-05 49.7585C-0.000100992 62.225 9.83068 72.3311 21.9575 72.3311C34.0842 72.3311 43.915 62.225 43.9149 49.7585C43.915 49.2799 43.9004 48.8047 43.8719 48.3334L43.872 -1.05145e-05Z"/>
                </mask>
                <path fillRule="evenodd" clipRule="evenodd" d="M43.872 -1.05145e-05L0.0249287 -2.19571e-05L0.0249784 48.6715C0.00833393 49.0317 -4.35597e-05 49.3941 -5.58661e-05 49.7585C-0.000100992 62.225 9.83068 72.3311 21.9575 72.3311C34.0842 72.3311 43.915 62.225 43.9149 49.7585C43.915 49.2799 43.9004 48.8047 43.8719 48.3334L43.872 -1.05145e-05Z" transform="matrix(0.945361 -0.326026 0.321932 0.946763 102.513 160.962)" fill="#9E1946"/>
                <path d="M0.0249287 -2.19571e-05L0.0249298 -4.00002L-3.97508 -4.00002L-3.97507 -1.78785e-05L0.0249287 -2.19571e-05ZM43.872 -1.05145e-05L47.872 -1.26468e-07L47.872 -4.00001L43.872 -4.00001L43.872 -1.05145e-05ZM0.0249784 48.6715L4.02071 48.8561L4.02498 48.7638L4.02498 48.6715L0.0249784 48.6715ZM-5.58661e-05 49.7585L-4.00006 49.7584L-4.00006 49.7585L-5.58661e-05 49.7585ZM21.9575 72.3311L21.9575 68.3311L21.9575 68.3311L21.9575 72.3311ZM43.9149 49.7585L39.9149 49.7582L39.9149 49.7585L43.9149 49.7585ZM43.8719 48.3334L39.8719 48.3334L39.8719 48.4545L39.8792 48.5754L43.8719 48.3334ZM0.0249277 3.99998L43.872 3.99999L43.872 -4.00001L0.0249298 -4.00002L0.0249277 3.99998ZM4.02498 48.6715L4.02493 -2.60358e-05L-3.97507 -1.78785e-05L-3.97502 48.6715L4.02498 48.6715ZM3.99994 49.7587C3.99995 49.4555 4.00692 49.1545 4.02071 48.8561L-3.97076 48.4868C-3.99026 48.9088 -4.00004 49.3328 -4.00006 49.7584L3.99994 49.7587ZM21.9575 68.3311C12.1433 68.3311 3.99991 60.1207 3.99994 49.7586L-4.00006 49.7585C-4.00011 64.3293 7.5181 76.3311 21.9575 76.3311L21.9575 68.3311ZM39.9149 49.7585C39.915 60.1208 31.7716 68.3311 21.9575 68.3311L21.9575 76.3311C36.3968 76.3311 47.915 64.3293 47.9149 49.7585L39.9149 49.7585ZM39.8792 48.5754C39.9029 48.9665 39.915 49.3609 39.9149 49.7582L47.9149 49.7588C47.915 49.1988 47.8979 48.6428 47.8645 48.0914L39.8792 48.5754ZM39.872 -2.09026e-05L39.8719 48.3334L47.8719 48.3334L47.872 -1.26468e-07L39.872 -2.09026e-05Z" transform="matrix(0.945361 -0.326026 0.321932 0.946763 102.513 160.962)" fill="black" mask="url(#path-9-inside-3)"/>
                <mask id="path-11-inside-4" fill="white">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.6368 78.8022C33.5864 78.8022 43.2735 67.792 43.2735 54.2101C43.2735 53.685 43.2591 53.1636 43.2305 52.6467L43.2305 -2.38196e-05L0.024127 -1.00357e-05L0.024073 53.04C0.00814835 53.4278 7.17327e-05 53.8179 5.62468e-05 54.2101C5.36376e-05 67.792 9.6871 78.8022 21.6368 78.8022Z"/>
                </mask>
                <path fillRule="evenodd" clipRule="evenodd" d="M21.6368 78.8022C33.5864 78.8022 43.2735 67.792 43.2735 54.2101C43.2735 53.685 43.2591 53.1636 43.2305 52.6467L43.2305 -2.38196e-05L0.024127 -1.00357e-05L0.024073 53.04C0.00814835 53.4278 7.17327e-05 53.8179 5.62468e-05 54.2101C5.36376e-05 67.792 9.6871 78.8022 21.6368 78.8022Z" transform="matrix(-0.946258 0.323413 -0.319345 -0.947639 160.615 195.769)" fill="#C4C4C4"/>
                <path d="M43.2735 54.2101L46.2735 54.2101L46.2735 54.21L43.2735 54.2101ZM21.6368 78.8022L21.6368 81.8022L21.6368 81.8022L21.6368 78.8022ZM43.2305 52.6467L40.2305 52.6466L40.2305 52.7295L40.2351 52.8122L43.2305 52.6467ZM43.2305 -2.38196e-05L46.2305 -2.0729e-05L46.2305 -3.00002L43.2305 -3.00002L43.2305 -2.38196e-05ZM0.024127 -1.00357e-05L0.024126 -3.00001L-2.97587 -3.00001L-2.97587 -1.30922e-05L0.024127 -1.00357e-05ZM0.024073 53.04L3.02155 53.1631L3.02407 53.1016L3.02407 53.04L0.024073 53.04ZM5.62468e-05 54.2101L-2.99994 54.21L-2.99994 54.2101L5.62468e-05 54.2101ZM40.2735 54.2101C40.2735 66.5075 31.5802 75.8022 21.6368 75.8022L21.6368 81.8022C35.5926 81.8022 46.2735 69.0764 46.2735 54.2101L40.2735 54.2101ZM40.2351 52.8122C40.2606 53.274 40.2735 53.7401 40.2735 54.2102L46.2735 54.21C46.2735 53.6298 46.2575 53.0533 46.2259 52.4811L40.2351 52.8122ZM40.2305 -2.69102e-05L40.2305 52.6466L46.2305 52.6467L46.2305 -2.0729e-05L40.2305 -2.69102e-05ZM0.0241279 2.99999L43.2305 2.99998L43.2305 -3.00002L0.024126 -3.00001L0.0241279 2.99999ZM3.02407 53.04L3.02413 -6.97923e-06L-2.97587 -1.30922e-05L-2.97593 53.04L3.02407 53.04ZM3.00006 54.2103C3.00007 53.8591 3.0073 53.51 3.02155 53.1631L-2.9734 52.9169C-2.991 53.3456 -2.99993 53.7767 -2.99994 54.21L3.00006 54.2103ZM21.6368 75.8022C11.6933 75.8022 3.00005 66.5075 3.00006 54.2101L-2.99994 54.2101C-2.99995 69.0764 7.68088 81.8022 21.6368 81.8022L21.6368 75.8022Z" transform="matrix(-0.946258 0.323413 -0.319345 -0.947639 160.615 195.769)" fill="black" mask="url(#path-11-inside-4)"/>
                <path d="M32.5551 3.35137C29.0793 1.30416 18.9094 -1.46415 10.4131 0.920306C0.266466 3.76789 3.37273 12.9821 0 16.0837C1.76022 18.0931 1.78797 13.7154 8.09588 13.9713C12.4728 14.739 17.3646 19.2172 20.4542 22.9278C24.5737 30.221 30.4954 32.3961 35.001 33.2918C45.2997 34.1874 59.7178 27.993 60.6189 27.6619C61.52 27.3308 62.1637 26.8942 61.2626 26.1265C52.3218 24.4709 43.2685 18.5775 41.6951 16.0185C40.2791 13.7154 38.4768 7.70169 32.5551 3.35137Z" transform="matrix(-0.719548 0.694442 0.68935 0.724428 44.3937 81.8397)" fill="#9E1946" stroke="black" strokeWidth="3"/>
                <path d="M32.5551 3.35137C29.0793 1.30416 18.9094 -1.46415 10.4131 0.920306C0.266466 3.76789 3.37273 12.9821 0 16.0837C1.76022 18.0931 1.78797 13.7154 8.09588 13.9713C12.4728 14.739 17.3646 19.2172 20.4542 22.9278C24.5737 30.221 30.4954 32.3961 35.001 33.2918C45.2997 34.1874 59.7178 27.993 60.6189 27.6619C61.52 27.3308 62.1637 26.8942 61.2626 26.1265C52.3218 24.4709 43.2685 18.5775 41.6951 16.0185C40.2791 13.7154 38.4768 7.70169 32.5551 3.35137Z" transform="matrix(-0.719548 0.694442 0.68935 0.724428 48.8063 97.393)" fill="#9E1946" stroke="black" strokeWidth="3"/>
                <ellipse cx="68.2103" cy="67.2123" rx="68.2103" ry="67.2123" transform="translate(32.7262 70.3599)" fill="#C4C4C4"/>
                <path d="M145.82 70.5451C145.82 108.315 113.713 139.09 73.9098 139.09C34.1063 139.09 2 108.315 2 70.5451C2 32.7755 34.1063 2 73.9098 2C113.713 2 145.82 32.7755 145.82 70.5451Z" transform="translate(28.3137 66.2864)" fill="#C4C4C4" stroke="black" strokeWidth="4"/>
                <path d="M1.28105 78.2399C1.40448 77.7471 1.56268 77.1159 1.75202 76.3614C2.2512 74.3723 2.96681 71.5259 3.83251 68.0976C5.56394 61.2407 7.89558 52.0561 10.2966 42.7444C12.6979 33.4319 15.1677 23.9958 17.1757 16.6345C18.1799 12.9531 19.067 9.7963 19.7716 7.43531C20.124 6.25415 20.4287 5.27912 20.6781 4.54021C20.9371 3.77272 21.1129 3.33311 21.2036 3.16665C21.7335 2.19451 22.1931 1.60943 22.5647 1.29154C22.9208 0.986903 23.1129 0.991726 23.1925 1.00472C23.3122 1.02425 23.5499 1.12817 23.889 1.53481C24.2207 1.93275 24.5704 2.52735 24.9279 3.32065C24.978 3.43165 25.0977 3.81826 25.2836 4.55972C25.4601 5.26345 25.6777 6.20747 25.9307 7.36109C26.4364 9.6669 27.0781 12.7845 27.8072 16.4387C29.2651 23.7455 31.0688 33.1784 32.8262 42.5103C34.5834 51.8414 36.2937 61.0688 37.5647 67.9635C38.2003 71.4108 38.7259 74.2749 39.0927 76.2771C39.2386 77.0736 39.3594 77.7338 39.452 78.2399H1.28105Z" transform="matrix(0.997901 0.064751 -0.0638469 0.99796 89.6326 0)" fill="#C4C4C4" stroke="black" strokeWidth="2"/>
                <path d="M4.20537 37.1394L17.7235 37.7869C17.7235 37.7869 22.5145 25.7263 20.4519 15.065C18.7702 6.3725 12.6824 0.700343 12.6824 0.700343C12.6824 0.700343 11.6315 -0.795293 9.75037 0.584764C9.75037 0.584764 2.16353 11.2589 0.764652 15.5583C-2.14957 24.515 4.20537 37.1394 4.20537 37.1394Z" transform="matrix(-0.883227 -0.468946 -0.463794 0.885943 173.568 62.0471)" fill="white"/>
                <g filter="url(#filter1_f)">
                <path d="M3.56532 28.3993L17.0834 29.0467C17.0834 29.0467 22.5855 25.7262 20.5229 15.065C18.8412 6.3725 12.7534 0.700342 12.7534 0.700342C12.7534 0.700342 11.7025 -0.795293 9.82135 0.584764C9.82135 0.584764 2.23451 11.2589 0.835632 15.5583C-2.07859 24.515 3.56532 28.3993 3.56532 28.3993Z" transform="matrix(-0.883227 -0.468946 -0.463794 0.885943 169.531 67.24)" fill="#FFAEA6" fillOpacity="0.6"/>
                </g>
                <path d="M43.0309 5.01059C38.9542 1.94983 27.0264 -2.18903 17.0614 1.37594C5.16082 5.63333 3.95574 11.4687 0 16.1058C2.06449 19.1102 6.94533 20.5057 14.3436 20.8883C19.4771 22.0361 25.2146 28.7315 28.8382 34.2791C33.6698 45.183 40.6151 48.4351 45.8996 49.7742C57.9784 51.1132 74.8888 41.8521 75.9457 41.3571C77.0026 40.862 77.7575 40.2093 76.7006 39.0615C66.2144 36.5861 55.5962 27.775 53.7508 23.949C52.09 20.5057 49.9762 11.5147 43.0309 5.01059Z" transform="matrix(0.975178 -0.22142 0.218465 0.975845 84.9742 58.1596)" fill="#9E1946" stroke="black" strokeWidth="3"/>
                <path d="M27.579 1.5771C18.0702 -2.08413 5.33891 0.906793 9.99758e-06 7.68212" transform="matrix(0.988473 0.151396 -0.149321 0.988789 93.1471 43.6927)" stroke="black" strokeWidth="3"/>
                <path d="M18.7451 2.6968C12.0011 -2.72851 1.89558 1.32154 0 3.67724" transform="matrix(0.993196 0.116456 -0.114845 0.993383 100.422 30.3471)" stroke="black" strokeWidth="2"/>
                <path d="M10.1811 0.917694C7.2158 -0.21512 4.26179 -0.938591 3.98292e-08 2.73714" transform="matrix(0.984267 0.176688 -0.174287 0.984695 106.259 15.4108)" stroke="black" strokeWidth="2"/>
                <g filter="url(#filter2_i)">
                <ellipse cx="31.1142" cy="24.9914" rx="31.1142" ry="24.9914" transform="matrix(0.999906 0.0136751 -0.0134834 0.999909 73.8484 136.276)" fill="#C4C4C4"/>
                </g>
                <path d="M31.1142 50.3518C48.4223 50.3518 62.5975 39.0689 62.5975 24.9914C62.5975 10.9138 48.4223 -0.369011 31.1142 -0.369011C13.8061 -0.369011 -0.369011 10.9138 -0.369011 24.9914C-0.369011 39.0689 13.8061 50.3518 31.1142 50.3518Z" transform="matrix(0.999906 0.0136751 -0.0134834 0.999909 73.8484 136.276)" stroke="#C4C4C4" strokeOpacity="0.25" strokeWidth="0.738021"/>
                <path d="M4.57181 4.58036C4.57181 7.1034 4.77752 7.76167 3.08711 7.76167C1.39671 7.76167 0 7.09141 0 4.56837C0 2.04533 1.37034 0 3.06075 0C3.38509 0.152744 4.57181 2.05732 4.57181 4.58036Z" transform="matrix(0.904282 -0.426936 0.422023 0.906585 89.7214 164.852)" fill="black" fillOpacity="0.25"/>
                <path d="M4.57181 4.58036C4.57181 7.1034 4.77752 7.76167 3.08711 7.76167C1.39671 7.76167 0 7.09141 0 4.56837C0 2.04533 1.37034 0 3.06075 0C3.38509 0.152744 4.57181 2.05732 4.57181 4.58036Z" transform="matrix(-0.904282 -0.426936 -0.422023 0.906585 121.407 166.333)" fill="black" fillOpacity="0.25"/>
                <g filter="url(#filter3_f)">
                <ellipse cx="19.1209" cy="13.7017" rx="19.1209" ry="13.7017" transform="translate(36.0356 142.942)" fill="#FFAEA6" fillOpacity="0.5"/>
                </g>
                <ellipse cx="2.59377" cy="1.40382" rx="2.59377" ry="1.40382" transform="matrix(0.96044 -0.278487 0.27488 0.961479 46.6628 145.797)" fill="white"/>
                <ellipse cx="2.55579" cy="1.51907" rx="2.55579" ry="1.51907" transform="matrix(0.991232 0.132132 -0.130311 0.991473 55.8518 143.92)" fill="white"/>
                <ellipse cx="2.68051" cy="1.40804" rx="2.68051" ry="1.40804" transform="matrix(0.968643 -0.248457 0.245185 0.969477 51.1117 151.542)" fill="white"/>
                <g filter="url(#filter4_f)">
                <ellipse cx="19.1209" cy="13.7017" rx="19.1209" ry="13.7017" transform="translate(132.743 141.461)" fill="#FFAEA6" fillOpacity="0.5"/>
                </g>
                <ellipse cx="2.59377" cy="1.40382" rx="2.59377" ry="1.40382" transform="matrix(-0.96044 -0.278487 -0.27488 0.961479 160.604 146.671)" fill="white"/>
                <ellipse cx="2.55579" cy="1.51907" rx="2.55579" ry="1.51907" transform="matrix(-0.991232 0.132132 0.130311 0.991473 151.416 144.793)" fill="white"/>
                <ellipse cx="2.68051" cy="1.40804" rx="2.68051" ry="1.40804" transform="matrix(-0.968643 -0.248457 -0.245185 0.969477 156.156 152.416)" fill="white"/>
                <path d="M10.785 13.5616C6.88558 8.51338 6.99458 7.76216 6.00329 0C2.28825 0.0742242 0 0.675935 0 2.75019C2.39061 14.5586 9.56047 19.1917 10.785 20.1175C11.399 20.5817 16.547 22.8949 28.3137 22.8949C33.6455 22.1542 36.0356 21.0433 34.0132 21.0433C24.9874 21.0433 18.9371 21.4136 10.785 13.5616Z" transform="translate(74.2776 163.267)" fill="black" stroke="black" strokeWidth="0.369011"/>
                <path d="M3.34723 4.08409C2.49541 2.76329 2.01058 2.03088 1.79404 0C0.982499 0.0194199 0.282734 0.546599 3.40731e-05 1.50105C-0.00429809 3.86479 0.403477 4.72061 1.79404 6.37953C4.21807 8.25815 6.58182 8.20302 8.24842 7.75083C8.93792 7.56375 9.82881 6.73094 9.49097 6.37953C6.7355 5.91876 5.26796 5.56584 3.34723 4.08409Z" transform="matrix(-0.640089 0.768301 -0.765014 -0.644013 82.486 163.614)" fill="black" stroke="black" strokeWidth="0.369013"/>
                <path d="M31.3136 1.83453C44.6148 5.03005 49.584 18.1929 45.2637 16.3368C40.9435 14.4806 34.8494 12.2302 30.7205 12.2302C25.6409 12.2302 15.2634 16.0392 15.7754 17.53C16.2874 19.0208 6.28644 22.2182 4.50726 21.6067C2.72808 20.9952 0.182558 17.1882 0 13.8609C1.17382 15.2103 2.16827 15.7421 4.50726 16.3069C7.01325 16.1524 8.50199 15.3038 11.1495 13.8609L8.54007 10.5995C6.77897 6.5636 6.4344 4.24076 6.8795 0C9.12361 4.23487 10.9013 6.5482 14.7079 10.5995C15.7629 9.13439 17.9059 7.35871 20.3484 5.77946C24.3609 3.185 29.1816 1.1207 31.3136 1.83453Z" transform="matrix(0.997018 0.0759523 -0.0755205 0.997237 47.6129 97.7753)" fill="black" stroke="black" strokeWidth="0.738022"/>
                <path d="M24.16 0.0152253C45.2373 -0.528645 44.4307 13.6914 42.5822 11.7554C40.7338 9.81951 32.3766 8.08106 27.6814 8.08106C21.905 8.08106 10.1041 12.8056 10.6863 14.6548C11.2686 16.5039 6.60672 18.2442 6.60672 18.2442C6.60672 18.2442 2.87382 20.3343 0.935782 15.9156C11.6452 17.7047 3.14086 12.6072 6.22069 15.2322L1.90398 12.7671C6.28352 15.1638 8.28009 5.05375 9.43667 4.9042C13.9996 1.68607 17.076 0.93121 24.16 0.0152253Z" transform="matrix(0.983723 -0.180212 -0.178338 -0.983875 56.0991 149.035)" fill="black"/>
                <path d="M0.935782 15.9156C11.6452 17.7047 3.14086 12.6072 6.22069 15.2322L1.90398 12.7671C6.28352 15.1638 8.28009 5.05375 9.43667 4.9042C13.9996 1.68607 17.076 0.93121 24.16 0.0152253C45.2373 -0.528645 44.4307 13.6914 42.5822 11.7554C40.7338 9.81951 32.3766 8.08106 27.6814 8.08106C21.905 8.08106 10.1041 12.8056 10.6863 14.6548C11.2686 16.5039 6.60672 18.2442 6.60672 18.2442C6.60672 18.2442 2.87382 20.3343 0.935782 15.9156ZM0.935782 15.9156C-1.72404 15.215 2.27061 17.5893 0.935782 15.9156Z" transform="matrix(0.983723 -0.180212 -0.178338 -0.983875 56.0991 149.035)" stroke="black" strokeWidth="0.738022"/>
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="59" y="106" width="37" height="37">
                <path d="M31.3629 8.86957L31.3804 8.99321L31.4377 9.10419C31.7172 9.6462 32.0242 10.5821 32.3271 11.781C32.6259 12.9637 32.9082 14.3503 33.1518 15.7597C33.6382 18.573 33.9594 21.4094 33.9638 22.852C33.4303 29.1728 32.0033 32.1881 29.7398 33.7197C28.5887 34.4985 27.1542 34.9423 25.3537 35.1852C23.5483 35.4288 21.4317 35.4641 18.9386 35.4641C9.29075 35.4641 0.738022 28.5104 0.738022 19.0118C0.738022 9.41977 9.39044 0.738022 18.9386 0.738022C25.7218 0.738022 30.71 4.26707 31.3629 8.86957Z" transform="matrix(0.943525 -0.331901 0.328857 0.944171 54.0673 113.508)" fill="white" stroke="black" strokeWidth="1.47604"/>
                </mask>
                <g mask="url(#mask0)">
                <path d="M40.9263 11.4817L40.9438 11.6053L41.001 11.7163C41.3762 12.4437 41.7796 13.6794 42.1733 15.2377C42.5628 16.7798 42.9303 18.5853 43.2473 20.4184C43.8802 24.0791 44.3 27.7816 44.3045 29.6705C43.6114 37.8942 41.7519 41.9016 38.725 43.9497C37.1922 44.9869 35.2932 45.5701 32.9381 45.8878C30.5781 46.2062 27.817 46.2517 24.582 46.2517C11.9667 46.2517 0.738022 37.1546 0.738022 24.677C0.738022 12.1061 12.0664 0.738022 24.582 0.738022C33.4433 0.738022 40.057 5.35425 40.9263 11.4817Z" transform="matrix(0.943525 -0.331901 0.328857 0.944171 47.6188 111.748)" fill="white" stroke="black" strokeWidth="1.47604"/>
                <ellipse cx="16.8516" cy="17.8328" rx="16.8516" ry="17.8328" transform="matrix(0.999061 0.0417148 -0.0415893 0.999203 63.0984 109.766)" fill="#C4C4C4"/>
                <path d="M23.958 14.0626C23.958 21.8291 18.5949 28.1251 11.979 28.1251C5.36319 28.1251 0 21.8291 0 14.0626C0 6.29603 5.36319 0 11.979 0C18.5949 0 23.958 6.29603 23.958 14.0626Z" transform="matrix(0.999061 0.0417148 -0.0415893 0.999203 68.0803 114.153)" fill="black"/>
                <ellipse cx="4.19446" cy="4.21371" rx="4.19446" ry="4.21371" transform="matrix(0.998618 -0.052564 0.051829 0.998656 70.2495 114.723)" fill="white"/>
                <ellipse cx="2.15391" cy="2.16379" rx="2.15391" ry="2.16379" transform="matrix(0.998618 -0.052564 0.051829 0.998656 67.7429 123.294)" fill="white"/>
                </g>
                <path d="M30.4685 1.77112C43.3217 4.85619 48.1235 17.5641 43.9488 15.7721C39.774 13.9801 33.8852 11.8075 29.8955 11.8075C24.9869 11.8075 14.959 15.4848 15.4538 16.9241C15.9486 18.3633 7.73673 21.461 6.01748 20.8706C4.29823 20.2803 0.176409 17.7264 0 14.5141C1.13428 15.8169 4.13717 15.948 6.39737 16.4933C8.81895 16.344 8.42539 14.7748 10.9837 13.3818L8.46219 10.2332C6.76041 6.33673 6.42745 4.09418 6.85756 0C9.02607 4.0885 10.7439 6.32187 14.4222 10.2332C15.4417 8.81867 17.5125 7.10436 19.8727 5.5797C23.7501 3.07491 28.4084 1.08196 30.4685 1.77112Z" transform="matrix(-0.922857 0.386324 0.381924 0.923704 151.101 92.0922)" fill="black" stroke="black" strokeWidth="0.738024"/>
                <path d="M23.3461 0.0146991C43.7134 -0.510373 42.9339 13.2181 41.1478 11.3491C39.3616 9.48011 31.2859 7.80174 26.7489 7.80174C21.1671 7.80174 9.76371 12.363 10.3263 14.1482C10.889 15.9335 6.38416 17.6136 6.38416 17.6136C6.38416 17.6136 2.77701 19.6315 0.904258 15.3654C11.2529 17.0927 3.03506 12.1714 6.01113 14.7057L1.83984 12.3258C6.07185 14.6396 8.00116 4.87907 9.11878 4.73469C13.528 1.6278 16.5008 0.899024 23.3461 0.0146991Z" transform="matrix(-0.989838 0.13896 -0.136564 -0.991088 158.515 141.778)" fill="black"/>
                <path d="M0.904258 15.3655C11.2529 17.0927 3.03506 12.1714 6.01113 14.7057L1.83984 12.3258C6.07185 14.6396 8.00116 4.87907 9.11878 4.73469C13.528 1.6278 16.5008 0.899024 23.3461 0.0146991C43.7134 -0.510373 42.9339 13.2181 41.1478 11.3491C39.3616 9.48011 31.2859 7.80174 26.7489 7.80174C21.1671 7.80174 9.76371 12.363 10.3263 14.1482C10.889 15.9335 6.38416 17.6136 6.38416 17.6136C6.38416 17.6136 2.77701 19.6315 0.904258 15.3655ZM0.904258 15.3655C-1.66596 14.6891 2.19412 16.9814 0.904258 15.3655Z" transform="matrix(-0.989838 0.13896 -0.136564 -0.991088 158.515 141.778)" stroke="black" strokeWidth="0.738024"/>
                <mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="115" y="108" width="35" height="36">
                <path d="M30.2799 8.56717L30.2975 8.69088L30.3548 8.80192C30.6235 9.32243 30.9195 10.2236 31.2121 11.3809C31.5006 12.5219 31.7733 13.86 32.0086 15.2203C32.4784 17.9354 32.7884 20.6715 32.7929 22.0624C32.2774 28.1626 30.8994 31.063 28.7225 32.5348C27.6146 33.2839 26.2327 33.7116 24.4949 33.9458C22.7522 34.1808 20.7087 34.2148 18.2996 34.2148C8.98714 34.2148 0.738024 27.5089 0.738024 18.3557C0.738024 9.10924 9.08687 0.738024 18.2996 0.738024C24.8479 0.738024 29.6516 4.14155 30.2799 8.56717Z" transform="matrix(-0.998874 -0.0177065 -0.0188006 1.00079 149.712 108.571)" fill="white" stroke="black" strokeWidth="1.47605"/>
                </mask>
                <g mask="url(#mask1)">
                <path d="M39.5206 11.0891L39.5382 11.2128L39.5955 11.3239C39.9565 12.0234 40.3457 13.214 40.7261 14.7183C41.1023 16.2063 41.4572 17.9489 41.7634 19.7183C42.3748 23.2515 42.78 26.8238 42.7845 28.6456C42.115 36.5831 40.3191 40.4414 37.4045 42.4119C35.9278 43.4103 34.097 43.9726 31.8234 44.2791C29.5449 44.5863 26.8785 44.6302 23.7525 44.6302C11.5728 44.6302 0.738024 35.8548 0.738024 23.8255C0.738024 11.7028 11.6725 0.738024 23.7525 0.738024C32.3089 0.738024 38.6832 5.19121 39.5206 11.0891Z" transform="matrix(-0.998874 -0.0177065 -0.0188006 1.00079 155.098 104.993)" fill="white" stroke="black" strokeWidth="1.47605"/>
                <ellipse cx="16.284" cy="17.2163" rx="16.284" ry="17.2163" transform="matrix(-0.935429 0.354464 0.350298 0.936282 140.303 107.889)" fill="#C4C4C4"/>
                <path d="M23.1511 13.5764C23.1511 21.0745 17.9686 27.1528 11.5756 27.1528C5.18256 27.1528 0 21.0745 0 13.5764C0 6.07837 5.18256 0 11.5756 0C17.9686 0 23.1511 6.07837 23.1511 13.5764Z" transform="matrix(-0.935429 0.354464 0.350298 0.936282 137.051 113.43)" fill="black"/>
                <ellipse cx="4.05323" cy="4.068" rx="4.05323" ry="4.068" transform="matrix(-0.964297 0.264825 0.261368 0.965239 131.368 114.798)" fill="white"/>
                <ellipse cx="2.08139" cy="2.08897" rx="2.08139" ry="2.08897" transform="matrix(-0.964297 0.264825 0.261368 0.965239 122.785 122.945)" fill="white"/>
                </g>
                <path d="M50.3303 13.2037C45.5953 9.78001 30.1629 -3.23615 18.5886 0.751556C4.76624 5.51379 4.59456 12.9339 0 18.1209C2.39789 21.4816 -2.19359 26.9315 6.39946 27.3594C12.362 28.6433 15.8543 32.8783 20.0632 39.0838C25.6749 51.2807 47.5244 61.7775 53.6623 63.2754C67.6917 64.7732 87.333 54.4139 88.5606 53.8602C89.7882 53.3064 90.665 52.5763 89.4374 51.2924C77.2578 48.5235 64.9248 38.6675 62.7814 34.3879C60.8524 30.5362 58.3972 20.4791 50.3303 13.2037Z" transform="matrix(0.99401 0.109287 -0.107772 0.994176 75.0938 42.2753)" fill="#9E1946" stroke="black" strokeWidth="3"/>
                <path d="M30.9027 3.68069C27.4698 1.43231 17.4253 -1.60802 9.0337 1.01074C-0.987789 4.13814 -1.9482 15.7534 2.62469 19.8578C4.6777 21.7004 2.16422 17.0675 8.39434 17.3486C12.7173 18.1917 15.8995 21.1056 18.951 25.1808C23.0197 33.1906 28.8684 35.5795 33.3185 36.5632C43.4901 37.5469 57.7304 30.7438 58.6204 30.3802C59.5105 30.0165 60.1462 29.537 59.2562 28.6939C50.4257 26.8755 41.484 20.403 39.93 17.5925C38.5314 15.0631 36.7514 8.4585 30.9027 3.68069Z" transform="matrix(0.853556 0.521001 -0.515649 0.8568 74.7959 57.0286)" fill="#9E1946" stroke="black" strokeWidth="3"/>
                <defs>
                <filter id="filter0_f" x="38.9926" y="59.1514" width="36.3717" height="43.7712" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="3.69014" result="effect1_foregroundBlur"/>
                </filter>
                <filter id="filter1_f" x="132.776" y="54.3372" width="36.3717" height="43.7712" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="3.69014" result="effect1_foregroundBlur"/>
                </filter>
                <filter id="filter2_i" x="72.7715" y="135.96" width="63.7024" height="52.1996" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0" result="hardAlpha"/>
                <feOffset dy="0.738021"/>
                <feGaussianBlur stdDeviation="11.0703"/>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                </filter>
                <filter id="filter3_f" x="30.5005" y="137.407" width="49.3122" height="38.4737" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="2.76758" result="effect1_foregroundBlur"/>
                </filter>
                <filter id="filter4_f" x="127.208" y="135.925" width="49.3122" height="38.4737" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="2.76758" result="effect1_foregroundBlur"/>
                </filter>
                </defs>
                </svg>;
                break;
            default:
                chosenImgVar = raspberry;
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
                {/* <img id="unicornImage" src={chosenImgVar} alt="" style={this.state.unicornStyle}/> */}
                {chosenImgVar}
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