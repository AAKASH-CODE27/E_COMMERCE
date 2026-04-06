import React from 'react'
import { Navigate } from 'react-router-dom';
import Loader from './Loader';
import { useSelector } from 'react-redux';


function ProtectedRoute({ element, adminOnly = false}) {
  const {isAuthenticated, loading, user} = useSelector((state) => state.user);
  if(loading){
    return <Loader/>
  }

  if(!isAuthenticated){
    return <Navigate to="/login" replace />;
  }

  if(adminOnly && user.role !== 'admin'){
    return <Navigate to =  "/" />  
  }
  return element;
}

export default ProtectedRoute
