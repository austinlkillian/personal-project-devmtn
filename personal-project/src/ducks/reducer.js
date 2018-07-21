let initialState = {
    level: 1,
    score: 0,
    file_name: ""
}

let LEVEL_UP = "LEVEL_UP";
let SCORE_UP = "SCORE_UP";
let UNICORN_CHOSEN = "UNICORN_CHOSEN";
let SCORE_DOWN = "SCORE_DOWN";

export default function reducer(state=initialState, action){
    switch(action.type){
        case LEVEL_UP:
            console.log(action.payload)
            return Object.assign({}, state, action.payload);
        case SCORE_UP:
            return Object.assign({}, state, action.payload);
        case UNICORN_CHOSEN:
            return Object.assign({}, state, action.payload)
        case SCORE_DOWN:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }

}

//This function returns the action that levels up
export function levelUpStore(level){
    return {
        type: LEVEL_UP,
        payload: {
            level        }
    }
}

//This function returns the action that increases score
export function scoreUp(score){
    return {
        type: SCORE_UP,
        payload: {
            score
        }
    }
}

//This funciton returns the action that decreases score
export function scoreDown(score){
    return {
        type: SCORE_DOWN,
        payload: {
            score
        }
    }
}

//This function updates the current game-play unicorn in store
export function chosenUnicorn(file_name){
    return {
        type: UNICORN_CHOSEN,
        payload: {
            file_name
        }
    }
}