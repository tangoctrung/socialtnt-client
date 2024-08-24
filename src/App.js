import './App.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import PostDetail from './pages/PostDetail/PostDetail';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from 'context/Context';
import AllUser from 'pages/AllUser/AllUser';
import Chat from 'pages/Chat/Chat';
import PostSaved from 'pages/PostSaved/PostSaved';
import PostCondition from 'pages/PostCondition/PostCondition';
import PostThemen from 'pages/PostThemen/PostThemen';
import Notification from 'pages/Notification/Notification';
import NotificationFast from 'components/NotificationFast/NotificationFast';
import audioUrl from "../src/sound/SendMessage.wav";
import { useRef } from 'react';
import { baseUrl } from 'config/configUrl';
import ModalCallVideo from 'pages/ModalCallVideo/ModalCallVideo';
import URL from 'config/config';
import ChangePassword from 'pages/ChangePassword/ChangePassword';

function App() {
    const audioRef = useRef();
    const { user, socket, accessToken, dispatch } = useContext(Context);
    const [isNotiCreatePost, setIsNotiCreatePost] = useState(false);
    const [listNoti, setListNoti] = useState([]);
    const [isCall, setIsCall] = useState(false);
    const [dataCall, setDataCall] = useState();
    const PF = URL.urlNoAvatar;

    // kiểm tra xem có người gọi đến ko
    useEffect(() => {
        socket?.on("createCallVideoToClient", (dataCall) => {
            setDataCall(dataCall);
            console.log(dataCall);
        })
    }, [])

    // thông báo createPost, likePost, commentPost
    useEffect(() => {
        socket?.on("createPostToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
            setIsNotiCreatePost(true);
            audioRef?.current?.play();
        });
        socket?.on("likePostNotiToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
            setIsNotiCreatePost(true);
            audioRef?.current?.play();
        });
        socket?.on("commentPostNotiToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
            setIsNotiCreatePost(true);
            audioRef?.current?.play();
        })
        socket?.on("replyCommentPostNotiToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
            setIsNotiCreatePost(true);
            audioRef?.current?.play();
        })
        socket?.on("likeCommentNotiToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
            setIsNotiCreatePost(true);
            audioRef?.current?.play();
        })
    }, [])   

    // thời gian hiện thị thông báo
    setTimeout(()=>{ 
        if(isNotiCreatePost) {
            setIsNotiCreatePost(false);
        }
    }, 5000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( async () => {
        if (accessToken) {
            const res = await axios.get( baseUrl + '/auth/', {
                headers: {
                  Authorization: 'Bearer ' + accessToken //the token is a variable which holds the token
                }
            });
            dispatch({type: "NO_LOGIN", payload: res.data});
        }
    }, []);

    // click vào thông báo nhanh
    const handleClickNotiFast = async (noti, index) => {
        const dataNoti = {
            userId: user?._id,
            notiId: noti?._id
        }
        await axios.put( baseUrl + `/notifications/updateNotification`, dataNoti);
    }

    // từ chối cuộc gọi đến
    const handleRefuse = () => {
        setDataCall(null);
    }

    // chấp nhận cuộc gọi đến
    const handleAccept = () => {
        // http://localhost:3000/callvideo
        // https://socialtnt.netlify.app/callvideo
        var popup = window.open('http://localhost:3000/callvideo',"myWindow", "width=1200,height=1100");
        setDataCall(null);
    }
    

  return (
    <div className="App">
        <Router>         
            <audio controls style={{display: 'none'}} ref={audioRef}>
                <source src={audioUrl} type="audio/mpeg" />
            </audio>
            <Switch>
                <Route path="/" exact>
                    <Navbar />
                    {accessToken ? <HomePage /> : <Login />}    
                </Route>
                <Route path="/post/:id" exact>
                    <Navbar />
                    {accessToken ? <PostDetail /> : <Login />} 
                </Route>
                <Route path="/profile/:id" exact>
                    <Navbar />
                    {accessToken ? <Profile /> : <Login />} 
                </Route>
                <Route path="/login" exact>
                    <Navbar />
                    <Login />
                </Route>
                <Route path="/changepassword" exact>
                    <Navbar />
                    <ChangePassword />
                </Route>
                <Route path="/register" exact>
                    <Navbar />
                    <Register />
                </Route>
                <Route path="/alluser" exact>
                    <Navbar />   
                    {accessToken ? <AllUser /> : <Login />} 
                </Route>
                <Route path="/chat" exact>
                    <Navbar />
                    {accessToken ? <Chat /> : <Login />} 
                </Route>
                <Route path="/chat/:id" exact>
                    <Navbar />
                    {accessToken ? <Chat /> : <Login />} 
                </Route>  
                <Route path="/callvideo" exact>              
                    {accessToken ? <ModalCallVideo /> : <Login />} 
                </Route>       
                <Route path="/postsaved" exact>
                    <Navbar />
                    {accessToken ? <PostSaved /> : <Login />} 
                </Route>
                <Route path="/postcondition" exact>
                    <Navbar />
                    {accessToken ? <PostCondition /> : <Login />} 
                </Route>
                <Route path="/postthemen" exact>
                    <Navbar />
                    {accessToken ? <PostThemen /> : <Login />} 
                </Route>
                <Route path="/notification" exact>
                    <Navbar />
                    {accessToken ? <Notification /> : <Login />} 
                </Route>
            </Switch>
            {isNotiCreatePost && accessToken &&
                    <div className="homePage-noti">
                        {listNoti && listNoti.map( (noti, index) => (
                            <div key={index} onClick={() => handleClickNotiFast(noti, index)}>
                                <NotificationFast noti={noti} />
                            </div>
                        ))}
                    </div>}
            {dataCall && accessToken &&
                <div className="homePage-modalCal">
                    <div className="homePage-modalCal-content">
                        <p>Bạn có một cuộc gọi đến</p>
                        <div className="homePage-modalCal-content-img">
                            <img src={dataCall?.sender?.avatar ? dataCall?.sender?.avatar : PF} /> <br/>
                        </div>
                        <strong>{dataCall?.sender?.username}</strong> <br/>
                        <div className="homePage-modalCal-content-button">
                            <button onClick={handleAccept}>Nghe</button>
                            <button onClick={handleRefuse}>Từ chối</button>
                        </div>
                    </div>
                </div>
            }
        </Router>
      
    </div>
  );
}

export default App;
