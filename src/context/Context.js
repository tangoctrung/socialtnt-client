import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { io } from "socket.io-client";
import Reducer from "./Reducer";
import { env } from "config/configUrl";

// https://socialtnt.herokuapp.com
// http://localhost:8800
const INITIAL_STATE = {
  user: null,
  isFetching: false,
  isLoadPost: false,
  socket : io(env === "local" ? "http://localhost:8800" : "https://socialtnt-server.onrender.com"),
  error: false,
  accessToken: JSON.parse(localStorage.getItem("accessToken")) || null,
  messagesCallVideo: [],
};
// JSON.parse(localStorage.getItem("user")) || 
export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  useEffect(()=> {
    // localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("accessToken", JSON.stringify(state.accessToken));
  }, [state?.user]);

  useEffect( async () => {
    if (state.accessToken) {
        const res = await axios.get('/auth/', {
            headers: {
              Authorization: 'Bearer ' + state.accessToken //the token is a variable which holds the token
            }
        });
        state.user = res.data;
    }
  }, []);

  return (   
      <Context.Provider
        value={{
          user: state.user,
          socket: state.socket,
          isFetching: state.isFetching,
          error: state.error,
          accessToken: state.accessToken,
          dispatch,
          messagesCallVideo: state.messagesCallVideo,
        }}
      >
        {children}
      </Context.Provider>
  );
};
