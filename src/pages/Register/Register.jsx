import axios from 'axios';
import { baseUrl } from 'config/configUrl';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Register.css";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    setTimeout(() => {
        if (error) {
            setError("");
        }
    }, 3000);
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (username === "" || email === "" || password === "") {
            setError("Bạn chưa điền đầy đủ thông tin");
        } else {
            try {
                const res = await axios.post( baseUrl + "/auth/register", {
                    username: username,
                    email: email,
                    password: password,
                });
                console.log(res.data);
                res.data && window.location.replace('/login');
            } catch (error) {
                setError("Email bị sai hoặc đã được sử dụng.");
            } 
        }
       
    }
    return (
        <div className="register">
            <form className="register-form" onSubmit={handleSubmitForm}>
                <h2>SocialTNT</h2>
                <p>Đăng kí để trở thành thành viên của chúng tôi.</p>
                <input type="text" className="inputUsername" placeholder="Username của bạn" onChange={(e)=> setUsername(e.target.value)} />
                <input type="email" className="inputEmail" placeholder="Email của bạn" onChange={(e)=> setEmail(e.target.value)} />
                <input type="password" className="inputPassword" placeholder="Password của bạn" onChange={(e)=> setPassword(e.target.value)} />
                <p style={{color: 'red'}}>{error}</p>
                <button type="submit">Đăng kí</button>
                <span>Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay.</Link></span>
            </form>
        </div>
    );
}
export default Register;