import React from 'react';
import "./UserSmall.css";
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import URL from 'config/config';

function UserSmall({data}) {

    const PF = URL.urlNoAvatar;

    return (
        <Link to={`/profile/${data._id}`} style={{textDecoration: 'none', color: 'black'}} className="all-user-container-itemUser">
            <div className="all-user-container-itemUser-img">
                <img src={data?.avatar || (PF)} alt="image"/>
            </div>
            <div className="all-user-container-itemUser-info">
                <h3>{data && data.username}</h3>
                {data && data.hometown && <p>Đến từ <b>{data.hometown}</b> </p>}
                <p>Tham gia vào <b>{data && format(data.createdAt)}</b> trước.</p>
            </div>
        </Link>
    );
};

export default UserSmall;