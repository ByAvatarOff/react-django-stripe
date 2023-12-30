import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";


export default function RequireAuth() {
    let location = useLocation();
    let access_token = localStorage.getItem('access')
    return (
        access_token
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}   