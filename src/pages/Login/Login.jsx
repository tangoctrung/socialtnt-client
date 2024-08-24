import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import "./Login.css";
import { useContext } from "react";
import { Context } from "context/Context";
import axios from "axios";
import UserLoginSmall from 'components/UserLoginSmall/UserLoginSmall';
import { useState } from 'react';
import { baseUrl } from 'config/configUrl';

function Number(userLoginLocal, index) {
    let listUser = [...userLoginLocal];
    const newUsers = [...listUser.slice(0, index), ...listUser.slice(index + 1)];
    let u = listUser[index];
    let lu = [u, ...newUsers]
    localStorage.setItem("userLogin", JSON.stringify(lu));
    return lu;
}

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { dispatch, isFetching } = useContext(Context);
    const [error, setError] = useState("");
    let userLoginLocal1 = JSON.parse(localStorage.getItem("userLogin")) || [];
    const [userLoginLocal, setUserLoginLocal] = useState(userLoginLocal1);

    setTimeout(() => {
        if (error) {
            setError("");
        }
    }, 3000);

    // DELETE USER LOGIN 
    const handleDeleteUserLogin = async (user, index) => {
        let users = [...userLoginLocal];
        const newUsers = [...users.slice(0, index), ...users.slice(index + 1)];
        setUserLoginLocal(newUsers);
        localStorage.setItem("userLogin", JSON.stringify(newUsers));
    }

    // LOGIN FAST
    const handleLoginFast = async (user, index) => {
        dispatch({type: "LOGIN_START"});
        
        try {
            const res = await axios.post(baseUrl + "/auth/loginwithid", {
                userId: user?.userId,
                isLogin: true,
            })
            dispatch({type: "LOGIN_SUCCESS", payload: {newUser: res.data.newUser, accessToken: res.data.token}});
            window.location.replace("/");
        } catch (err) {
            dispatch({type: "LOGIN_FAILURE"});
        }
        // ĐƯA TK ĐƯỢC LOGIN LÊN ĐẦU
        const lu = Number(userLoginLocal, index);
        setUserLoginLocal(lu);
    }

    // LOGIN
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (emailRef.current.value === "" || passwordRef.current.value === "") {
            setError("Bạn chưa nhập email hoặc password.")
        } else {
            dispatch({type: "LOGIN_START"});
            try {
                
                const res = await axios.post(baseUrl + "/auth/login", {
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                });  
                console.log(res.data);
                const {newUser} = res.data;

                dispatch({type: "LOGIN_SUCCESS", payload: {
                    newUser: res.data.newUser, 
                    accessToken: res.data.token
                }});
                window.location.replace("/");    
                               
                // lưu id vào localStorage
                let i = -10;
                // eslint-disable-next-line array-callback-return
                userLoginLocal.map((user, index) => {
                    if (user.userId === newUser._id) {
                        i = index;
                    }
                })
                if (i >= 0) {
                    const listUser = Number(userLoginLocal, i);
                    setUserLoginLocal(listUser);
                } else {
                    let listId;
                    if (userLoginLocal === null) {
                        listId = [{userId: newUser._id, avatar: newUser.avatar, username: newUser.username}];
                    } else {
                        listId = [{userId: newUser._id, avatar: newUser.avatar, username: newUser.username}, ...userLoginLocal];
                    }
                    setUserLoginLocal(listId);
                    localStorage.setItem("userLogin", JSON.stringify(listId));
                }
             
            } catch (err) {
                setError("Sai email hoặc mật khẩu.")
                dispatch({type: "LOGIN_FAILURE"});
            }
        }
    };

    return (
        <div className="login" >
            {userLoginLocal && userLoginLocal.length > 0 &&
            <div className="login-left-container">       
                <h2>Các tài khoản đăng nhập gần đây</h2>            
                <div className="login-left">
                    {userLoginLocal.length > 0 && userLoginLocal.map((user, index) => (
                        <div class="login-left-fast">
                            <div className="login-left-fast-close" onClick={() => handleDeleteUserLogin(user, index)}>
                                <i className="far fa-times"></i>
                            </div>
                            <div  onClick={() => handleLoginFast(user, index)}>
                                <UserLoginSmall key={index} user={user} />
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>}
            <form className="login-form" onSubmit={handleSubmitForm}>
                <h2>SocialTNT</h2>
                <p>Đăng nhập để trải nghiệm với chúng tôi.</p>
                <input ref={emailRef} type="email" className="inputEmail" placeholder="Email của bạn"/>
                <input ref={passwordRef} type="password" className="inputPassword" placeholder="Password của bạn"/>
                <p style={{color: 'red'}}>{error}</p>               
                <button disabled={isFetching}>Đăng nhập</button>
                <span>Bạn chưa có tài khoản? <Link to="/register">Đăng kí ngay.</Link></span>
                <span>Bạn quên mật khẩu? <Link to="/changepassword">Click here?</Link></span>
            </form>
        </div>
    );
}

export default Login;