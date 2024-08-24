import React from 'react'
import "./ChatMessage.css";
import { Context } from 'context/Context';
import { useContext } from 'react';
import MessageSender from 'components/MessageSender/MessageSender';
import MessageReceiver from 'components/MessageReceiver/MessageReceiver';
import { useEffect, memo } from 'react';
import { format } from 'timeago.js';
import axios from 'axios';
import { useState } from 'react';
import { useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import URL from 'config/config';
import {formatTime} from '../../config/reserveArr';
import {storage} from '../../firebase';
import { baseUrl } from 'config/configUrl';

function ChatMessage({messages, currentChat, setMessages, setLastMessage}) {
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const [friend, setFriend] = useState(null);
    const { user, socket, accessToken } = useContext(Context);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const listMessageRef = useRef();
    const inputChatRef = useRef();
    const PF = URL.urlNoAvatar;
    const [images, setImages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [textReply, setTextReply] = useState("");
    const [nameReply, setNameReply] = useState("");
    const receivedId = currentChat.members.find(member => member !== user?._id);

    useEffect(() => {
        socket?.emit("addUser", user?._id);
        
    }, [user?._id])

    // setup tin nhắn đến
    useEffect(() => {
        socket?.on("getMessage", data => {
            setArrivalMessage(data);         
        })     
    }, [])

    // lấy tin nhắn
    useEffect(() => {
        socket?.on('typingToClient', ({senderId, typing}) => {
            if (currentChat?.members.includes(senderId)) {
                 setIsTyping(typing);
            } else {
                setIsTyping(false);
            }
        });
        
        arrivalMessage &&
        currentChat?.members.includes(arrivalMessage?.senderId?._id) &&
        setMessages((prev) => [...prev, arrivalMessage]);

        // tin nhắn lastMessage
        const newLastMessage = {
            messageLast: arrivalMessage?.url.length>0 ? "Gửi file đính kèm" : arrivalMessage?.content,
            senderId: arrivalMessage?.senderId?._id,
            conversationId: arrivalMessage?.conversationId,
            updatedAt: arrivalMessage?.updatedAt,
            // isRead: arrivalMessage?.conversationId === currentChat?._id ? true : false,
        }
        arrivalMessage &&
        setLastMessage(newLastMessage);
        console.log(newLastMessage);

        
    }, [arrivalMessage, currentChat])



    // lấy thông tin của bạn bè trong currentChat
    useEffect(() => {
        const friendId = currentChat?.members.find((m) => m !== user?._id);
        const getUser = async () => {
            try {
                const res = await axios.get( baseUrl + `/users/profile/${friendId}`, {
                    headers: {
                        Authorization: 'Bearer ' + accessToken
                      }
                });
                setFriend(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [currentChat])

    // lăn chuột đến cuối hộp chat
    useEffect(() => {
        listMessageRef.current?.scrollIntoView({block: "end"});
        // listMessageRef.current?.scrollTop = listMessageRef.current?.scrollHeight;
    }, [messages])

    // gửi tin nhắn
    const handleSubmitFormSendMessage = async (e) => {
        e.preventDefault();
        // tin nhắn đưa lên database
        const message = {
            senderId: user?._id,
            conversationId: currentChat?._id,
            content: newMessage,
            typeMessage: images.length>0 ? "image" : "text",
            url: [...images],
            isReply: isReply,
            contentReply: textReply,
            personIdReply: nameReply,
        }

        // tin nhắn lastMessage
        const newLastMessage = {
            messageLast: images.length>0 ? "Gửi file đính kèm" : newMessage,
            senderId: user?._id,
            conversationId: currentChat?._id,
            updatedAt: Date.now(),
            // isRead: true,
        }
        setLastMessage(newLastMessage);

        const receivedId = currentChat?.members.find(member => member !== user?._id)
        
        if (newMessage || images){
            const res = await axios.post( baseUrl + `/messages/`, message);
            const m = {
                ...res.data,
                senderId: {
                    _id: user?._id,
                    username: user?.username,
                }
            };
            setMessages([...messages, m]);
            await axios.put( baseUrl + `/conversations/${currentChat?._id}`, {
                messageLast: images.length > 0 ? "Đã gửi file đính kèm" : newMessage,
                senderId: user?._id
            })          
            socket?.emit('sendMessage', {
                m,
                receivedId,
            });
            setNewMessage("");
            setImages([]);
            setIsReply(false);
        }
    }

    // thêm emoji
    const onEmojiClick = (event, data) => {
        let m = newMessage;
        m += data.emoji;
        setNewMessage(m)
    }

    
    
    // chọn ảnh để gửi
    const handleChooseImage = (e) => {
        let files = [...e.target.files];
        let newImages = [...images];
        var date = Date.now();
        var date1 = formatTime(date);
        files.forEach(file => {     
            console.log(file);
            if (file.size <= 10000000) {
                const uploadTask = storage.ref(`imageChat/${currentChat?._id}/${user?._id},${user?.username}/${date1}/${file.name}`).put(file);
                uploadTask.on('state_changed', 
                    (snapshot) => {}, 
                    (error) => { alert(error)}, 
                    () => {
                        // complete function ....
                        storage.ref(`imageChat/${currentChat?._id}/${user?._id},${user?.username}/${date1}`).child(file.name).getDownloadURL().then(url => {
                            if (file.type.includes('image')) {
                                console.log("image");
                                newImages.push({typeDoc: 'image', urlDoc: url, nameDoc: file.name});
    
                            } else if (file.type.includes('video')) {
                                console.log('video');
                                newImages.push({typeDoc: 'video', urlDoc: url, nameDoc: file.name});
    
                            } else {
                                console.log("document");
                                newImages.push({typeDoc: 'document', urlDoc: url, nameDoc: file.name});
                            }
                            setImages([...newImages]);
                        })
                    });
            }  else {
                alert("File bạn muốn gửi quá lơn. Bạn chỉ được phép gửi file có size nhỏ hơn 10MB.")
            }
        });
    }

    // delete image is selected
    const handleRemoveImageItem = (index) => {
        let newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

    }
     
    // khi người dùng đang gõ phím thì gửi typing đến cho người kia
    const handleTyping = () => {

        setIsOpenEmoji(false);
        const receivedId = currentChat.members.find(member => member !== user?._id);
        socket?.emit('typing', {
            senderId: user?._id,
            receivedId,
            typing: true,
        });
    }
    // khi người dùng thôi gõ phím
    const handleNotTyping = () => {
        const receivedId = currentChat.members.find(member => member !== user?._id);
        socket?.emit('typing', {
            senderId: user?._id,
            receivedId,
            typing: false,
        });
    }

    // khi người dùng nhập text 
    const handleChangeTextChat = (e) => {
        setNewMessage(e.target.value);
    }



    return (       
            <div>
                <div className="chat-center-1">
                    <div className="chat-center-1-infoUser">
                        <div className="chat-center-1-infoUser-img">
                            <Link to={`/profile/${friend ? friend?._id : ""}`} style={{textDecoration: "none", color: "black"}}><img src={friend?.avatar ? friend?.avatar : (PF)} alt="image" /></Link>
                            {/* <i className="fas fa-circle"></i> */}
                        </div>
                        <div className="chat-center-1-infoUser-name">
                            <Link to={`/profile/${friend ? friend._id : ""}`} style={{textDecoration: "none", color: "black"}}><b>{friend && friend?.username}</b> <br/></Link>
                            {/* <span>Đang hoạt động</span> */}
                        </div>
                    </div>
                    <div className="chat-center-1-call-call">
                        {/* <i className="fas fa-video"></i> */}
                    </div>
                </div>
                <div className="chat-center-2">
                    <div className="chat-center-2-container" >
                        <div className="chat-center-2-infoUser">
                            <img src={friend?.avatar ? friend?.avatar : (PF)} alt="image"/>
                            <h3>{friend && friend.username}</h3>
                            <p>Tham gia từ <b>{friend && format(friend.createdAt)}</b> trước.</p>
                        </div>
                        <div className="chat-center-2-listMessage">
                            {messages && messages.map((message, index) => 
                                <div key={index} ref={listMessageRef}>
                                    {message?.senderId?._id === user?._id 
                                    ? <MessageSender message={message} receivedId={receivedId} setIsReply={setIsReply} setNameReply={setNameReply} setTextReply={setTextReply} /> 
                                    : <MessageReceiver message={message} setIsReply={setIsReply} setNameReply={setNameReply} setTextReply={setTextReply} />}
                                </div>
                            )}    
                        </div>
                        <div className="typing">
                            {isTyping && 
                                <div className="balls">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>}
                        </div>                       
                    </div>
                </div>
                <div className="chat-center-3">

                    {(images.length > 0) && 
                        <div 
                            className="chat-center-3-top" 
                            style={{height: images.length > 0 ? "100px" : "70px"}}
                        >
                            {images.length>0 && images.map((image,index) => (
                                <div className="chat-center-3-top-item" key={index} >
                                    {image.typeDoc==="image" && <img src={image.urlDoc} />}  
                                    {image.typeDoc==="video" && 
                                        <video autoPlay={false} controls>
                                            <source src={image.urlDoc}></source>
                                        </video>
                                    } 
                                    {image.typeDoc==="document" && 
                                        <div className="documentUpload">
                                            <div className="documentUpload-icon">
                                                <i className="fad fa-file-alt"></i>
                                            </div>
                                            
                                            <p>{image?.nameDoc.length > 25 ? image?.nameDoc.slice(0,25) + "..." : image?.nameDoc}</p>
                                        </div>
                                    }

                                    <i 
                                        className="fas fa-times-circle removeDoc"
                                        onClick={() => handleRemoveImageItem(index)}
                                    >
                                    </i>                       
                                </div>
                            ))}
                        </div>}

                    {isReply && <div className="chat-center-3-reply">
                        <div className="chat-center-3-reply-icon" onClick={() => setIsReply(false)}>
                            <i className="fas fa-times"></i>
                        </div>
                        <div className="chat-center-3-reply-text">
                            <p>Đang trả lời <b style={{color: 'black'}}>{nameReply}</b>:</p>
                            <p>{textReply}</p>               
                        </div>
                    </div>}

                    <div className="chat-center-3-bottom">
                        <div className="chat-center-3-micro chat-center-3-itemIcon">
                            <><i className="fas fa-microphone" data-tip="Gửi voice chat"></i><ReactTooltip place="bottom" type="dark" effect="solid"/></>
                        </div>
                        <div className="chat-center-3-file chat-center-3-itemIcon">
                            <div className="chat-center-3-file-icon">
                                <label htmlFor="chooseImageToSend">
                                    <i className="fas fa-paperclip" data-tip="Gửi ảnh, video, file"></i>
                                    <ReactTooltip place="bottom" type="dark" effect="solid" />
                                </label>
                                <input 
                                    type="file" 
                                    id="chooseImageToSend" 
                                    style={{display: "none"}} 
                                    onChange={handleChooseImage}
                                    multiple
                                />
                            </div>               
                        </div>
                        
                        <form className="chat-center-3-input" onSubmit={handleSubmitFormSendMessage} >
                            <input type="text" 
                                ref={inputChatRef} 
                                placeholder="Nhập tin nhắn muốn gửi" 
                                onChange={(e) => handleChangeTextChat(e)} 
                                value={newMessage} 
                                onFocus={handleTyping} 
                                onBlur={handleNotTyping}
                                // onClick={handlePressKey}
                                // onKeyPress={handlePressKey}
                            />
                        </form>
                        <div className="chat-center-3-emoji chat-center-3-itemIcon">
                            <><i className="fas fa-smile" data-tip="Gửi biểu tượng cảm xúc" onClick={()=> setIsOpenEmoji(!isOpenEmoji)}></i><ReactTooltip place="bottom" type="dark" effect="solid"/></>
                            {isOpenEmoji && <div className="chat-center-3-picker">
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>}
                        </div>
                        <div className="chat-center-3-emoji chat-center-3-itemIcon">
                            <><i className="fas fa-paper-plane" data-tip="Nhấn để gửi tin nhắn" onClick={handleSubmitFormSendMessage}></i><ReactTooltip place="bottom" type="dark" effect="solid"/></>                   
                        </div>
                        </div>
                    </div>
            </div>
    )
}

export default memo(ChatMessage);


