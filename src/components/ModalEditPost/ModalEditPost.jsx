import React from 'react';
import "../CreatePost/CreatePost.css";
import Picker from 'emoji-picker-react';
import { useContext } from 'react';
import { Context } from 'context/Context';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import {storage} from '../../firebase';
import axios from 'axios';
import dataThemes from '../../data/index';
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

function ModalEditPost({post}) {
    const inputCommentRef = useRef();
    const PF = URL.urlNoAvatar;
    const { user, socket } = useContext(Context);
    const [images, setImages] = useState(post?.images);
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const [titlePost, setTitlePost] = useState(post?.title);
    const [bodyPost, setBodyPost] = useState(post?.body);
    const [hashtag, setHashtag] = useState("");
    const [themenPost, setThemenPost] = useState(post?.themen);

    useEffect(() => {
        let s = "";
        let s1 = post?.hashtags;
        let n = s1.length;
        let i;
        for(i=0;i<n-1;i++) {
            s += s1[i] + " ";
        }
        s += s1[n-1];
        console.log(s);
        if (s === "undefined") s = "";
        setHashtag(s);
    }, [post]);

    const handleSubmitCreatePost = async (e) => {
        e.preventDefault();
        let arrayHashtag = "";
        arrayHashtag = hashtag.split(" ");
        let dataPost = {
            authorId: user._id,
            title: titlePost,
            body: bodyPost,
            themen: themenPost,
        }
        dataPost.hashtags = [...arrayHashtag];
        if (images) {          
            dataPost.images = [...images];  
        }
        console.log(dataPost);
        try{
            const res = await axios.put( baseUrl + `/posts/${post?._id}`, dataPost);
            socket?.emit("editPost", res.data);
            window.location.reload();
        } catch(error){
        }
    
    }
    const handleUploadImages = (e) => {
        let files = [...e.target.files];
        let newImages = [...images];
        var date = Date.now();
        var date1 = formatTime(date);
        console.log(date1);
        files.forEach(file => {
            const uploadTask = storage.ref(`imagePost/${user._id},${user.username}/${date1}-update-${post?._id}/${file.name}`).put(file);
            console.log("loading");
            uploadTask.on('state_changed', 
                (snapshot) => {}, 
                (error) => { alert(error)}, 
                () => {
                    // complete function ....
                    storage.ref(`imagePost/${user._id},${user.username}/${date1}-update-${post?._id}`).child(file.name).getDownloadURL().then(url => {
                        console.log(url);
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
    // CLICK CHOOSE EMOJI
    const onEmojiClick = (event, data) => {
        let s = bodyPost;
        s += data.emoji;
        setBodyPost(s);
    }
    return (
        <form className="createPost-content-post" onSubmit={handleSubmitCreatePost}>
                <div className="createPost-content-image-title">
                    <div className="createPost-content-image">
                        <img src={user.avatar ? (user.avatar) : (PF)} alt="Hình ảnh" />
                    </div>
                    <div className="createPost-content-title">
                        <input type="text" value={titlePost} onChange={e => setTitlePost(e.target.value)} />
                    </div>
                </div>
                <div className="createPost-content-body">
                    <textarea 
                        ref={inputCommentRef} 
                        type="text" 
                        value={bodyPost}
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
                        <select value={themenPost} onChange={(e)=> setThemenPost(e.target.value)}>
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
                        <input type="text" value={hashtag} onChange={handleChangeHashtag} />
                    </div>
                    <div className="createPost-content-button">
                        <button>UPDATE</button>
                    </div>
                </div>
            </form>
    )
}

export default ModalEditPost;
