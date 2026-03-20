import React, { useEffect } from "react";
import "../UserStyles/Form.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { removeErrors } from "../features/products/productSlice";
import { useNavigate } from "react-router-dom";


function Login() {
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const { error, loading, success, isAuthenticated } = useSelector(
    (state) => state.user,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const loginSubmit = (e) => {
    e.preventDefault();
    // console.log("Hello");
    dispatch(login({ email: loginEmail, password: loginPassword }));
    // Here you can handle the login logic, such as sending the data to the backend
  };

  useEffect(() => {
      if (error) {
        toast.error(error, { position: "top-center", autoClose: 3000 });
        dispatch(removeErrors());
      }
    },
    [dispatch, error],
  );

  useEffect(() => {
    if(isAuthenticated){
        navigate("/")
    }
  },[isAuthenticated]);

  useEffect(() => {
    if(success){
        toast.success('Login Successfull',{position: "top-center", autoClose: 3000});
        dispatch(removeSuccess());
    }
  },[dispatch, success]);

  return (
    <div className="form-container container">
      <div className="form-content">
        <form className="form" onSubmit={loginSubmit}>
          <div className="input-group">
            <input
              type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          </div>

          <div className="input-group">
            <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          </div>

          <button className="authBtn">Sign In</button>

          <p className="form-links">{" "} Forgot your password? <Link to="/password/forgot">Reset Here</Link>
          </p>
          <p className="form-links"> {" "} Don't Have a Account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
