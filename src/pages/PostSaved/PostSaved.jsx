import axios from 'axios';
import Leftbar from 'components/Leftbar/Leftbar';
import Post from 'components/Post/Post';
import { Context } from 'context/Context';
import PostSaveSmall from 'components/PostSaveSmall/PostSaveSmall';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import './PostSaved.css';
import { baseUrl } from 'config/configUrl';

function PostSaved() {
    const { user, accessToken } = useContext(Context);
    const [postSave, setPostSave] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchPostSave = async () => {
            const res = await axios.get( baseUrl + `/users/savepost/${user?._id}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
            });
            // setPosts(res.data);
            setPosts(
                res.data.sort((p1, p2) => {
                  return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
              );
            setIsLoading(false);
        }
        fetchPostSave();
    }, [user]);

    return (
        <>
            <div className="postSaved">
                <div className="postSaved-left">
                    <Leftbar />
                </div>
                <div className="postSaved-Content">
                    <div className="postSaved-content-left">
                        <div className="postSaved-content-left-container">
                            {postSave && <Post post={postSave}/>}
                            {posts?.length !== 0 && !postSave && <p className="postsave-text"> Chọn bài viết đã lưu để xem chi tiết ở đây</p>}
                            {posts?.length === 0 && !isLoading && <p className="postsave-text">Chưa có bài viết nào được lưu.</p>}
                            {/* {isLoading && <p>Loading...</p>} */}
                            {isLoading && <div className="postSaved-content-left-loading"><div className="continuous-4"></div><p>Loading...</p></div>}                       
                        </div>
                    </div>
                    <div className="postSaved-content-right">  
                        {posts?.length > 0 && <h2>Bài viết đã lưu</h2>}
                        {posts?.length === 0 && <h2>Danh sách bài viết đã lưu(nếu có).</h2>}
                        {posts && !isLoading && posts.map((post, index) =>(
                            <div className="postSaved-top-content-item" onClick={()=>setPostSave(post)}>
                            <PostSaveSmall post={post} key={index} />  
                            </div>       
                                    
                        ))}  
                    </div>
                </div>
            </div>         
        </>
    );
};

export default PostSaved;
