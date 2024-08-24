import axios from "axios";
import { Context } from "context/Context";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import "./Notification.css";
import NotificationType from "components/NotificationType/NotificationType";
import { baseUrl } from "config/configUrl";

function Notification() {

    const { user, socket, accessToken } = useContext(Context); 
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        socket?.on("createPostToClient", (noti) => {
            const listNoti = [...notifications];
            listNoti.unshift(noti);
            setNotifications(listNoti);
            console.log(noti);
        })
    }, [notifications])

    // LẤY TẤT CẢ THÔNG BÁO CỦA NGƯỜI DÙNG
    useEffect(() => {
        setIsLoading(true);
        const fetchNoti = async () => {
            const res = await axios.get(baseUrl + `/notifications/getNotification/${user?._id}`);
            console.log(res.data);
            setNotifications(res.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
              }));
            setIsLoading(false);
        }
        fetchNoti();
    }, [user?._id])

    // KHI CLICK VÀO THÔNG BÁO
    const handleClickNotification = async (noti) => {
        const dataNoti = {
            userId: user?._id,
            notiId: noti?._id
        }
        await axios.put(baseUrl + `/notifications/updateNotification`, dataNoti);
    }

    // khi người dùng xóa thông báo
    const handleDeleteNotification = async (noti, index) => {
        const dataNoti = {
            userId: user?._id,
            notiId: noti?._id
        }
        await axios.put(baseUrl + `/notifications/deleteNotification`, dataNoti);

        // hiển thị giao diện
        let listNoti = [...notifications];
        let notis = [...listNoti.slice(0,index), ...listNoti.slice(index+1)];
        setNotifications(notis);
    }

    return (
        <div className="notification">
            <div className="notification-container">
                <h2>Thông báo của bạn</h2>

                {notifications && !isLoading && notifications.map((noti, index) =>    
                    <div className="noti-fast-container">                 
                        <div onClick={()=> handleClickNotification(noti)}>
                            <NotificationType key={index} noti={noti} />
                        </div>
                        <div className="notification-item-menu">
                            <i className="fas fa-ellipsis-h"></i>
                            <div className="notification-item-listMenu">
                                <div className="notification-item-itemMenu" onClick={() => handleDeleteNotification(noti, index)}>
                                    <i className="fas fa-trash"></i>
                                    <span>Xóa thông báo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {notifications.length === 0 && !isLoading && <p>Bạn chưa có thông báo nào</p>}
                {isLoading && <div className="notification-container-loading"> <div className="spinner-2"></div><p>Đang tải...</p> </div>}  
            </div>
        </div>
    )
}

export default Notification;
