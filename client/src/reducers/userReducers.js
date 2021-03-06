export const initialState = null

export const reducer = (state, action) => {
    if (action.type === "USER") {
        return action.payload
    }
    if (action.type === "CLEAR") {
        return null
    }
    if (action.type === "UPDATE") {
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if (action.type === "UPDATEPIC") {
        return {
            ...state,
            pic: action.payload
        }
    }
    if (action.type === "UPDATEEMAIL") {
        return {
            ...state,
            email: action.payload
        }
    }
    if (action.type === "UPDATECREDITS") {
        return {
            ...state,
            credits: action.payload
        }
    }
    if (action.type === "UPDATERATING") {
        return {
            ...state,
            badmintonRating: action.payload.badmintonRating,
            tennisRating: action.payload.tennisRating,
            tableTennisRating: action.payload.tableTennisRating,
            chessRating: action.payload.chessRating
        }
    }
    return state
}