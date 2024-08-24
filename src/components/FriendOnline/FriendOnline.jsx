import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { format } from 'timeago.js';
import "./FriendOnline.css";
import URL from 'config/config';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from 'context/Context';
import { baseUrl } from 'config/configUrl';

function FriendOnline({friendId}) {
    const { accessToken } = useContext(Context);
    const [friend, setFriend] = useState();
    const PF = URL.urlNoAvatar;

    useEffect( async () => {
        const resFriend = await axios.get( baseUrl + `/users/profile/${friendId}`, {
            headers: {
                Authorization: 'Bearer ' + accessToken
              }
        });
        setFriend(resFriend.data);
    }, [friendId])
    return (
        <div>
            {friendId && <div className="rightbar-item">
                    <Link to={`/profile/${friendId}`} style={{textDecoration: "none", color: "black"}}  className="rightbar-item-friend">
                        <div className="rightbar-item-friend-image">
                            <img src={friend?.avatar || (PF) } alt="Hình ảnh" />
                            <i className="fas fa-circle"></i>
                        </div>
                        <div className="rightbar-item-friend-name">
                            <b>{friend?.username}</b>
                        </div>
                    </Link>
                    <div className="rightbar-item-infoFriend">
                        <div className="rightbar-item-image">
                            <img src={friend?.avatar || (PF) } alt="Hình ảnh" />
                        </div>
                        <div className="rightbar-item-info">
                            <b>{friend?.username}</b>
                            <hr />
                            <span className="rightbar-item-info-span1"><i className="fas fa-user-friends"></i> Tham gia từ <b>{format(friend?.createdAt)}</b></span>
                            <span className="rightbar-item-info-span2"><i className="fas fa-map-marked-alt"></i> Đến từ <b>{friend?.hometown}</b></span>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default FriendOnline;