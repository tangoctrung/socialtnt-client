import axios from 'axios';
import Post from 'components/Post/Post';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import "./PostThemen.css";
import dataThemes from '../../data/index';
import { useContext } from 'react';
import { Context } from 'context/Context';
import { baseUrl } from 'config/configUrl';

function PostThemen() {
    const { accessToken } = useContext(Context);
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const themen = location.search.split("=")[1];
    const themeHot = dataThemes.slice(0,8);
    const themenNormal = dataThemes.slice(8);
    useEffect(() => {
        setIsLoading(true);
        const fetchPost = async () => {
            const res = await axios.get( baseUrl + `/posts/themen/?themen=${themen}`, {
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
    }, [themen])
    return (
        <>
            <div className="PostThemen">
                <div className="PostThemen-left">
                    <div className="PostThemen-left-top">
                        <p>Bạn đang tìm kiếm <b>chủ đề</b></p>
                        <h2>{themen}</h2>
                    </div>
                    <div className="PostThemen-left-bottom">
                        <p>Những <b>chủ đề</b> đang hot</p>
                        <div className="PostThemen-left-bottom-container">
                            {themeHot && themeHot.map((themen, index) => (
                                <Link 
                                    key={index}
                                    to={`postthemen?themen=${themen.themen}`} 
                                    style={{textDecoration: 'none', color: 'black'}}
                                >
                                    <p>{themen.themen}</p>
                                </Link>
                            ))}
                            
                        </div>
                    </div>
                    <div className="PostThemen-left-bottom-1">
                        <p >Những <b>chủ đề</b> có thể bạn quan tâm</p>
                        <div className="PostThemen-right-bottom-container">
                            {themenNormal && themenNormal.map((themen, index) => (
                                <Link 
                                    key={index}
                                    to={`postthemen?themen=${themen.themen}`} 
                                    style={{textDecoration: 'none', color: 'black'}}
                                >
                                    <p>{themen.themen}</p>
                                </Link>
                            ))}
                            
                        </div>
                    </div>
                </div>
                <div className="PostThemen-center">
                    <div className="PostThemen-center-1">
                        {!isLoading && posts.length > 0 && posts.map((post, index) => (
                            <Post post={post} post={post} key={index}/>
                        ))}
                        {posts.length === 0 && !isLoading &&  <span className="PostThemen-center-text">Không tìm thấy bài viết nào</span>}
                        {isLoading && <div className="PostThemen-center-loading"> <div className="spinner-2"></div><p>Đang tải...</p> </div>}
                    </div>
                </div>
                <div className="PostThemen-right">
                    <p>Những <b>chủ đề</b> có thể bạn quan tâm</p>
                    <div className="PostThemen-right-bottom-container">
                        {themenNormal && themenNormal.map((themen, index) => (
                            <Link 
                                key={index}
                                to={`postthemen?themen=${themen.themen}`} 
                                style={{textDecoration: 'none', color: 'black'}}
                            >
                                <p>{themen.themen}</p>
                            </Link>
                        ))}
                        
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostThemen;
