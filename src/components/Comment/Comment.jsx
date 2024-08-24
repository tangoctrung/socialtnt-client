import React from "react";
import "./Comment.css";
import { useEffect } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "context/Context";
import { useContext } from "react";
import Picker from "emoji-picker-react";
import { useRef } from "react";
import ReplyComment from "components/ReplyComment/ReplyComment";
import URL from "../../config/config";
import { baseUrl } from "config/configUrl";

function Comment({ comment, authorId }) {
  const { user, socket } = useContext(Context);
  const [isOpenReplyComment, setIsOpenReplyComment] = useState(false);
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [isLikeComment, setIsLikeComment] = useState(false);
  const [totalLikeComment, setTotalLikeComment] = useState(0);
  const [replyComments, setReplyComments] = useState([]);
  const [nameComment, setNameComment] = useState("");
  const [nameReply, setNameReply] = useState("");
  const [contentComment, setContentComment] = useState(comment?.content);
  // const PF = "http://localhost:8800/images/";
  const PF = URL.urlNoAvatar;
  const commentRef = useRef();
  const inputEditComment = useRef();
  const [isEditComment, setIsEditComment] = useState(false);
  const [isDeleteComment, setIsDeleteComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket?.on('createCommentToClient', (newComment) => {
        if (newComment.userId?._id !== user?.id && newComment.commentId === comment?._id) {
            let comment = [...replyComments, newComment];
            setReplyComments(comment);
        }
    })
  }, [replyComments]);

  useEffect(() => {
    socket?.on('LikeCommentToClient', ({commentId, likesComment}) => {
      if (commentId === comment?._id) {
        setTotalLikeComment(likesComment);
      }
    });
    socket?.on('cancleLikeCommentToClient', ({commentId, likesComment}) => {
      if (commentId === comment?._id) {
        setTotalLikeComment(likesComment);
      }
    });
  }, [totalLikeComment]);



  // khi comment bị edit, delete
  useEffect(() => {
    socket?.on("editCommentToClient", newComment => {        
      if (newComment?._id === comment?._id) {          
          setContentComment(newComment?.content);
      }
    })
    socket?.on("deleteCommentToClient", newComment => {        
      if (newComment?._id === comment?._id) {          
        setContentComment(newComment?.content);
      }
    }) 
  }, []);


  useEffect(() => {
    const fetchReplyComment = async () => {
      const resReplyComment = await axios.get( baseUrl + `/replycomment/comment/${comment?._id}`);
      setReplyComments(resReplyComment.data);
      setIsLoading(false);
  }
  if (comment?.isReply) {
    setIsLoading(true);
    fetchReplyComment();
  }
  }, [comment?._id]);


  useEffect(() => {
    setNameComment(comment?.writerId?.username);
    setIsLikeComment(comment?.likes?.includes(user?._id));
    setTotalLikeComment(comment?.likes?.length);
    
  }, [])

  // LIKE/UNLIKE COMMENT
  const handleLikedComment = async () => {
      const fetchLikedComment = async () => {
        await axios.put( baseUrl + `/comment/likecomment`, {
          commentId: comment?._id,
          userId: user?._id,
        });
      };
      fetchLikedComment();
      if (isLikeComment) {
        socket?.emit('cancleLikeComment', {
          commentId: comment?._id, 
          likesComment: totalLikeComment - 1,
        });
      } else {
        socket?.emit('likeComment', {
          commentId: comment?._id, 
          likesComment: totalLikeComment + 1,
        });

        // tạo thông báo like comment
        if (user?._id !== comment?.writerId?._id) {
          const dataNoti = {
            typeNoti: "likeCommentPost",
            senderNotiId: user?._id,
            receiverNotiId: [comment?.writerId],
            postNotiId: comment?.postId,
            content: `đã yêu thích bình luận của bạn`,
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

  // CLICK CHOOSE EMOJI
  const onEmojiClick = (event, data) => {
    let s = nameReply; s += data.emoji;
    setNameReply(s);
  };

  // KHI NGƯỜI DÙNG ẤN NÚT TRẢ LỜI
  const handleClickReply = (nameComment) => {
    
    setIsOpenReplyComment(!isOpenReplyComment);
    setNameReply(nameComment + ": ");
    
  };

  // REPLY COMMENT
  const handleSubmitReplyComment = (e) => {
    e.preventDefault();
    const dataReply = {
        content: nameReply,
        userId: user?._id,
        commentId: comment?._id,
    }
    const fetchSubmitReplyComment = async () => {
        await axios.put( baseUrl + `/comment/reply/${comment?._id}`);
        const newReplyComment = await axios.post( baseUrl + `/replycomment/`, dataReply);

        // tạo thông báo commentPost
        if (user?._id !== authorId) {
          const dataNoti = {
            typeNoti: "replyCommentPost",
            senderNotiId: user?._id,
            receiverNotiId: [authorId, comment?.writerId],
            postNotiId: comment?.postId,
            content: `đã phản hồi một bình luận trong bài viết của bạn`,
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
          socket?.emit('replyCommentPostNoti', newNoti); 
        }


        const c = {
          ...newReplyComment.data,
          userId: {
              _id: user?._id,
              username: user?.username,
              avatar: user?.avatar,
          },
        } 
      let listComment = [...replyComments];
      listComment.push(c);
      setReplyComments(listComment);
      socket?.emit('createComment', c);
    }
    fetchSubmitReplyComment();
    setNameReply("");
    
  };

  // SUBMIT EDIT COMMENT
  const handleSubmitEditComment = async (e) => {
    e.preventDefault();
    const dataComment = {
      content: contentComment,
    }
    try {
      const res = await axios.put( baseUrl + `/comment/${comment?._id}`, dataComment);
      socket?.emit("editComment", res.data);
      setIsEditComment(false);
    } catch (err) {
      console.log(err);
    }
  }

  // DELETE COMMENT
  const handleDeleteComment = async () => {
    const dataComment = {
      content: "d!e!l!e!t!e",
    }
    const newComment = await axios.put( baseUrl + `/comment/${comment?._id}/delete`, dataComment);
    setContentComment("d!e!l!e!t!e");
    setIsDeleteComment(false);
    socket?.emit("deleteComment", newComment.data);
    // window.location.reload();
  }
  return (
     
      <div className="comment-container" >
        {contentComment !== "d!e!l!e!t!e" ?
          <div className="post-itemComment">

            <Link
              to={`/profile/${comment ? comment.writerId?._id : ""}`}
              className="post-itemComment-avatar"
            >
              <img
                src={comment?.writerId?.avatar || (PF)}
                alt="Avatar"
              />
            </Link>
            
            {!isEditComment && <>
            <div className="post-itemComment-body">
              <div className="post-itemComment-body-top">
                <Link
                  to={`/profile/${comment ? comment.writerId?._id : ""}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <b>{comment ? comment.writerId?.username : ""}</b>
                </Link>
                <span>{contentComment}</span>
              </div>
              
              <div className="post-itemComment-body-bottom">
                <p onClick={() => handleClickReply(nameComment)}>Trả lời</p>
                <span>{format(comment.createdAt)}</span>
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
            <div className="post-itemComment-menu">
              <i className="fas fa-ellipsis-h"></i>
              <div className="post-itemComment-menu-content">
                {(comment.writerId?._id === user?._id) && (
                  <>         
                    <span onClick={() => setIsEditComment(true)}>Chỉnh sửa</span>         
                    <span onClick={() => setIsDeleteComment(true)}>Xóa</span>
                  </>
                )}
                {(comment.writerId?._id !== user?._id && authorId === user?._id) && (
                  <>
                    <span onClick={() => setIsDeleteComment(true)}>Xóa</span>
                  </>
                )}
                <span>Báo cáo</span>
              </div>
            </div>
            </>}

            {isEditComment &&          
                  <form className="form-EditComment" onSubmit={handleSubmitEditComment} >
                    <input 
                      ref={inputEditComment} 
                      value={contentComment} 
                      onChange={(e) => setContentComment(e.target.value)} 
                    ></input>
                    {/* <button onClick={handleSubmitEditComment}>Update</button> */}
                    <button onClick={() => setIsEditComment(false)}>Cancel</button>
                  </form>      
            }
          </div>: 
          <div className="commentDelete">
          <img
              src={PF}
              alt="Avatar"
          />
          <span>Bình luận này đã bị xóa</span>       
        </div>
        }

        <div className="post-listReplyComment" ref={commentRef}>
            {replyComments && !isLoading && replyComments.map((replyComment, index) => (
              <div >
                <ReplyComment
                  key={index}
                  replyComment={replyComment}
                  isOpenReplyComment={isOpenReplyComment}
                  setIsOpenReplyComment={setIsOpenReplyComment}
                  handleClickReply = {handleClickReply}
                  authorId={authorId}
                  postId = {comment.postId}
                />

              </div>
            ))}
            {isLoading && <div className="post-listReplyComment-loading"> <div className="spinner-7"></div></div>} 
        </div>

        {isOpenReplyComment && (
          <form className="post-replyComment" onSubmit={handleSubmitReplyComment}>
            <div className="post-replyComment-avatar">
              <img
                src={user.avatar ? user.avatar : PF}
                alt="Avatar"
              />
            </div>
            <div className="post-replyComment-input">
              <input
                type="text"
                value={nameReply}
                placeholder="Phản hồi của bạn..."
                onChange={(e) => setNameReply(e.target.value)}
                onFocus={() => {setIsOpenEmoji(false); console.log(nameReply)}}
              />
            </div>
            <div className="post-replyComment-emoji">
              <i
                className="far fa-grin"
                onClick={() => setIsOpenEmoji(!isOpenEmoji)}
              ></i>
              {isOpenEmoji && (
                <div className="post-replyComment-picker">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </form>
        )}

        {isDeleteComment && 
          <div className="post-modal-deletePost">
            <div className="post-modal-content" onClick={()=> setIsDeleteComment(false)}></div>
            <div className="post-modal-deletePost-info">
                <p>Bạn có muốn xóa bình luận này không?</p>
                <div className="list-button">
                    <button onClick={handleDeleteComment}>Xóa</button>
                    <button onClick={()=> setIsDeleteComment(false)}>Không</button>
                </div>
            </div>
          </div>
        }
        
      </div>
    
  );
}

export default Comment;
