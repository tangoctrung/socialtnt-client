import React, { useContext, useState } from 'react';
import "./CreatePost.css";
import { Context } from 'context/Context';
import axios from 'axios';
import {storage} from '../../firebase';
import Picker from 'emoji-picker-react';
import { useRef } from 'react';
import dataThemes from '../../data/index';
import { useEffect } from 'react';
import URL from 'config/config';
import { baseUrl } from 'config/configUrl';

function formatTime (date) {
    var hour = new Date(date).getHours(); 
    var minutes = new Date(date).getMinutes(); 
    var seconds = new Date(date).getSeconds();
    var time = hour + "h " + minutes + "m " + seconds + "s ";
    var date1 = new Date(date).toDateString();
    var time2 = time + date1;
    return time2;
}

function CreatePost() {
    const [isOpenCreatePost, setIsOpenCreatePost] = useState(false);
    const PF = URL.urlNoAvatar;
    const { user, socket } = useContext(Context);
    const [images, setImages] = useState([]);
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const [titlePost, setTitlePost] = useState("");
    const [bodyPost, setBodyPost] = useState("");
    const [hashtag, setHashtag] = useState("");
    const [themenPost, setThemenPost] = useState("");;

    // useEffect(() => {
    //     socket?.on("createPostToClient", (noti) => {
    //         // const listNoti = [...notifications];
    //         // listNoti.unshift(noti);
    //         // setNotifications(listNoti);
    //         console.log(noti);
    //     })
    // }, [])

    const handleUploadImages = (e) => {
        let files = [...e.target.files];
        let newImages = [...images];
        var date = Date.now();
        var date1 = formatTime(date);
        console.log(date1);
        files.forEach(file => {
            // return newImages.push(file);
            const uploadTask = storage.ref(`imagePost/${user._id},${user.username}/${date1}/${file.name}`).put(file);
            uploadTask.on('state_changed', 
                (snapshot) => {}, 
                (error) => { alert(error)}, 
                () => {
                    // complete function ....
                    storage.ref(`imagePost/${user._id},${user.username}/${date1}`).child(file.name).getDownloadURL().then(url => {
                        newImages.push(url);
                        setImages([...newImages]);
                    })
                });
        });
       
    }

    const handleRemoveImageItem = (index) => {
        let newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    const handleChangeHashtag = (e) => {
        setHashtag(e.target.value);       
    }

    const handleSubmitCreatePost = async (e) => {
        e.preventDefault();
        let arrayHashtag = [];
        if(hashtag !== "") {
            arrayHashtag = hashtag.split(" ");
        }
        let dataPost = {
            authorId: user._id,
            title: titlePost,
            body: bodyPost,
            themen: themenPost === "Chọn chủ đề" ? "Khác" : themenPost,
        }
        dataPost.hashtags = [...arrayHashtag];
        if (images) {          
            dataPost.images = [...images];  
        }
        try{
            const newPost = await axios.post( baseUrl + "/posts", dataPost);
            const dataNoti = {
                typeNoti: "createPost",
                senderNotiId: user?._id,
                receiverNotiId: [...user?.follower],
                postNotiId: newPost.data._id,
                content: `đã thêm một bài viết mới - "${bodyPost.slice(0,60)}" `
            }
            const noti = await axios.post( baseUrl + '/notifications/createNotification', dataNoti);
            const newNoti = {
                ...noti.data,
                senderNotiId: {
                    _id: user?._id,
                    username: user?.username,
                    avatar: user?.avatar
                }
            }
            socket?.emit('createPost', newNoti); 
            window.location.reload();
        } catch(error){
        }

    }

    // CLICK CHOOSE EMOJI
    const onEmojiClick = (event, data) => {
        let s = bodyPost;
        s += data.emoji;
        setBodyPost(s);
    }

    return (
        <div className="createPost">
            <div className="createPost-info" onClick={()=> setIsOpenCreatePost(true)}>
                <div className="createPost-info-top">
                    <div className="createPost-info-top-image">
                        <img src={user?.avatar ? (user?.avatar) : (PF)} alt="Hình ảnh"/>
                    </div>
                    <div className="createPost-info-top-input">
                        <div className="input">Hãy cập nhật trạng thái bây giờ của bạn!</div>
                    </div>
                </div>
                <hr />
                <div className="createPost-info-bottom">
                    <div className="createPost-info-bottom-item createPost-info-bottom-image-video">
                        <i className="fas fa-photo-video"></i>
                        <span>Ảnh/Video</span>
                    </div>
                    <div className="createPost-info-bottom-item createPost-info-bottom-emoji">
                        <i className="fas fa-grin-alt"></i>
                        <span>Cảm xúc</span>
                    </div>
                    <div className="createPost-info-bottom-item createPost-info-bottom-camera">
                        <i className="fas fa-camera"></i>
                        <span>Chụp ảnh</span>
                    </div>
                </div>
            </div>
            {isOpenCreatePost && <div className="createPost-content">            
                <div className="createPost-content-container">
                    <div className="createPost-content-close" onClick={()=> setIsOpenCreatePost(false)}>
                        <i className="fas fa-times" ></i>
                    </div>
                    <form className="createPost-content-post" onSubmit={handleSubmitCreatePost}>
                        <div className="createPost-content-image-title">
                            <div className="createPost-content-image">
                                <img src={user?.avatar ? (user?.avatar) : (PF)} alt="Hình ảnh" />
                            </div>
                            <div className="createPost-content-title">
                                <input type="text" placeholder="Tiêu đề bài viết" onChange={e => setTitlePost(e.target.value)} />
                            </div>
                        </div>
                        <div className="createPost-content-body">
                            <textarea 
                                type="text" placeholder="Nội dung bài viết" 
                                value={bodyPost ? bodyPost : ""}
                                onChange={e => setBodyPost(e.target.value)} 
                                onFocus={()=> setIsOpenEmoji(false)}
                            >                         
                            </textarea>
                        </div>
                        <div className="createPost-content-imageVideo-camera-emoji">
                            <label htmlFor="chooseFile" className="createPost-content-imageVideo createPost-content-item1">
                                <i className="fas fa-photo-video"></i>
                                <span>Ảnh/Video</span>
                                <input type="file" id="chooseFile" name="chooseImagePost" onChange={handleUploadImages} style={{display: "none"}} multiple accept="image/*,video/*"/>
                            </label>
                            <div className="createPost-content-emoji createPost-content-item1" >
                                <div style={{display: "flex", alignItems: "center"}}onClick={()=> setIsOpenEmoji(!isOpenEmoji)}>
                                    <i className="fas fa-grin-alt"></i>
                                    <span>Cảm xúc</span>
                                </div>
                                {isOpenEmoji && <div className="createPost-content-emoji-picker">
                                    <Picker onEmojiClick={onEmojiClick} />
                                </div>}

                            </div>
                            <div className="createPost-content-camera createPost-content-select">
                                {/* <i className="fas fa-camera"></i>
                                <span>Chụp ảnh</span> */}
                                <select onChange={(e)=> setThemenPost(e.target.value)}>
                                    {dataThemes.map( (data, index) => (
                                        <option key={index} value={data.themen}>{data.themen}</option>
                                    ))}                                
                                </select>
                            </div>
                        </div>
                        <label htmlFor="filePost" title="Kéo ảnh bạn muốn đăng vào đây" className="createPost-content-containerImage" onDrop={()=> console.log("DragEnter")}>
                            <input type="file" id="filePost"  onChange={handleUploadImages} multiple />
                            {images && images.map((image, index) =>  
                                {return <div key={index} className="createPost-content-containerImage-imageIcon">
                                            <img src={image} />
                                            <i className="fas fa-times-circle" onClick={() => handleRemoveImageItem(index)}></i>
                                        </div>
                                }
                            )}
                   
                        </label>
                        <div className="createPost-content-hashtag-button">
                            <div className="createPost-content-hashtag">
                                <input type="text" placeholder="Hashtag bài viết" onChange={handleChangeHashtag} />
                            </div>
                            <div className="createPost-content-button">
                                <button>POST</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>}
        </div>
    );
}

export default CreatePost;