let initialState = {
    // username: "",
    // id: null,
    // profile_picture: ""
}

//let GATHER_USER_INFO = 'GATHER_USER_INFO';
export default function reducer(state=initialState, action){
    switch(action.type){
        // case GATHER_USER_INFO:
        //     return Object.assign({}, state, action.payload);
        default:
            return state;
    }

}

//This function returns the "action" that will be plugged in to this reducer to trigger the "Gather Location" switch case
// export function gatherUserId(username, profile_picture){
//     return {
//         type: GATHER_USER_INFO,
//         payload: {
//             username,
//             profile_picture
//         }
//     }
// }