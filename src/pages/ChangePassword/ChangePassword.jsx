import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import "./ChangePassword.css";
import { useContext } from "react";
import { Context } from "context/Context";
import axios from "axios";
import UserLoginSmall from 'components/UserLoginSmall/UserLoginSmall';
import { useState } from 'react';
import { baseUrl } from 'config/configUrl';
import { useHistory } from 'react-router-dom';


function ChangePassword() {

    const [data, setData] = useState({
        email: '',
        password: '',
    })
    const router = useHistory();
    const [error, setError] = useState("");

    const handleFocus = () => {
        setError('');
    }
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    const handleSummit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(baseUrl + "/auth/changepassword", data); 
            // 
            if (res.data) {
                window.location.replace('/login')
            } else {
                setError("Sai email.");
            }
        } catch (err) {
            setError("Sai email.");
        }
    }

    return (
        <div className="changePass" >     
            <form className="changePass-form" autoComplete='off' >
                <h2>SocialTNT</h2>
                <p>Bạn đã quên mật khẩu? Đừng lo lắng!</p>
                <input 
                    onChange={handleChange}
                    onFocus={handleFocus}
                    type="email" name="email" className="inputEmail" 
                    placeholder="Email của bạn"
                />
                <input 
                    onChange={handleChange}
                    onFocus={handleFocus}
                    type="password" name="password" className="inputPassword" 
                    placeholder="Password mới của bạn"
                />
                <p style={{color: 'red'}}>{error}</p>               
                <button onClick={handleSummit}>Update</button>
                <span>Quay lại <Link to="/login">Đăng nhập</Link></span>
            </form>
        </div>
    );
}

export default ChangePassword;