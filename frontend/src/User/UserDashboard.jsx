import React from "react";
import "../UserStyles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { logout, removeSuccess } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function UserDashboard({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuVisible,setMenuVisible] = React.useState(false);

  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }

  const options = [
    { name: "Orders", funcName: orders },
    { name: "Account", funcName: profile },
    { name: "Logout", funcName: logoutUser },
  ];

  if (user?.role === "admin") {
    options.unshift({ name: "Admin Dashboard", funcName: dashboard });
  }

  function orders() {
    navigate("/orders/user");
  }

  function profile() {
    navigate("/profile");
  }

  function logoutUser() {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Logged out successfully", { position: "top-center" });
        dispatch(removeSuccess());
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to logout");
      });
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }

  return (
    <>
    <div className={`overlay ${menuVisible ? 'show' : ''}`}></div>
    <div className="dashboard-container">
      <div className="profile-header" onClick={toggleMenu}>
        <img
          src={user?.avatar?.url || "/images/profile.png"}
          alt="Profile"
          className="profile-avatar"
        />
        <span className="profile-name">{user?.name || "User"}</span>
      </div>

      {menuVisible && (
        <div className="menu-options">
          {options.map((item) => (
            <button
              key={item.name}
              className="menu-option-btn"
              onClick={item.funcName}
          >
            {item.name}
          </button>
        ))}
      </div>)}
    </div>
     </>
  );

}

export default UserDashboard;
