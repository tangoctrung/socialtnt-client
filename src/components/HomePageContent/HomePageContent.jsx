import React from 'react';
import CreatePost from '../CreatePost/CreatePost';
import PostList from '../PostList/PostList';
import "./HomePageContent.css";

function HomePageContent(props) {
    return (
        <div className="home-page-content">
            <div className="home-page-content-create-post">
                <CreatePost />
            </div>
            <div className="home-page-content-create-post">
                <PostList />
            </div>
        </div>
    );
}

export default HomePageContent;