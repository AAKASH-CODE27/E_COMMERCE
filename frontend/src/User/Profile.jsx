import React, { useEffect } from "react";
import  "../UserStyles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";

function Profile() {
    const navigate = useNavigate();
    const {loading, isAuthenticated, user} = useSelector((state) => state.user);
    useEffect(() => {
        if(!isAuthenticated){
            navigate("/login");
        }
    }, [navigate, isAuthenticated]);
  return (
    <>
    {loading ?(<Loader/>):(<div className="profile-container">
        <PageTitle title={`${user?.name}'s Profile`} />
      <div className="profile-image">
        <h1 className="profile-heading">My Profile</h1>
        <img src={user?.avatar?.url ? user.avatar.url : "/images/profile.png"} alt="User Profile" className="profile-image" />
        <Link to="/profile/update">Edit Profile</Link>
      </div>

      <div className="profile-details">
        <div className="profile-detail">
          <h2>Username:</h2>
          <p>{user?.name}</p>
        </div>

        <div className="profile-detail">
          <h2>Email:</h2>
          <p>{user?.email}</p>
        </div>

      </div>
      <div className="profile-buttons">
        <Link to="/orders/user"> My Orders </Link>
        <Link to ="/password/update" >Change Password</Link>
      </div>
    </div>)}
    </>
  );
}
export default Profile;
