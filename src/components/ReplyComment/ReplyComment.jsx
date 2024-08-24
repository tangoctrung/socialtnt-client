import React from "react";
import "./ReplyComment.css";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { Context } from "context/Context";
import { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";
import URL from 'config/config';
import { baseUrl } from "config/configUrl";

function ReplyComment({
  replyComment,
  isOpenReplyComment,
  setIsOpenReplyComment,
  handleClickReply,
  authorId,
  postId
}) {
  const { user, socket } = useContext(Context);
  const PF = URL.urlNoAvatar;
  const [isLikeComment, setIsLikeComment] = useState(
    replyComment.likes?.includes(user?._id)
  );

  const [totalLikeComment, setTotalLikeComment] = useState(
    replyComment?.likes?.length
  );
  const inputEditReplyComment = useRef();
  const [isEditReplyComment, setIsEditReplyComment] = useState(false);
  const [isDeleteReplyComment, setIsDeleteReplyComment] = useState(false);
  const [contentReplyComment, setContentReplyComment] = useState(replyComment?.content);

  // khi replyComment bị edit, delete
  useEffect(() => {
    socket?.on("editCommentToClient", newComment => {        
      if (newComment?._id === replyComment?._id) {          
          setContentReplyComment(newComment?.content);
      }
    })
    socket?.on("deleteCommentToClient", newComment => {        
      if (newComment?._id === replyComment?._id) {          
        setContentReplyComment(newComment?.content);
      }
    }) 
  }, []);

  useEffect(() => {
    socket?.on('LikeCommentToClient', ({commentId, likesComment}) => {
      if (commentId === replyComment?._id) {
        setTotalLikeComment(likesComment);
      }
    });
    socket?.on('cancleLikeCommentToClient', ({commentId, likesComment}) => {
      if (commentId === replyComment?._id) {
        setTotalLikeComment(likesComment);
      }
    });
  }, [totalLikeComment]);

  // LIKE/UNLIKE COMMENT
  const handleLikedComment = async () => {
      const fetchLikedComment = async () => {
        await axios.put( baseUrl + `/replycomment/likereplyComment`, {
          replyCommentId: replyComment?._id,
          userId: user?._id,
        });
      };
      fetchLikedComment();
      if (isLikeComment) {
        socket?.emit('cancleLikeComment', {
          commentId: replyComment?._id, 
          likesComment: totalLikeComment - 1,
        });
      } else {
        socket?.emit('likeComment', {
          commentId: replyComment?._id, 
          likesComment: totalLikeComment + 1,
        });

        // tạo thông báo  like replyComment
        if (user?._id !== replyComment?.userId?._id) {
          const dataNoti = {
            typeNoti: "likeReplyCommentPost",
            senderNotiId: user?._id,
            receiverNotiId: [replyComment?.userId],
            postNotiId: postId,
            content: `đã yêu thích phản hồi của bạn`,
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
          socket?.emit('likeCommentNoti', newNoti); 
        }
      }
      setTotalLikeComment(
        !isLikeComment ? totalLikeComment + 1 : totalLikeComment - 1
      );
      setIsLikeComment(!isLikeComment);
  };

  const handleClickReplyComment = () => {
    setIsOpenReplyComment(!isOpenReplyComment);
    handleClickReply(replyComment?.userId?.username);
  };

  // delete ReplyComment
  const handleDeleteReplyComment = async () => {
    const dataComment = {
      content: "d!e!l!e!t!e",
    }
    await axios.put( baseUrl + `/replycomment/${replyComment?._id}/delete`, dataComment);
    setContentReplyComment("d!e!l!e!t!e");
    setIsDeleteReplyComment(false);
    // window.location.reload();
  }

  // submit edit replycomment
  const handleSubmitEditReplyComment = async (e) => {
    e.preventDefault();
    const dataComment = {
      content: contentReplyComment,
    }
    try {
      const res = await axios.put( baseUrl + `/replycomment/${replyComment?._id}`, dataComment);
      socket?.emit("editComment", res.data);
      setIsEditReplyComment(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {contentReplyComment !== "d!e!l!e!t!e" 
        ?
        <div className="post-itemReplyComment">
          <Link to={`/profile/${replyComment?.userId?._id}`} className="post-listReplyComment-avatar">
            <img src={replyComment?.userId?.avatar || (PF)} alt="Avatar" />
          </Link>
          
          {!isEditReplyComment && <>
            <div className="post-listReplyComment-body">
              <div className="post-listReplyComment-body-top">
                <Link to={`/profile/${replyComment?.userId?._id}`} style={{ textDecoration: "none", color: "black" }}>
                  <b>{replyComment?.userId?.username}</b>
                </Link>
                <span>{contentReplyComment}</span>
              </div>
              <div className="post-listReplyComment-body-bottom">
                <p onClick={handleClickReplyComment}>Trả lời</p>
                <span>{format(replyComment?.createdAt)}</span>
                <span className="countLike" onClick={handleLikedComment}>
                  {totalLikeComment}
                  {!isLikeComment ? (
                    <i className="far fa-heart"></i>
                  ) : (
                    <i className="fas fa-heart" style={{ color: "red" }}></i>
                  )}
                </span>
              </div>
            </div>
            <div className="post-listReplyComment-menu">
              <i className="fas fa-ellipsis-h"></i>
              <div className="post-listReplyComment-menu-content">
                  {(replyComment?.userId?._id === user._id) && (
                    <>
                      <span onClick={() => setIsEditReplyComment(true)}>Chỉnh sửa</span>
                      <span onClick={() => setIsDeleteReplyComment(true)}>Xóa</span>
                    </>
                  )}    
                  {(replyComment?.userId?._id !== user._id && authorId === user._id) && (
                    <>
                      <span onClick={() => setIsDeleteReplyComment(true)}>Xóa</span>
                    </>
                  )}             
                <span>Báo cáo</span>
              </div>
            </div>
          </>}
          {isEditReplyComment &&          
                    <form className="form-EditComment">
                      <textarea 
                        ref={inputEditReplyComment} 
                        value={contentReplyComment} 
                        onChange={(e) => setContentReplyComment(e.target.value)} 
                      ></textarea>
                      <button onClick={handleSubmitEditReplyComment}>Update</button>
                      <button onClick={() => setIsEditReplyComment(false)}>Cancel</button>
                    </form>      
          }
        
        </div>
        : 
        <div className="replyCommentDelete">
          <span>Bình luận này đã bị xóa</span>       
        </div>
      }
      {isDeleteReplyComment && 
          <div className="post-modal-deletePost">
            <div className="post-modal-content" onClick={()=> setIsDeleteReplyComment(false)}></div>
            <div className="post-modal-deletePost-info">
                <p>Bạn có muốn xóa bình luận này không?</p>
                <div className="list-button">
                    <button onClick={handleDeleteReplyComment}>Xóa</button>
                    <button onClick={()=> setIsDeleteReplyComment(false)}>Không</button>
                </div>
            </div>
          </div>
      }
    </div>
  );
}

export default ReplyComment;
