import React, { useContext } from 'react';
import "./Leftbar.css";
import { Context } from 'context/Context';
import { Link } from 'react-router-dom';
import URL from 'config/config';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from 'config/configUrl';

function Leftbar() {
    const PF = URL.urlNoAvatar;
    const { user, socket} = useContext(Context);
    const [listNoti, setListNoti] = useState([]);

    useEffect(() => {
        const fetchNoti = async () => {
            const res = await axios.get(baseUrl + `/notifications/getNotification/${user?._id}`);
            // const list = res.data;
            const list = [...listNoti];
            res.data.forEach( (noti) => {
                if (!noti.readNotiId.includes(user?._id) && !noti.deleteNotiId.includes(user?._id)) {
                    list.push(noti); 
                }
            });
            setListNoti(list);
        }
        fetchNoti();
    }, [user?._id])
    useEffect(() => {
        socket?.on("createPostToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
        });
        socket?.on("likePostNotiToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
        });
        socket?.on("commentPostNotiToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
        })
        socket?.on("replyCommentPostNotiToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
        })
        socket?.on("likeCommentNotiToClient", (noti) => {
            let newNoti = [...listNoti];
            newNoti.push(noti);
            setListNoti(newNoti);
        })
    }, [listNoti]) 

    return (
        <div className="leftbar">
            <Link to={`/profile/${user?._id}`} style={{textDecoration: "none"}} className="leftbar-item image">
                <img src={user?.avatar ? (user?.avatar) : (PF)} />
                <span>{user?.username}</span>
            </Link>
            <div className="leftbar-top">
                <Link to="/" style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-home"></i>
                    <span>Trang chủ</span>
                </Link>
                <Link to="/notification" style={{textDecoration: "none"}} className="leftbar-item">
                    <div className="leftbar-item-div">
                        <i className="fas fa-bell"></i>
                        {listNoti.length > 0 && <strong>
                            {listNoti.length > 99 ? "99+" : listNoti.length}
                        </strong>}
                    </div>
                    <span>Thông báo</span>
                </Link>
                <Link to="/alluser" style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-user-friends"></i>
                    <span>Người dùng</span>
                </Link>
                <Link to="/chat" style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-comments"></i>
                    <span>Tin nhắn</span>
                </Link>
                <Link to="/postSaved" style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-bookmark"></i>
                    <span>Đã lưu</span>
                    {user?.postSaved.length > 0 && <strong>
                        {user?.postSaved.length > 20 ? "20+" : user?.postSaved.length}
                    </strong>}
                </Link>
        
            </div>
            <div className="leftbar-bottom">
                <p>Những chủ đề bài viết mà bạn quan tâm</p>
                <Link to={`/postthemen?themen=Thế giới`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-globe-americas"></i>
                    <span>Thế giới</span>
                </Link>
                <Link to={`/postthemen?themen=Khoa học công nghệ`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-user-astronaut"></i>
                    <span>Khoa học, Công nghệ</span>
                </Link>
                <Link to={`/postthemen?themen=Giáo dục`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-school"></i>
                    <span>Giáo dục</span>
                </Link>
                <Link to={`/postthemen?themen=Văn hóa`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-skiing-nordic"></i>
                    <span>Văn hóa</span>
                </Link>
                <Link to={`/postthemen?themen=Y tế`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-hospital-user"></i>
                    <span>Y tế</span>
                </Link>
                <Link to={`/postthemen?themen=Giải trí`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-person-booth"></i>
                    <span>Giải trí</span>
                </Link>
                <Link to={`/postthemen?themen=Du lịch`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-plane-departure"></i>
                    <span>Du lịch</span>
                </Link>
                <Link to={`/postthemen?themen=Sức khỏe`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-hands-heart"></i>
                    <span>Sức khỏe</span>
                </Link>
                <Link to={`/postthemen?themen=Thể thao`} style={{textDecoration: "none"}} className="leftbar-item">
                    <i className="fas fa-futbol"></i>
                    <span>Thể thao</span>
                </Link>
            </div>
            <div className="leftbar-text">
                <span>SocialTNT@2021. Đã đăng kí bản quyền.</span>
            </div>
            
            
        </div>
    );
}

export default Leftbar;