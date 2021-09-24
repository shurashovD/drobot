import React from "react"
import { NavLink } from 'react-router-dom'

export const Navbar = props => {
    const links = props.links ?? []

    return (
        <ul className="nav">
            <li className="nav-item">
                <NavLink to="/admin" className="nav-link" activeClassName="nav-link active">
                    Главная
                </NavLink>
            </li>
            {
                links.map(({to, title}) => (
                    <NavLink to={to} className="nav-link" activeClassName="nav-link active" key={to}>
                        {title}
                    </NavLink>
                ))
            }
            <li className="ms-auto nav-item">
                <a href="/" className="nav-link">Выход</a>
            </li>
        </ul>
    )
}