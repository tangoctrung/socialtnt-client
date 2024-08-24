import React from 'react'
import "./PostSaveSmall.css";

function PostSaveSmall({post}) {
    return (
        <div className="PostSaveSmall">
            <div className="PostSaveSmall-img">
                {post?.images[0] ?
                    <img src={post?.images[0]} alt="image" />
                : <p>Không có hình ảnh</p>}
            </div>
            <div className="PostSaveSmall-contentInfo">
                <div className="PostSaveSmall-content">
                    <h3>{post?.title}</h3>
                    <p>{post?.body.slice(0, 300) + "..."}</p>
                </div>              
            </div>
            <div className="PostSaveSmall-modal"></div>
        </div>
    )
}

export default PostSaveSmall;
