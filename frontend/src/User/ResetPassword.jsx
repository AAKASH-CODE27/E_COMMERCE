import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import '../UserStyles/Form.css';
import PageTitle from '../components/PageTitle';
import { removeErrors, removeSuccess, resetPassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';


function ResetPassword() {

    const {success,loading,error} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {token} = useParams()

    const resetPasswordSubmit = (e) =>{
        e.preventDefault();
        const data = {
            password,
            confirmPassword,
        }
        dispatch(resetPassword({token,userData:data}))
    }

    useEffect(() => {
        if(error){
            toast.error(error,{position:'top-center', autoClose:3000});
            dispatch(removeErrors());
        }
    },[dispatch,error]);

    useEffect(() => {
        if(success){
            toast.success("Password Reset Successfull",{position:'top-center', autoClose:3000});
            dispatch(removeSuccess());
            navigate("/login");
        }
    },[dispatch,success]);

  return (
    <>
    <PageTitle title = "Reset Password"/>
     <div className = "container form-container">
     <div className = "form-content">
        <form className="form"  onSubmit={(e) => {resetPasswordSubmit(e)
        }}>
          <h2>Reset Password </h2>

            <div className="input-group">
                <input type="password"  name = "password" placeholder  ="Enter Your Password" 
                value = {password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className="input-group">
                <input type="password"  name = "confirmPassword" placeholder  ="Confirm Password" 
                value = {confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>

            <button className = "authBtn"> Reset Password </button>
        </form>
        </div>
    </div>
    </>
  )
}

export default ResetPassword
