import React, { useCallback, useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"
import { COMPETITION_STATUS_CREATED, COMPETITION_STATUS_FINISHED, COMPETITION_STATUS_PUBLISHED, COMPETITION_STATUS_STARTED } from "../redux/competitionStatuses"

export const CompetitionsPage = () => {
    const [competitions, setCompetitions] = useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const links = [
        {to: '/admin/competitions/add', title: 'Добавить'}
    ]

    const getCompetitions = useCallback(async () => {
        try {
            const result = await request('/api/competitions/get-all')
            setCompetitions(result)
            console.log(result);
        }
        catch {}
    }, [request])

    const rmCompetitionHandler = async event => {
        const id = event.target.getAttribute('data-competition-id')
        try {
            const { message } = await request('/api/competitions/remove-competition', 'POST', { id })
            successAlert(message)
            getCompetitions()
        }
        catch {}
    }
    
    useEffect(getCompetitions, [getCompetitions])

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            setTimeout(clearError, 4000)
        }
    }, [error, clearError, errorAlert])

    return (
        <div className="container-fluid">
            { loading && <Loader /> }
            <Navbar links={links} />
            <div className="container">
                { competitions.length === 0 && <p className="text-center fs-3 m-5">Мероприятия не найдены</p> }
                { competitions.length > 0 && <table className="table">
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Статус</th>
                            <th className="text-center">Ход</th>
                            <th className="text-center">Участнники</th>
                            <th className="text-center">Изменить</th>
                            <th className="text-center">Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        competitions.map(({_id, name, status}) => (
                            <tr key={_id} className="align-middle">
                                <td>{name}</td>
                                <td>
                                    { status === COMPETITION_STATUS_CREATED && <span className="badge bg-warning">Создано</span> }
                                    { status === COMPETITION_STATUS_STARTED && <span className="badge bg-danger">В работе</span> }
                                    { status === COMPETITION_STATUS_FINISHED && <span className="badge bg-success">Завершено</span> }
                                    { status === COMPETITION_STATUS_PUBLISHED && <span className="badge bg-secondary">Опубликовано</span> }
                                </td>
                                <td className="text-center">
                                    <NavLink to={`/admin/competitions/progress/${_id}`} className="btn btn-sm btn-primary">Ход</NavLink>
                                </td>
                                <td className="text-center">
                                    <NavLink to={`/admin/competitions/parts/${_id}`} className="btn btn-sm btn-primary">Участники</NavLink>
                                </td>
                                <td className="text-center">
                                    <NavLink to={`/admin/competitions/add/${_id}`} className="btn btn-sm btn-primary">Изменить</NavLink>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-danger" data-competition-id={_id}
                                        onClick={rmCompetitionHandler}
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