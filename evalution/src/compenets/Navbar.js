import React from "react"
import { useAuth } from "../hooks/auth.hook"

export const Navbar = props => {
    const { logout } = useAuth()

    return (
        <div className="row bg-light m-0 mt-3 ps-3 align-items-center">
            <div className="col-3">
                <h4 className="mb-0">{props.title}</h4>
            </div>
            <div className="col-6 d-flex">
                <h4 className="mb-0 mx-auto">{props.label}</h4>
            </div>
            <div className="col-2">
                { props.btnTitle && <button className="btn btn-primary" onClick={props.btnCallback}>{props.btnTitle}</button> }
            </div>
            <div className="col-1">
                <span className="ms-auto me-2 nav-item" onClick={logout}>
                    Выход
                </span>
            </div>
        </div>
    )
}