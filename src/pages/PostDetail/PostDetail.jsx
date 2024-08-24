import React, { useEffect} from 'react';
import "./PostDetail.css";
import { useLocation } from 'react-router';
import axios from 'axios';
import { useState } from 'react';
import Post from 'components/Post/Post';
import { Context } from 'context/Context';
import { useContext } from 'react';
import { baseUrl } from 'config/configUrl';

function PostDetail() {
    const location = useLocation();
    const { accessToken } = useContext(Context);
    const postId = location.pathname.split("/")[2];
    const [post, setPost] = useState();

    useEffect(() => {
        const FetchAuthorPost = async () => {

            // API GET POST
            const resPost = await axios.get( baseUrl + `/posts/post/${postId}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken //the token is a variable which holds the token
                  }
            });
            setPost(resPost.data);        
        }
            FetchAuthorPost();
    }, [postId]);


    return (
        <>
            <div className="post-detail">
                {postId !== "undefined" ? 
                    <div className="postdetail">
                        <Post post={post} />
                    </div>
                : 
                    <div className="post-detail-notFound"><p>Bài viết này không tồn tại</p></div>
                }
            </div>  
        </>   
    );
}

export default PostDetail;