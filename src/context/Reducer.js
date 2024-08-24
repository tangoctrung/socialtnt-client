const Reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START": 
            return {
                user: null,
                accessToken: null,
                isFetching: true,
                error: false
            }
        case "LOGIN_SUCCESS": 
            return {
                user: action.payload.newUser,
                accessToken: action.payload.accessToken || null,
                isFetching: false,
                error: false
            }
        case "LOGIN_FAILURE": 
            return {
                user: null,
                accessToken: null,
                isFetching: false,
                error: true
            }
        case "NO_LOGIN": 
            return {
                ...state,
                user: action.payload,
            }
        case "UPDATE_START": 
            return {
                ...state,
                isFetching: true,
            }
        case "UPDATE_SUCCESS": 
            return {
                ...state,
                user: action.payload,
                isFetching: false,
                error: false
            }
        case "UPDATE_FAILURE": 
            return {
                ...state,
                user: state.user,
                isFetching: false,
                error: true
            }
        case "LOGOUT": 
            return {
                user: null,
                accessToken: null,
                isFetching: false,
                error: false
            }
        case "FOLLOW":
            return {
              ...state,
              user: {
                ...state.user,
                following: [...state.user.following, action.payload],
              },
            };
        
        case "UNFOLLOW":
            return {
                ...state,
                user: {
                ...state.user,
                following: state.user.following.filter(
                    (following) => following !== action.payload
                ),
                },
            };
        case "SAVEPOST":
            return {
            ...state,
            user: {
                ...state.user,
                postSaved: [...state.user.postSaved, action.payload],
            },
            };
        case "UNSAVEPOST":
            return {
                ...state,
                user: {
                ...state.user,
                postSaved: state.user.postSaved.filter(
                    (post) => post !== action.payload
                ),
                },
            };
        case "SEARCH_HISTORY":
            return {
                ...state,
                user: {
                ...state.user,
                searchHistorys: [...state.user.searchHistorys, action.payload],
                },
            };
        
        case "DELETE_HISTORY":
            return {
                ...state,
                user: {
                ...state.user,
                searchHistorys: state.user.searchHistorys.filter(
                    (history) => history !== action.payload
                ),
                },
            };
       
        case "SEARCH_START": 
            return {
                ...state,
                isFetching: true,  
                error: false,            
            };
        
        case "SEARCH_SUCCESS": 
            return {
                ...state,
                isFetching: false,
                error: false, 
            };
       
        case "SEARCH_FAILURE": 
            return {
                ...state,
                isFetching: false,
                error: true,
            };
        case "SEND_MESSAGE_GROUP": 
            return {
                ...state,
                messagesCallVideo: [...state.messagesCallVideo, action.payload], 
            };
    }
};

export default Reducer;