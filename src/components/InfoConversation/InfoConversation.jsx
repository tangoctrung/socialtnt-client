import React from 'react'
import "./InfoConversation.css";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { Context } from 'context/Context';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import URL from 'config/config';
import { baseUrl } from 'config/configUrl';

function InfoConversation ({currentChat, messages}) {
    const [settingChat, setSettingChat] = useState(0);
    const [friend, setFriend] = useState(null);
    const { user, accessToken } = useContext(Context);
    const [listUrl, setListUrl] = useState([]);
    const PF = URL.urlNoAvatar;

    useEffect(() => {
        const friendId = currentChat && currentChat.members.find((m) => m !== user?._id);
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

        const getUrlMessage = async () => {

        }
        getUrlMessage();
    }, [currentChat]);

    useEffect(() => {
        let Urls = [];
        messages?.map(message => {
            !message?.isDelete && message?.url?.map(url => {
                Urls.push(url);
            })
        });
        setListUrl(Urls);
    }, [messages]);

    return (
        <div className="chat-right-container">
            <div className="chat-right-1">
                    <div className="chat-right-1-img">
                        {friend && <Link 
                        to={`/profile/${friend && friend._id}`} 
                        style={{textDecoration: "none", color: "black"}}
                        >
                            <img 
                                src={friend.avatar ? friend.avatar : (PF)} 
                                alt="image" 
                                data-tip={`Đi đến trang cá nhân của ${friend?.username}`}
                            ></img>
                            <ReactTooltip place="bottom" type="dark" effect="solid"/>
                        </Link>}
                    </div>
                    <div className="chat-right-1-info">
                        {friend && <Link 
                        to={`/profile/${friend && friend._id}`} 
                        style={{textDecoration: "none", color: "black"}}
                        >
                            <p>{friend ? friend.username : ""}</p>   
                        </Link> }                  
                    </div>
            </div>
            <div className="chat-right-2">
                {friend && 
                    <>
                        <div className="chat-right-2-selection">
                            <div className="chat-right-2-selection-1">
                                <div className={settingChat !== 1 ? "chat-right-2-list-1" : "chat-right-2-list-1 isActive"} onClick={()=> setSettingChat(1)}>
                                    <i className="fas fa-film"></i>  
                                    <span> Chủ đề</span>
                                </div>
                                <div className={settingChat !== 2 ? "chat-right-2-list-1" : "chat-right-2-list-1 isActive"} onClick={()=> setSettingChat(2)}>
                                    <i className="fas fa-wrench"></i>  
                                    <span> Cài đặt</span>
                                </div>
                            </div>
                            <div className="chat-right-2-selection-2">
                                <div className={settingChat !== 3 ? "chat-right-2-list-1" : "chat-right-2-list-1 isActive"} onClick={()=> setSettingChat(3)}>
                                    <i className="fas fa-photo-video"></i>  
                                    <span> Hình ảnh, video</span>
                                </div>
                                <div className={settingChat !== 4 ? "chat-right-2-list-1" : "chat-right-2-list-1 isActive"} onClick={()=> setSettingChat(4)}>
                                    <i className="fas fa-paperclip"></i>  
                                    <span> Tệp</span>
                                </div>
                                <div className={settingChat !== 5 ? "chat-right-2-list-1" : "chat-right-2-list-1 isActive"} onClick={()=> setSettingChat(5)}>
                                    <i className="fas fa-link"></i>  
                                    <span> Liên kết</span>
                                </div>
                            </div>
                        </div>
                        <div className="chat-right-2-content">  
                            {settingChat === 3 && listUrl?.map(url => (
                                <>
                                    {url.typeDoc === "image" && 
                                        <div className="chat-right-2-content-image">
                                            <img src={url.urlDoc} alt="image" />
                                        </div>
                                    } 
                                    {url.typeDoc === "video" && 
                                        <div className="chat-right-2-content-video">
                                            <video autoPlay={false} controls>
                                                <source src={url.urlDoc} ></source>
                                            </video>
                                        </div>
                                    } 

                                </>
                            ))}    
                            {settingChat === 4 && listUrl?.map(url => (
                                <>
                                    {url.typeDoc === "document" && 
                                        <div className="chat-right-2-content-doc">
                                            <a href={url.urlDoc}>
                                                <i className="fad fa-file-alt"></i>
                                                <p>{url.nameDoc}</p>
                                            </a>
                                        </div>
                                    } 
                                </>
                            ))}                   
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default InfoConversation;

