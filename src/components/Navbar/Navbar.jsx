import React, { useContext, useRef, useState } from 'react';
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Context } from 'context/Context';
import axios from 'axios';
import { format } from "timeago.js";
import URL from 'config/config';
import { Tooltip } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import { reserveArr } from "../../config/reserveArr";
import { baseUrl } from 'config/configUrl';

function Navbar() {
    const [isSearch, setIsSearch] = useState(false);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const { user, dispatch, isFetching, accessToken } = useContext(Context);
    const inputRef = useRef();
    const [searchs, setSearchs] = useState(user?.searchHistorys);
    const PF = URL.urlNoAvatar;
    
    const handleClickLogout = () => {
        dispatch({type: "LOGOUT"});
    }
    
    // MỞ Ô TÌM KIẾM
    const handleClickOpenFind = () => {
        setIsSearch(true);
        inputRef.current.focus();
    }
    // TẮT Ô TÌM KIẾM
    const handleClickCloseFind = () => {
        setIsSearch(false);
        inputRef.current.value = "";
    }
    const handleChangeFind = (e) => {
        
    }
    const handleSubmitFind =  (e) => {
        e.preventDefault();
        dispatch({ type: "SEARCH_START"});

        const fetchDataUserPost = async () => {
            const resUser = await axios.get( baseUrl + `/users?username=${inputRef.current.value}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
            });
            setUsers(resUser.data);
            const resPost = await axios.get( baseUrl + `/posts?hashtag=${inputRef.current.value}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
            });
            setPosts(resPost.data);
            await axios.put( baseUrl + "/users/addSearchHistory", {
                userId: user?._id,
                history: inputRef.current.value
            });
            const s = inputRef.current.value;
            let historys = [...user?.searchHistorys];
            if (!historys.includes(s)){
                historys.push(s);
                dispatch({ type: "SEARCH_HISTORY", payload: s });
            }
            dispatch({ type: "SEARCH_SUCCESS"});
        }
        fetchDataUserPost();
    }

    // KHI NGƯỜI DÙNG CLICK VÀO LỊCH SỬ TÌM KIẾM
    const handleClickHistory = (history) => {
        inputRef.current.value = history;
        inputRef.current.focus();
    }

    //KHI NGƯỜI DÙNG XÓA 1 LỊCH SỬ TÌM KIẾM
    const handleDeleteHistory = (history) => {
        let newHistory = [...user?.searchHistorys];
        const nh = newHistory.filter(h => h !== history);
        dispatch({ type: "DELETE_HISTORY", payload: history });
        const fetchDeleteHistory = async () => {
            await axios.put( baseUrl + "/users/deleteSearchHistory", {
                userId: user?._id,
                history: history,
            })
        }
        fetchDeleteHistory();
    }
    return (
        <>
            <div className="navbar">

                <div className="navbar-left">
                    <h2>SocialTNT</h2>
                </div>

                <div className="navbar-center">
                    {user && <>
                                <Link to="/" className="navbar-center-home">
                                    <Tooltip title="Trang chủ" placement={isSearch ? "left" : "bottom"} enterDelay={1000} arrow>
                                        <i className="fas fa-home"></i>
                                    </Tooltip>
                                </Link>
                                <div className="navbar-center-find">
                                    {!isSearch && 
                                        <Tooltip title="Tìm kiếm" placement={isSearch ? "left" : "bottom"} enterDelay={1000} arrow>
                                            <i className="fas fa-search" onClick={handleClickOpenFind}></i>                                           
                                        </Tooltip>
                                    }
                                    {isSearch && <i class="fas fa-times" onClick={handleClickCloseFind}></i>}
                                    <form className="navbar-center-form" style={{width: isSearch ? "350px" : "30px"}} onSubmit={handleSubmitFind}>
                                        <input ref={inputRef} onChange={handleChangeFind} placeholder="Tìm kiếm người dùng hoặc bài viết theo hashtag"/>
                                    </form>
                                </div>
                                <Link to={`/profile/${user?._id}`} className="navbar-center-noti">
                                    <Tooltip title="Trang cá nhân" placement={isSearch ? "left" : "bottom"} enterDelay={1000} arrow>
                                        <i className="fas fa-user-plus"></i>
                                    </Tooltip>
                                </Link>
                            </>}
                    
                </div>

                <div className="navbar-right">
                    {user && <>                               
                                <div className="navbar-right-profile">
                                    <div className="navbar-right-img">
                                        <img src={user?.avatar ? (user?.avatar) : (PF)} alt="image" />
                                        <div className="navbar-right-list">
                                            <div className="navbar-right-item">
                                                <i className="fas fa-cog"></i>
                                                <span>Cài đặt</span>
                                            </div>
                                            <div className="navbar-right-item">
                                                <Link to="/postSaved" style={{textDecoration: "none", color: 'black'}}>
                                                    <i className="fas fa-save"></i>
                                                    <span>Đã lưu</span>
                                                </Link>
                                            </div>                                         
                                            <div className="navbar-right-item" onClick={handleClickLogout}>
                                                <i className="fas fa-sign-out-alt"></i>
                                                <span>Đăng xuất</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>              
                            </>}
                    {!user && <>
                            <div className="navbar-Login-register">
                                <Link to="/login" className="navbar-login">
                                    <span>Đăng nhập</span>
                                </Link>
                                <Link to="/register" className="navbar-register">
                                    <span>Đăng kí</span>
                                </Link>
                            </div>
                    </>}
                </div>

            </div>
            
            {isSearch && <div className="find-UserPost">
                <div className="find-modal"></div>
                <div className="find-content">
                    <div className="find-content-history">
                        <p>Lịch sử tìm kiếm</p>
                        <div className="find-content-history-container">
                            {user?.searchHistorys?.length > 0 && user?.searchHistorys?.map( (history) => (
                                <div className="find-content-history-container-item" >
                                    <div className="find-history-container-item-info" onClick={() => handleClickHistory(history)}>
                                        <p>{history}</p>
                                    </div>                             
                                    <div className="find-history-container-item-close" onClick={()=> handleDeleteHistory(history)}>
                                        <i className="fal fa-times"></i>
                                    </div>
                                </div>     
                            ))}
                        </div>
                    </div>
                    <div className="find-content-user">
                        <p>Người dùng được tìm thấy</p>
                        <div className="find-content-user-container">
                            {isFetching && 
                                <div className="find-content-user-container-item"> 
                                    <div className="spinner-3"></div>
                                    <p>Đang tìm kiếm</p>
                                </div>}
                            {users?.length === 0 && !isFetching && 
                                <div className="find-content-user-container-item-noFind"> 
                                    <p>Không có</p>
                                </div>}                
                            {users && !isFetching && users.map(user => (
                                <div onClick={() => setIsSearch(false)}>
                                    <Link to={`/profile/${user ? user._id : ""}`} style={{textDecoration: "none", color: "black"}} className="find-content-user-container-item">
                                        <div className="find-user-container-item-img">
                                            <img src={user.avatar ? (user.avatar) : (PF)} alt="image" />
                                        </div>
                                        <div className="find-user-container-item-info">
                                            <strong>{user ? user.username : ""}</strong>
                                            <span>Tham gia từ <b>{user ? format(user.createdAt) : ""}</b> trước</span>
                                        </div>
                                        <div className="find-user-container-item-close">
                                            <i className="fal fa-long-arrow-right" title="Đi đến trang cá nhân"></i>
                                        </div>
                                    </Link> 
                                </div>
                            ))}
                                                                                                                                                       
                        </div>
                    </div>
                    <div className="find-content-post">
                    <p>Bài viết được tìm thấy</p>
                        <div className="find-content-post-container">
                            {isFetching && 
                                <div className="find-content-post-container-item">
                                    <div className="spinner-3"></div>
                                    <p>Đang tìm kiếm</p>
                                </div>}
                            {posts.length === 0 && !isFetching && 
                                <div className="find-content-post-container-item-noFind"> 
                                    <p>Không có</p>
                                </div>}
                            {posts && !isFetching && posts.map(post => (
                                <div onClick={() => setIsSearch(false)}>
                                    <Link to={post ? `/post/${post._id}` : ""}  style={{textDecoration: "none", color: "black"}}  className="find-content-post-container-item">
                                        <div className="find-post-container-item-img">
                                            <img src={post ? (post.images[0]) : (PF)} alt="image" />
                                        </div>
                                        <div className="find-post-container-item-info">
                                            <strong>{post ? post.title : ""}</strong>
                                            {post && <span>{post.body.length > 125 ? post.body.slice(0, 125) + "...Đọc thêm" : post.body}</span>}
                                            <p>{post ? format(post.createdAt) : ""}</p>
                                        </div>
                                        <div className="find-post-container-item-close">
                                            <i className="fal fa-long-arrow-right" title="Đi đến bài viết"></i>
                                        </div>
                                    </Link>   
                                </div> 
                            ))}          
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
}

export default Navbar;