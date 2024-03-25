import React from 'react';
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from "react-router-dom"

const OnlyAdminPrivateRoute = () => {
    const currentState = useSelector((state) => state.user);
    return currentState.currentState && currentState.currentState.isAdmin ? <Outlet /> : <Navigate to={"/sign-in"} />
}
export default OnlyAdminPrivateRoute;