import React from 'react'
import { Navigate } from 'react-router-dom';
import Loader from './Loader';
import { useSelector } from 'react-redux';


function ProtectedRoute({ element }) {
  const {isAuthenticated, loading} = useSelector((state) => state.user);
  if(loading){
    return <Loader/>
  }

  if(!isAuthenticated){
    return <Navigate to="/login" replace />;
    }
    return element;
}

export default ProtectedRoute
