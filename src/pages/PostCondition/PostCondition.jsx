import axios from 'axios';
import Post from 'components/Post/Post';
import { baseUrl } from 'config/configUrl';
import { Context } from 'context/Context';
import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import "./PostCondition.css";

function PostCondition() {
    const { accessToken } = useContext(Context);
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const hashtag = location.search.split("=")[1];

    useEffect(() => {
        setIsLoading(true);
        const fetchPost = async () => {
            const res = await axios.get( baseUrl + `/posts?hashtag=${hashtag}`, {
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
        fetchPost();
    }, [hashtag])
    return (
        <>
            <div className="postCondition">
                <div className="postCondition-left">
                    <div className="postCondition-left-top">
                        <p>Bạn đang tìm kiếm <b>hashtag</b></p>
                        <h2>#{hashtag}</h2>
                    </div>
                    <div className="postCondition-left-bottom">
                        <p>Những <b>hashtag</b> đang hot</p>
                        <div className="postCondition-left-bottom-container">
                            <Link to={`postcondition?hashtag=thiennhien`} style={{textDecoration: 'none', color: 'black'}}  ><p>#thiennhien</p></Link>
                            <p>#quocgia</p>
                            <p>#phim</p>
                            <p>#sieuanhhung</p>
                            <p>#web</p>
                        </div>
                    </div>
                </div>
                <div className="postCondition-center">
                    <div className="postCondition-center-1">
                        {!isLoading && posts.length > 0 && posts.map((post, index) => (
                            <Post post={post} post={post} key={index}/>
                        ))}
                        {posts.length === 0 && !isLoading &&  <span className="postCondition-center-text">Không tìm thấy bài viết nào</span>}
                        {isLoading && <div className="postCondition-center-loading"> <div className="spinner-2"></div><p>Đang tải...</p> </div>}
                    </div>
                </div>
                {/* <div className="postCondition-right">
                    
                </div> */}
            </div>
        </>
    );
};

export default PostCondition;
