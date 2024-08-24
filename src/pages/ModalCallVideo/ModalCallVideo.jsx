import React from 'react';
import { useState } from 'react';
import './ModalCallVideo.css';
import avatar from '../../image/avatar.jpg';
import { useRef } from 'react';
import { useEffect } from 'react';
import { Context } from 'context/Context';
import { useContext } from 'react';
import { baseUrl } from "../../config/configUrl";
import axios from "axios";
import URL from 'config/config';
import { format } from "timeago.js";

function ModalCallVideo() {

    const [followings, setFollowings] = useState([]);
    const [noFollowings, setNoFollowings] = useState([]);
    const { user, accessToken, dispatch, socket, messagesCallVideo } = useContext(Context);
    const PF = URL.urlNoAvatar;

    const inputChatRef = useRef();
    const listMessage = useRef();

    const [isMic, setIsMic] = useState(false);
    const [isCamera, setIsCamera] = useState(false);

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
  
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    // console.log(messagesCallVideo);

    // lăn chuột đến cuối cuộc trò chuyện
    useEffect(() => {
        listMessage?.current?.scrollIntoView({behavior: "smooth"});
    }, [messagesCallVideo]);

    // Lấy thông tin các following
    useEffect(() => {
        const fetchFollowings = async () => {
            const res = await axios.get(baseUrl + `/users/profile/followings/${user?._id}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });
            setFollowings(res.data);
        };
        fetchFollowings();
    }, [user]);

    // Lấy thông tin các user mà người dùng chưa follow
    useEffect(() => {
        const fetchFollowings = async () => {
            const res = await axios.get(baseUrl + `/users/nofollowings/${user?._id}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });
            setNoFollowings(res.data);
        };
        fetchFollowings();
    }, [user]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                console.log(currentStream);
                setStream(currentStream);
                if (isCamera) myVideo.current.srcObject = currentStream;
                // else myVideo.current.srcObject = null;
            });
        

    }, [isCamera]);

    // stop only camera
    function stopVideoOnly(stream) {
        stream.getTracks().forEach(function(track) {
            if (track.readyState == 'live' && track.kind === 'video') {
                track.stop();
            }
        });
    }

    // stop only mic
    function stopAudioOnly(stream) {
        stream.getTracks().forEach(function(track) {
            if (track.readyState == 'live' && track.kind === 'audio') {
                track.stop();
            }
        });
    }

    // send message
    const handleSendMessage = (e) => {
        e.preventDefault();
        const message = {
            content: inputChatRef.current.value,
            sender: {
                _id: user?._id,
                username: user?.username,
                avatar: user?.avatar,
            },
            updated: Date.now(),
            receiver: [],
            conversationId: "",
        };
        if (message.content !== '') {
            dispatch({type: "SEND_MESSAGE_GROUP", payload: message});
        }

        inputChatRef.current.value="";
        inputChatRef.current.focus();
    }

    // tạo mộ cuộc gọi video 
    const handleSetCall = (infoUser) => {
        console.log(infoUser);
        const dataCall = {
            sender: {
                _id: user?._id,
                username: user?.username,
                avatar: user?.avatar,
            },
            receiver: {
                username: infoUser?.username,
                avatar: infoUser?.avatar,
                _id: infoUser?._id,
            },
            updated: Date.now(),
            conversationId: "",
        }
        console.log(dataCall);
        console.log(socket);
        socket?.emit('createCallVideo', dataCall);
    }

    return (
        <div className="modalCallVideo">
            <div className="modalCallVideo-top">
                <div className="modalCallVideo-top-left">
                    <div className="modalCallVideo-listVideo">
                        <div className="modalCallVideo-itemVideo">
                             <video playsInline muted ref={myVideo} autoPlay />
                             {!isCamera && 
                                <>
                                    <img src={avatar} />
                                    <p>Camera đang tắt</p>
                                </>}
                        </div>
                        <div className="modalCallVideo-itemVideo">
                        
                        </div>
                    </div>
                    <div className="modalCallVideo-listMenu">
                        <div className="item-mic listItem_menu">
                            {isMic ? <i className="fas fa-microphone" onClick={()=> {setIsMic(false); stopAudioOnly(stream);}} /> : 
                            <i className="fas fa-microphone-slash odd"onClick={()=> setIsMic(true)} />}                         
                        </div>
                        <div className="item-camera listItem_menu">
                            {isCamera ? <i className="fas fa-webcam" onClick={()=> {setIsCamera(false); stopVideoOnly(stream);}} /> : 
                            <i className="fas fa-webcam-slash odd" onClick={()=> setIsCamera(true)} />}                        
                        </div>
                    </div>
                </div>
                <div className="modalCallVideo-top-right">
                    <h3>Bạn có thể nhắn tin ở đây</h3>
                    <div className="modalCallVideo-chat">
                        <div className="modalCallVideo-listMessage" >
                            <div className="modalCallVideo-itemMessage">
                                <div className="itemMessage-avatar">
                                    <img src={avatar} />
                                </div>
                                <div className="itemMessage-message">
                                    <strong>Tạ Ngọc Trung</strong> <span>3 phút trước</span>
                                    <p>Hello</p>                       
                                </div>
                            </div>
                            <div className="modalCallVideo-itemMessage sender">
                                <div className="itemMessage-message senderColor">
                                    <div className="itemMessage-message-top">
                                        <span>3 phút trước</span><strong>You </strong>
                                    </div>
                                    <p>A</p>                       
                                </div>
                            </div>                          
                            {messagesCallVideo && messagesCallVideo.map((message, index) =>  (
                                message?.sender?._id === user?._id ?
                                <div className="modalCallVideo-itemMessage sender" ref={listMessage}>
                                    <div className="itemMessage-message senderColor">
                                        <div className="itemMessage-message-top">
                                            <span style={{marginRight: '5px', display: 'inline-block'}}>{format(message.updated)} </span><strong> You </strong>
                                        </div>
                                        <p>{message.content}</p>                       
                                    </div>
                                </div>
                            :
                                <div className="modalCallVideo-itemMessage" key={index} ref={listMessage}>
                                    <div className="itemMessage-avatar">
                                        <img src={avatar} />
                                    </div>
                                    <div className="itemMessage-message">
                                        <strong>{message?.sender?.username}</strong> <span>{format(message.updated)}</span>
                                        <p>{message.content}</p>                       
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form className="modalCallVideo-inputSend" onSubmit={handleSendMessage}>
                            <div className="modalCallVideo-input">
                                <input ref={inputChatRef} type="text" placeholder="Nhập gì đó để gửi..." />
                            </div>
                            <div className="modalCallVideo-Send">
                                <i className="fas fa-paper-plane"></i>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modalCallVideo-bottom">
                <div className="modalCallVideo-bottom-left">
                    <p>Bạn có thể tham gia một cuộc nói chuyện video bằng mã</p>
                    <input type="text" placeholder="Nhập mã cuộc nói chuyện" /> <br/>
                    <button>Tham gia</button>
                </div>
                <div className="modalCallVideo-bottom-right">
                    <div className="modalCallVideo-addMember">
                        <p>Bạn có thể gọi/mời ai đó tham gia cuộc nói chuyện</p>
                        <input type="text" placeholder="Tìm kiếm theo tên/email" />
                    </div>
                    <div className="modalCallVideo-listMember">
                        <div className="modalCallVideo-listMember-left">
                            <p>Những người bạn đang theo dõi</p>
                            <div className="modalCallVideo-listMemberFollowing">
                                {followings && followings?.map((following, index) => (
                                    <div className="modalCallVideo-itemMember" key={index}>
                                        <div className="modalCallVideo-itemMember-img">
                                            <img src={following.avatar !== '' ? following.avatar : PF} />
                                        </div>
                                        <div className="modalCallVideo-itemMember-name">
                                            <p>{following?.username.length <= 20 ? following?.username : 
                                            following?.username.slice(0, 20) + '...'}</p>
                                        </div>
                                        <div className="modalCallVideo-itemMember-button">
                                            <button onClick={() => handleSetCall(following)}>Gọi</button>
                                        </div>   
                                    </div>
                                ))}
                                {followings.length ===0 && 
                                <span>Không tìm thấy :((</span>}
                            </div>
                        </div>
                        <div className="modalCallVideo-listMember-right">
                            <p>Những người bạn có thể biết</p>
                            <div className="modalCallVideo-listMemberFollowing">
                                {noFollowings && noFollowings?.map((following, index) => (
                                    <div className="modalCallVideo-itemMember" key={index}>
                                        <div className="modalCallVideo-itemMember-img">
                                            <img src={following.avatar !== '' ? following.avatar : PF} />
                                        </div>
                                        <div className="modalCallVideo-itemMember-name">
                                            <p>{following?.username.length <= 20 ? following?.username : 
                                            following?.username.slice(0, 20) + '...'}</p>
                                        </div>
                                        <div className="modalCallVideo-itemMember-button">
                                            <button onClick={() => handleSetCall(following)}>Gọi</button>
                                        </div>                                       
                                    </div>
                                ))}
                                {noFollowings.length ===0 && 
                                <span>Không tìm thấy :((</span>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCallVideo;
