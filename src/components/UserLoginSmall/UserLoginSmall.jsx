import "./UserLoginSmall.css";
import URL from 'config/config';

function UserLoginSmall({user}) {

    const PF = URL.urlNoAvatar;
    return (
        <>
            <div className="userloginsmall" title={user?.username}>    
                <div className="userloginsmall-img">
                    <img src={user?.avatar || (PF)} alt="image" />
                </div>
                <div className="userloginsmall-info">
                    <span>{user?.username.length > 15 ? user?.username.slice(0, 13) + "..." : user?.username}</span>
                </div>
            </div>
        </>
    )
}

export default UserLoginSmall;