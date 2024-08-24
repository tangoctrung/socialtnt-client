import React from "react";
import { useState } from "react";
import "./Chat.css";
import { useEffect } from "react";
import { Context } from "context/Context";
import { useContext } from "react";
import Conversation from "components/Conversation/Conversation";
import ChatMessage from "components/ChatMessage/ChatMessage";
import InfoConversation from "components/InfoConversation/InfoConversation";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import URL from 'config/config';
import { Tooltip } from '@material-ui/core';
import { baseUrl } from "../../config/configUrl";
import axios from "axios";

function Chat() {
  const [isOpenChatMember, setIsOpenChatMember] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [noFollowings, setNoFollowings] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const { user, accessToken, socket } = useContext(Context);
  const [lastMessage, setLastMessage] = useState();
  // const location = useLocation();
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);
  const [listMembers, setListMembers] = useState([user?._id]);
  const [nameGroup, setNameGroup] = useState("");
  const PF = URL.urlNoAvatar;
  const [colorChat, setColorChat] = useState(-1);
  const [listUserOnline, setListUserOnline] = useState([]);

  useEffect(() => {
      socket?.emit("addUser", user?._id);
      socket?.on("getUser", (users) => {
          setListUserOnline([...users]);
      });
  }, [user?._id])


  // khi có người nhắn tin thì đưa cuộc trò chuyện đó lên đầu
  useEffect(() => {
    let listConversation = [...conversations];
    let index = 0, i;
    for (i = 0; i < listConversation.length; i++){
      if (listConversation[i]?._id === lastMessage?.conversationId) {
        index = i;
        break;
      }
    }
    const conversation = listConversation[index];
    const newListConversation = [conversation, ...listConversation.slice(0, index), ...listConversation.slice(index + 1)];
    setConversations(newListConversation);
  }, [lastMessage])

  // Lấy thông tin các following
  useEffect(() => {
    const fetchFollowings = async () => {
      const res = await axios.get(baseUrl + `/users/profile/followings/${user?._id}`, {
        headers: {
            Authorization: 'Bearer ' + accessToken
          }
    });
      setFollowings(res.data);
    };
    fetchFollowings();
  }, []);

  // Lấy thông tin các user mà người dùng chưa follow
  useEffect(() => {
    const fetchFollowings = async () => {
      const res = await axios.get(baseUrl + `/users/nofollowings/${user?._id}`, {
        headers: {
            Authorization: 'Bearer ' + accessToken
          }
    });
      setNoFollowings(res.data);
    };
    fetchFollowings();
  }, []);

  // GET ALL CONVERSATIONS OF USER
  useEffect(() => {
    setIsLoading(true);
    const FetchUser = async () => {
      const res = await axios.get(baseUrl + `/conversations/${user && user._id}`, {
        headers: {
            Authorization: 'Bearer ' + accessToken
          }
      });
      setConversations(res.data.sort((p1, p2) => {
            return new Date(p2.updatedAt) - new Date(p1.updatedAt);
      }));
      setIsLoading(false);
    };
    FetchUser();
  }, [user && user._id]);


  // NẾU ĐƯỜNG DẪN CÓ ID CỦA CUỘC NÓI CHUYỆN THÌ LẤY CUỘC NCH ĐÓ
  // useEffect(() => {
  //   setChatId(location.pathname.split("/")[2]);
  //   const fetchDataChat = async () => {
  //     const res = await axios.get(baseUrl + `/conversations/chat/${chatId && chatId}`, {
  //       headers: {
  //           Authorization: 'Bearer ' + accessToken
  //         }
  //   });
  //     setCurrentChat(res.data);
  //   };
  //   fetchDataChat();
  // }, [location, chatId]);



  // LẤY TIN NHẮN CỦA MỘT CUỘC TRÒ CHUYỆN
  
  const handleSetCurrentChat = (conversation) => {
    setCurrentChat(conversation);
    const FetchMessage = async () => {
      try {
        const res = await axios.get(baseUrl + `/messages/${conversation?._id}`, {
          headers: {
              Authorization: 'Bearer ' + accessToken
            }
        });
        setMessages(res.data);
      } catch (e) {}
    };
    FetchMessage();
  }
  
 //  Chuyển sang list group
 const handleClickGroup = async (e) => {
    setIsOpenChatMember(false);
    setIsLoadingGroup(true);
    const res = await axios.get(baseUrl + `/conversationsgroup/${user?._id}`, {
      headers: {
          Authorization: 'Bearer ' + accessToken
        }
  });
    setGroupChats(res.data);
    setIsLoadingGroup(false);
 }   

  //  add member group
  const handleCheckInputAddUser = (e) => {
    if (e.target.checked) {
      listMembers.push(e.target.name);
      console.log(listMembers);
    } else {
      let list = [...listMembers];
      let l = list.filter(member => member !== e.target.name);
      setListMembers(l);
    }
  }

  // create group
  const handleSubmitCreateGroup = async (e) => {
    e.preventDefault();
    const dataGroup = {
      membersGroup: [...listMembers],
      nameGroup: nameGroup,
    }
    const res = await axios.postbaseUrl + (`/conversationsgroup/`, dataGroup);
    console.log(res.data);
    window.location.reload();
    // setIsCreateGroup(false);
    setListMembers([user?._id]);
  };

  // khi người dùng gọi video
  const handleCallVideo = () => {
    // http://localhost:3000/callvideo
    // https://socialtnt.netlify.app/callvideo
    var popup = window.open('https://socialtnt.netlify.app/callvideo',"myWindow", "width=1200,height=1100");
    // popup.moveTo(0, 0);
    // popup.resizeTo(window.screen.width, window.screen.height);
  }
  
  return (
    <>
      <div className="chat">
        <div className="chat-left">
          <div className="chat-left-1">
            <h2>Chat</h2>
            <div className="chat-left-1-createGroup">             
              <Tooltip title="Tạo nhóm chat" placement={"bottom"} enterDelay={500} arrow>
                <i
                  className="far fa-users-medical"
                  onClick={() => setIsCreateGroup(true)}
                ></i>
              </Tooltip>
              {isCreateGroup && (
                <div className="createGroup">
                  <div
                    className="createGroup-modal"
                    onClick={() => setIsCreateGroup(false)}
                  ></div>
                  <form 
                    className="createGroup-content"
                    onSubmit={handleSubmitCreateGroup}
                  >
                    <div className="createGroup-avatar-name">
                      <div className="createGroup-name">
                        <input placeholder="Type name of Group..." onChange={(e)=> setNameGroup(e.target.value)} />
                      </div>
                    </div>
                    <div className="createGroup-text">
                      <h4>Thêm thành viên</h4>
                    </div>
                    <div className="createGroup-listUser">
                      <b>Những người bạn đang theo dõi</b>
                      {followings &&
                        followings.map((following) => (
                          <div className="createGroup-itemUser">
                            <Link
                              className="createGroup-itemUser-link"
                              to={`/profile/${following._id}`}                          
                            >
                              <img
                                src={
                                  following.avatar
                                    ? following.avatar
                                    : PF
                                }
                                alt="image"
                              />
                              <p>{following?.username}</p>
                            </Link>
                            <input type="checkbox" name={following._id} onChange={handleCheckInputAddUser}/>
                          </div>
                        ))}

                      <b>Những người dùng được gợi ý</b>

                      {noFollowings &&
                        noFollowings.map((following) => (
                          <div className="createGroup-itemUser">
                            <Link
                              className="createGroup-itemUser-link"
                              to={`/profile/${following.userId}`}                          
                            >
                              <img
                                src={
                                  following.avatar
                                    ? following.avatar
                                    : PF
                                }
                                alt="image"
                              />
                              <p>{following?.username}</p>
                            </Link>
                            <input type="checkbox" name={following._id} onChange={handleCheckInputAddUser} />
                          </div>
                        ))}
                    </div>
                    <div className="createGroup-button">
                      <button>CREATE</button>
                    </div>
                  </form>
                </div>
              )}
              <Tooltip title="Call video" placement={"bottom"} enterDelay={500} arrow>
                <i className="fas fa-video"  onClick={handleCallVideo}></i>
              </Tooltip>
            </div>
          </div>
          <div className="chat-left-2">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng hoặc nhóm chat"
            />
          </div>
          <div className="chat-left-3">
            <span
              onClick={() => setIsOpenChatMember(true)}
              className={isOpenChatMember ? "isActive" : ""}
            >
              <i className="fas fa-user-friends"></i>Bạn bè
            </span>
            <span
              onClick={handleClickGroup}
              className={isOpenChatMember ? "" : "isActive"}
            >
              <i className="fas fa-users"></i>Nhóm
            </span>
          </div>
          <div className="chat-left-4">
            {isOpenChatMember && (
              <div className="chat-left-4-member">
                {conversations && !isLoading &&
                  conversations.map((conversation, index) => (
                    <div 
                      onClick={() => {handleSetCurrentChat(conversation); setColorChat(conversation?._id)}}
                      style={{backgroundColor: colorChat===conversation?._id ? "rgb(231, 229, 227)" : "transparent", borderRadius: '5px'}}
                    >
                      <Conversation
                        key={index}
                        conversation={conversation}
                        currentUser={user}
                        colorChat={colorChat}
                        lastMessage={lastMessage}
                        listUserOnline = {listUserOnline}
                      />
                    </div>
                  ))}
                  {isLoading && <div className="chat-left-4-member-loading"> <div className="spinner-2"></div><p>Đang tải...</p> </div>}
              </div>
            )}
            {!isOpenChatMember && (
              <div className="chat-left-4-group">
                  {groupChats && !isLoadingGroup && groupChats.map((group) => (
                      <div className="chat-left-4-group-item">
                          <div className="chat-left-4-group-item-img">
                              <img className="item-img-1" src={group?.membersGroup[1]?.avatar} alt="image" />
                              <img className="item-img-2" src={group?.membersGroup[2]?.avatar} alt="image" />
                              <i className="fas fa-circle"></i>
                          </div>
                          <div className="chat-left-4-member-item-text">
                              <h3>{group?.nameGroup}</h3>
                              <p>
                                  <p style={{ display: "inline-block" }}>Smith:</p> {group?.messageLastGroup}
                                  <span> {format(group?.updatedAt)}</span>
                              </p>
                          </div>
                          <div className="chat-left-4-member-item-noti">
                              <i className="fas fa-circle"></i>
                          </div>
                      </div>
                  ))}
                  {isLoadingGroup && <div className="chat-left-4-member-loading"> <div className="spinner-2"></div><p>Đang tải...</p> </div>}
              </div>
            )}
          </div>
        </div>

        <div className="chat-center">
          {currentChat ? (
            <ChatMessage
              messages={messages}
              currentChat={currentChat}
              setMessages={setMessages}
              setLastMessage={setLastMessage}
              listUserOnline={listUserOnline}
            />
          ) : (
            <span className="chat-text">
              Chọn cuộc hội thoại để bắt đầu nhắn tin.
            </span>
          )}
        </div>

        <div className="chat-right">
          <InfoConversation currentChat={currentChat} messages={messages} />
        </div>
      </div>
    </>
  );
}

export default Chat;
