import { useCallback, useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const UsersPage = () => {
    const [users, setUsers] = useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const links = [
        {to: '/admin/users/add', title: 'Добавить'}
    ]

    const getUsers = useCallback(async () => {
        try {
            const result = await request('/api/users/get-all')
            setUsers(result)
        }
        catch {}
    }, [request])
    
    const rmUserHandler = async event => {
        const id = event.target.getAttribute('data-user-id')
        try {
            const { message } = await request('/api/users/remove-user', 'POST', { id })
            successAlert(message)
            getUsers()
        }
        catch {}
    }
    
    useEffect(getUsers, [getUsers])

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, clearError, errorAlert])

    return (
        <div className="container-fluid">
            { loading && <Loader /> }
            <Navbar links={links} />
            <div className="container">
                { users.length === 0 && <p className="text-center fs-3 m-5">Пользователи не найдены</p> }
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th>Имя</th>
                            <th>Логин</th>
                            <th className="text-center">Изменить</th>
                            <th className="text-center">Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        users.map(({_id, avatar, name, login}) => (
                            <tr key={_id} className="align-middle">
                                <td className="text-center">
                                    <img src={avatar} alt="avatar" width="64" />
                                </td>
                                <td>{name}</td>
                                <td>{login}</td>
                                <td className="text-center">
                                    <NavLink to={`/admin/users/add/${_id}`} className="btn btn-sm btn-primary">Изменить</NavLink>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-danger" data-category-id={_id}
                                        onClick={rmUserHandler}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                    </table>
            </div>
        </div>
    )
}