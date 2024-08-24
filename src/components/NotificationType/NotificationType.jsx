import { Context } from "context/Context";
import { useState } from "react";
import { useContext } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import URL from 'config/config';


function NotificationType({noti}) {

    const { user } = useContext(Context);
    const PF = URL.urlNoAvatar;
    const [isRead, setIsRead] = useState(noti?.readNotiId.includes(user?._id));
    
    
    return (  
        <>
            {!noti?.deleteNotiId.includes(user?._id) && <div className={!isRead ? 'notification-item isRead' : "notification-item"}>
                <Link 
                 to={`/post/${noti?.postNotiId?._id}`} 
                 className="notification-item-img" 
                 style={{textDecoration: "none", color: "black"}}
                >
                    <img src={noti?.senderNotiId.avatar || (PF)} alt="image" />
                </Link>

                <Link 
                 to={`/post/${noti?.postNotiId?._id}`} 
                 style={{textDecoration: "none", color: "black"}}  
                 className="notification-item-info"
                >
                    <div className="notification-item-content">
                        <p>
                            <b>{noti?.senderNotiId.username}</b> {noti?.content}
                        </p>
                    </div>
                    <div className="notification-item-time">
                        <p>{format(noti?.createdAt)}</p>
                    </div>
                </Link>
                
                
            </div>}  
        </>
    )
}

export default NotificationType;
