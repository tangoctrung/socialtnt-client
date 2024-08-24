import React from 'react';
import "./PostSmall.css";
import { format } from "timeago.js";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from 'config/configUrl';

function PostSmall({post}) {
    const [comments, setComments] = useState([])
    useEffect(() => {
        const fetchComment = async () => {
            const resComment = await axios.get( baseUrl + `/comment/post/${post._id}`);
            setComments(resComment.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            }));
        }
        fetchComment();
    })
    return (
        <Link to={ post ? `/post/${post._id}` : ""} className="PostSmall">
            {post.images.length > 0 ? <div className="PostSmall-img">
                <img src={post ? (post.images[0]) : ""}/>
            </div> : <p>Không có hình ảnh</p>}
            <div className="PostSmall-container">
                <span>{ post ? format(post.createdAt) : ""}</span>
                <div className="PostSmall-countImg">
                    <span>{post ? post.images.length : 0}</span>
                    <i class="far fa-images"></i>
                </div>
                <div className="PostSmall-title">
                    <h3>{post ? post.title : ""}</h3>
                </div>
                <div className="PostSmall-like-dislike-comments">
                    <div className="PostSmall-like">
                        <span>{post ? post.likes.length : 0}</span>
                        <i className="far fa-heart" title="Yêu thích"></i>
                    </div>
                    <div className="PostSmall-like">
                        <span>{post ? post.dislikes.length : 0}</span>
                        <i className="far fa-heart-broken" title="Thất vọng"></i>
                    </div>
                    <div className="PostSmall-like">
                        <span>{comments ? comments.length : 0}</span>
                        <i className="far fa-comment" title="Bình luận"></i>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PostSmall;