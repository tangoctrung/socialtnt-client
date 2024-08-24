export const LoginStart = (userCredentials) => ({
    type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user,
});

export const LoginFailure = () => ({
    type: "LOGIN_FAILURE",
});

export const UpdateStart = (userCredentials) => ({
    type: "UPDATE_START",
});

export const UpdateSuccess = (user) => ({
    type: "UPDATE_SUCCESS",
    payload: user,
});

export const UpdateFailure = () => ({
    type: "UPDATE_FAILURE",
});

export const Logout = () => ({
    type: "LOGOUT",
});

export const Follow = (userId) => ({
    type: "FOLLOW",
    payload: userId,
});
  
export const Unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId,
});

export const SavePost = (postId) => ({
    type: "SAVEPOST",
    payload: postId,
});
  
export const UnSavePost = (postId) => ({
    type: "UNSAVEPOST",
    payload: postId,
});

export const SearchHistory = (history) => ({
    type: "SEARCH_HISTORY",
    payload: history,
});

export const DeleteHistory = (history) => ({
    type: "DELETE_HISTORY",
    payload: history,
});

export const SearchStart = () => ({
    type: "SEARCH_START",
});

export const SearchSuccess = () => ({
    type: "SEARCH_SUCCESS",
});

export const SearchFailure = () => ({
    type: "SEARCH_FAILURE",
});

