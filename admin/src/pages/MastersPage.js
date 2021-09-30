import { useCallback, useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const MastersPage = () => {
    const [masters, setMasters] = useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const links = [
        {to: '/admin/masters/add', title: 'Добавить'}
    ]

    const getMasters = useCallback(async () => {
        try {
            const result = await request('/api/masters/get-all')
            setMasters(result)
        }
        catch {}
    }, [request])
    
    const rmMasterHandler = async event => {
        const id = event.target.getAttribute('data-master-id')
        try {
            const { message } = await request('/api/masters/remove-master', 'POST', { id })
            successAlert(message)
            getMasters()
        }
        catch {}
    }
    
    useEffect(getMasters, [getMasters])

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
                { masters.length === 0 && <p className="text-center fs-3 m-5">Мастеры не найдены</p> }
                { masters.length > 0 && <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th>Имя</th>
                            <th>Почта</th>
                            <th className="text-center">Изменить</th>
                            <th className="text-center">Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        masters.map(({_id, avatar, name, mail}) => (
                            <tr key={_id} className="align-middle">
                                <td className="text-center">
                                    { avatar && avatar.length > 0 && <img src={avatar} alt="avatar" width="64" /> }
                                </td>
                                <td>{name}</td>
                                <td>{mail}</td>
                                <td className="text-center">
                                    <NavLink to={`/admin/masters/add/${_id}`} className="btn btn-sm btn-primary">Изменить</NavLink>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-danger" data-master-id={_id}
                                        onClick={rmMasterHandler}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                    </table> }
            </div>
        </div>
    )
}