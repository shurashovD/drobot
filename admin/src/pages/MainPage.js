import React from "react"
import { Navbar } from "../components/Navbar"

export const MainPage = () => {
    const links = [
        {to: '/admin/competitions', title: 'Мероприятия'},
        {to: '/admin/users', title: 'Пользователи'},
        {to: '/admin/masters', title: 'Мастеры'},
        {to: '/admin/categories', title: 'Категории'},
    ]

    return (
        <div className="container-fluid">
            <Navbar links={links} />
            <div className="container"></div>
        </div>
    )
}