import Leftbar from 'components/Leftbar/Leftbar';
import React from 'react';
import "./AllUser.css";
import { useState } from 'react';
import UserSmall from 'components/UserSmall/UserSmall';
import { useEffect } from 'react';
import { baseUrl} from '../../config/configUrl';
import axios from 'axios';
import { Context } from 'context/Context';
import { useContext } from 'react';

function AllUser() {
    const { accessToken } = useContext(Context);
    const [listUser, setListUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
   

    useEffect(() => {
        setIsLoading(true);
        const FetchAllUser = async () => {
            const res = await axios.get(baseUrl + "/users/alluser", {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
            });
            setListUser(res.data);
            setIsLoading(false);
        }
        FetchAllUser();
    }, [])
    return (
        <>
            <div className="all-user">
                <div className="all-user-left">
                    <Leftbar />
                </div>
                <div className="all-user-container">
                    <div className="all-user-container-input">
                        <input type="text" placeholder="Nhập tên hoặc email của người dùng" />
                        <button type="submit">Tìm kiếm</button>
                    </div>
                    <div className="all-user-container-listUser">
                        {listUser && !isLoading && listUser.map((user, index)=> <UserSmall key={index} data={user} />)} 
                        {isLoading && <div className="all-user-container-listUser-loading">
                            <div className="spinner-1"></div>
                            <p>Đang tải người dùng...</p>
                        </div>}                  
                    </div>
                </div>
            </div>  
        </>
    )
}

export default AllUser;