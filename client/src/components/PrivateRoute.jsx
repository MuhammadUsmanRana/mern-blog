import React from 'react';
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from "react-router-dom"

const PrivateRoute = () => {
    const currentState = useSelector((state) => state.user);
    return currentState.currentState && currentState.currentState ? <Outlet /> : <Navigate to={"/sign-in"} />
}
export default PrivateRoute;