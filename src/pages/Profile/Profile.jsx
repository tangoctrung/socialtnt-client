import React, { useContext, useEffect, useState } from 'react';
import "./Profile.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Post from '../../components/Post/Post';
import CreatePost from '../../components/CreatePost/CreatePost';
import { Context } from 'context/Context';
import axios from 'axios';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import PostSmall from 'components/PostSmall/PostSmall';
import {storage} from '../../firebase';
import ReactTooltip from 'react-tooltip';
import URL from 'config/config';
import { baseUrl } from 'config/configUrl';

function Profile() {
    const [dataUser, setDateUser] = useState({});
    const [isPostList, setIsPostList] = useState(true);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const { user, dispatch, accessToken } = useContext(Context);
    const PF = URL.urlNoAvatar;
    const PFcover = URL.urlCover;
    const [username, setUsername] = useState(user?.username);
    const [nickname, setNickname] = useState(user?.nickname);
    const [date, setDate] = useState(user?.date);
    const [gender, setGender] = useState(user?.gender);
    const [job, setJob] = useState(user?.job);
    const [status, setStatus] = useState(user?.status);
    const [address, setAddress] = useState(user?.address);
    const [hometown, setHometown] = useState(user?.hometown);
    const [infoOther, setInfoOther] = useState(user?.infoOther);
    const [file, setFile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [isFollow, setIsFollow] = useState(user?.following.includes(user?._id));
    const [isFollower, setIsFollower] = useState(true);
    const searchURL = useLocation();
    const paramID = searchURL.pathname.split("/")[2];
    const [avatarUrl, setAvatarUrl] = useState("");
    const [chat, setChat] = useState();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [imageModal, setImageModal] = useState();
    const [isLoading, setIsLoading] = useState(false);
    let userLoginLocal1 = JSON.parse(localStorage.getItem("userLogin")) || null;
    const [userLoginLocal, setUserLoginLocal] = useState(userLoginLocal1);

    useEffect(() => {
        setIsLoading(true);
        const fetchUser = async () => {
            const res = await axios.get( baseUrl + `/users/profile/${paramID}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
            });
            setDateUser(res.data);
            setIsLoading(false);
        }
        fetchUser();
        const fetchDataFollowers = async()=>{
            const res1 = await axios.get( baseUrl + `/users/profile/followers/${paramID}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
            });
            setFollowers(res1.data);
            console.log(res1.data);
        }
        fetchDataFollowers();
        const fetchDataFollowings = async()=>{
            const res2 = await axios.get( baseUrl + `/users/profile/followings/${paramID}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
            });
            setFollowings(res2.data);
          console.log(res2.data);
        }
        fetchDataFollowings();
        setIsFollow(user?.following.includes(paramID));
    }, [paramID, isFollow]);
    
    useEffect(() => {
        const fetchPost = async () => {
            const res3 = await axios.get( baseUrl + `/posts/profile/${paramID}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
            });
            setPosts(
                res3.data.sort((p1, p2) => {
                  return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
              );
            console.log(res3.data);
        }
        fetchPost();
    }, [paramID])
    
    // useEffect(() => {
        
    // }, [paramID, user]);

    const handleSubmitUpdateUser = async (e) => {
        e.preventDefault();
        dispatch({type: "UPDATE_START"});
        const infoUserCurrent = {
            username,
            nickname,
            date,
            gender,
            job,
            status,
            address,
            hometown,
            infoOther,
        }
         // LƯU THAY ĐỔI VÀO LOCAL 
        let newUser = {
            userId: user?._id,
            username: username,
            avatar: user?.avatar,
        }     
        if (avatarUrl) {
            infoUserCurrent.avatar = avatarUrl;
            newUser.avatar = avatarUrl;
        }
        let listUser = [...userLoginLocal.slice(1)];
        const lu = [newUser, ...listUser];
        localStorage.setItem("userLogin", JSON.stringify(lu));


        try{            
            const res = await axios.put( baseUrl + `/users/profile/${paramID}`, infoUserCurrent);
            dispatch({type: "UPDATE_SUCCESS", payload: res.data});
            window.location.reload();              
        } catch(error){
            dispatch({type: "UPDATE_FAILURE"});
        }
            
    }
    const handleChooseAvatarProfile = (e) => {
        const file1 = e.target.files[0];
        setFile(file1);
        if (file1) {
            const uploadTask = storage.ref(`avatar/${user?._id},${user?.username}/${file1.name}`).put(file1);
            console.log("loading");
            uploadTask.on('state_changed', 
                (snapshot) => {}, 
                (error) => { alert(error)}, 
                () => {
                    // complete function ....
                    storage.ref(`avatar/${user?._id},${user?.username}`).child(file1.name).getDownloadURL().then(url => {
                        console.log(url);
                        setAvatarUrl(url);
                    })
                });
        }
    }
    
    const handleOpenModalEditUser = () => {
        setIsModalEdit(true);
    }

    const handleFollow = () => {
        const fetchFollow = async () => {
            try {
                if (isFollow) {
                  await axios.put( baseUrl + `/users/profile/${paramID}/unfollow`, {
                    userId: user?._id,
                  });
                  dispatch({ type: "UNFOLLOW", payload: paramID });
                } else {
                  await axios.put( baseUrl + `/users/profile/${paramID}/follow`, {
                    userId: user?._id,
                  });
                  dispatch({ type: "FOLLOW", payload: paramID });
                }
                setIsFollow(!isFollow);
              } catch (err) {
              }             
        }
        fetchFollow();
    }

    const handleClickChat = () => {
        const fetchChat = async () => {
            const res = await axios.get( baseUrl + `/conversations/find/${user?._id}/${paramID}`);
            setChat(res.data);
        }
        fetchChat();
    }

    return (
        <>
            <div className="profile">
                <div className="profile-content">
                    { !isLoading && <>
                            <div className="profile-content-top">
                            <img src={dataUser?.cover || PFcover} alt="Image" onClick={()=> {setIsOpenModal(true); setImageModal(dataUser?.cover || PFcover)}}/>
                            <div className="profile-content-avatar">
                                <img src={dataUser?.avatar || (PF)} alt="avatar" onClick={()=> {setIsOpenModal(true); setImageModal(dataUser?.avatar || PF )}}/>
                                <h2>{dataUser?.username}</h2>
                                {dataUser?.nickname && <p>{"(" + dataUser.nickname + ")"}</p>}           
                            </div>
                            {dataUser?._id !== user?._id && <div className="profile-content-requestFriend-Chat">
        
                                                                <div className={isFollow ? "profile-content-requestFriend" : "profile-content-requestFriend isActiveRequestFriend"} onClick={handleFollow}>
                                                                    {isFollow ? "" : <i className="fas fa-plus"></i>}
                                                                    {isFollow ? "Đang theo dõi" : "Theo dõi"}
                                                                </div>
                                                                
                                                                <div  className="profile-content-Chat" onClick={handleClickChat}>
                                                                    <Link to={`/chat`} style={{textDecoration: "none", color: "rgb(190, 69, 69)"}} >
                                                                        <i className="fab fa-facebook-messenger"></i>
                                                                        <span>Nhắn tin</span>
                                                                    </Link>
                                                                </div>
                                                        </div>
                                }
                            
                        </div>
                            <hr />
                            <div className="profile-content-bottom">
                            <div className="profile-content-bottom-left">
                                <div className="profile-content-infoUser">
                                    <div className="profile-content-title">
                                        <p>Thông tin người dùng</p>
                                        {dataUser?._id === user?._id && <><i className="far fa-edit" data-tip="Chỉnh sửa thông tin cá nhân" onClick={handleOpenModalEditUser}></i><ReactTooltip place="bottom" type="dark" effect="solid"/></>}                            
                                    </div>
                                    <div className="profile-content-infoUser-container">
                                        <span><i className="fas fa-birthday-cake"></i>Ngày sinh: {dataUser?.date ? <b>{dataUser?.date}</b> : <i>Chưa cập nhật</i>}</span> <br/>
                                        <span><i className="fas fa-user-md"></i>Công việc: {dataUser?.job ? <b>{dataUser?.job}</b> : <i>Chưa cập nhật</i>}</span><br/>
                                        <span><i className="fas fa-transgender"></i>Giới tính: {dataUser?.gender ? <b>{dataUser?.gender}</b> : <i>Chưa cập nhật</i>}</span><br/>
                                        <span><i className="fab fa-gratipay"></i>Trạng thái: {dataUser?.status ? <b>{dataUser?.status}</b> : <i>Chưa cập nhật</i>}</span><br/>
                                        <span><i class="fas fa-home-lg-alt"></i>Nơi ở: {dataUser?.address ? <b>{dataUser?.address}</b> : <i>Chưa cập nhật</i>}</span><br/>
                                        <span><i className="fas fa-map-marker-alt"></i>Quê quán: {dataUser?.hometown ? <b>{dataUser?.hometown}</b> : <i>Chưa cập nhật</i>}</span><br/>
                                        <span><i className="fas fa-info-circle"></i>Thông tin khác: {dataUser?.infoOther ? <b>{dataUser?.infoOther}</b> : <i>Chưa cập nhật</i>}</span>
                                    </div>
                                </div>
                                <div className="profile-content-listFriend">
                                    {/* <ListFollow followers={followers} followings={followings} /> */}
                                        <div className="profile-contennt-listFriend-title">
                                            <p
                                                className={isFollower ? "isActiveFollower" : ""}
                                                onClick={() => setIsFollower(true)}
                                                >
                                                Người theo dõi <b>({followers?.length})</b>
                                            </p>
                                            <p
                                                className={!isFollower ? "isActiveFollower" : ""}
                                                onClick={() => setIsFollower(false)}
                                                >
                                                Đang theo dõi <b>({followings?.length})</b>
                                            </p>
                                        </div>
                                        <div className="profile-contennt-listFriend-body">
                                            {isFollower && (
                                            <>
                                                {followers?.map( (follower) => (<Link to={`/profile/${follower?._id}`} style={{textDecoration: 'none', color: 'black'}} className="profile-content-itemFriend">
                                                                                    <img src={follower?.avatar ? (follower?.avatar) : (PF)} />
                                                                                    <span>{follower?.username}</span>
                                                                            </Link>)
                                                )}
                                                
                                            </>
                                            )}
                                            {!isFollower && (
                                            <>
                                                {followings?.map( (following) => (<Link to={`/profile/${following._id}`} style={{textDecoration: 'none', color: 'black'}} className="profile-content-itemFriend">
                                                                                    <img src={following.avatar ? (following.avatar) : (PF)} />
                                                                                    <span>{following.username}</span>
                                                                            </Link>)
                                                )}
                                            </>
                                            )}
                                        </div>
                                    </div>
                            </div>
                            <div className="profile-content-bottom-right">
                                {dataUser?._id === user?._id && <div className="profile-content-createPost">
                                                                    <CreatePost />
                                                            </div>
                                    }
                                
                                {/* chọn chế độ xem bài viết */}
                                <div className="profile-content-bottom-typePostlist">
                                    <div className={isPostList ? "profile-content-typeList isActive" : "profile-content-typeList"} onClick={()=> setIsPostList(true)}>
                                        <i className="fas fa-bars"></i>
                                        <span>Xem theo danh sách</span>
                                    </div>
                                    <div className={!isPostList ? "profile-content-typeList isActive" : "profile-content-typeList"} onClick={()=> setIsPostList(false)}>
                                        <i className="fas fa-th-large"></i>
                                        <span>Xem theo lưới</span>
                                    </div>
                                </div>
                                {/* nếu không có bài viết */}
                                {posts.length === 0 && <div className="profile-content-bottom-noPosts">
                                                                    <span>Chưa có bài viết nào :((</span>
                                                            </div>} 
                                                    
                                {/* nếu có bài viết */}
        
                                {/* xem ở chế độ danh sách */}
                                {isPostList && <div className="profile-content-bottom-Postlist">
                                                    {posts && posts.map((post, index) => <Post post={post} key={index}/> )}                                                                                       
                                                </div>}
                                {/* xem ở chế độ lưới */}
                                {!isPostList && <div className="profile-content-bottom-PostGird">
                                                    {posts && posts.map((post, index) => <PostSmall post={post} key={index} />)}
                                                </div>}
                                
                            </div>
                        </div>
                        </>
                    }
                    {isLoading && <div className="profile-content-loading"> <div className="spinner-2"></div><p>Đang tải...</p> </div>}
                </div>

                {isOpenModal && <div className="post-modal">                                                    
                                    <div className="post-modal-content" onClick={()=> setIsOpenModal(false)}></div>
                                    <div className="post-modal-Image">
                                        <TransformWrapper style={{width: '100%', height: '100%'}}>
                                            <TransformComponent style={{width: '100%', height: '100%'}}>
                                                <img src={imageModal} />
                                            </TransformComponent>
                                        </TransformWrapper>
                                        <div className="post-modal-close" onClick={()=> setIsOpenModal(false)}>
                                            <i className="fas fa-times-circle"></i>
                                        </div>
                                    </div>      
                                </div>
                    }
                {isModalEdit && <div className="modalEdit">
                    <div className="modalEdit-content">
                        <i className="fas fa-times" onClick={()=> setIsModalEdit(false)}></i>
                        <form className="modalEdit-content-form" onSubmit = {handleSubmitUpdateUser}>
                            <div className="modalEdit-content-form-avatar">
                                <label htmlFor="chooseAvatar" >
                                    {user?.avatar && <img src={file ? avatarUrl : (user?.avatar)} alt="avatar" title="Bấm vào đây để thay đổi avatar"/>}
                                    {!user?.avatar && <img src={file ? avatarUrl : (PF)} alt="avatar" title="Bấm vào đây để thay đổi avatar"/>}
                                    <input type="file" id="chooseAvatar" style={{display: "none"}}  onChange={handleChooseAvatarProfile} />
                                </label>
                            </div>
                            <span><i className="fas fa-user-tie"></i>Tên: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></span> <br/>
                            <span><i className="fas fa-user-secret"></i>Biệt danh: <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} /></span><br/>
                            <span><i className="fas fa-birthday-cake"></i>Ngày sinh: <input type="text" value={date} onChange={(e) => setDate(e.target.value)} /></span> <br/>
                            <span><i className="fas fa-user-md"></i>Công việc: <input  type="text" value={job} onChange={(e) => setJob(e.target.value)} /></span><br/>
                            <span><i className="fas fa-transgender"></i>Giới tính: <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} /></span><br/>
                            <span><i className="fab fa-gratipay"></i>Trạng thái: <input  type="text" value={status} onChange={(e) => setStatus(e.target.value)} /></span><br/>
                            <span><i class="fas fa-home-lg-alt"></i>Nơi ở: <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} /></span><br/>
                            <span><i className="fas fa-map-marker-alt"></i>Quê quán: <input type="text" value={hometown} onChange={(e) => setHometown(e.target.value)} /></span><br/>
                            <span><i className="fas fa-info-circle"></i>Thông tin khác: <textarea type="text" value={infoOther} onChange={(e) => setInfoOther(e.target.value)} ></textarea></span> <br/>
                            <button type="submit">Cập nhật</button>
                        </form>
                    </div>
                </div>}

                
            </div>
        </>
    );
}

export default Profile;