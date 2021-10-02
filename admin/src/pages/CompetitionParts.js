import { useCallback, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const CompetitionParts = () => {
    const [parts, setParts] = useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const params = useParams()
    const links = [
        { to: '/admin/competitions', title: 'Мероприятия' },
        { to: `/admin/competitions/parts/add/${params.competitionId}`, title: 'Добавить/изменить' }
    ]

    const getNotes = useCallback(async id => {
        try {
            const response = await request('/api/notes/get-all', 'POST', {competitionId: id})
            console.log(response);
            const result = response.reduce((arr, note) => {
                if ( arr.some(item => item.master._id.toString() === note.master._id.toString()) ) {
                    return arr
                }
                const categories = response
                    .filter(({master}) => master._id.toString() === note.master._id.toString())
                    .map(({category}) => category._id)
                return arr.concat([{
                    number: note.number, master: note.master, categories
                }])
            }, [])
            console.log(result);
            setParts(result)
        }
        catch {}
    }, [request])

    const rmMasterHandler = async event => {
        const masterId = event.target.getAttribute('data-master-id')
        try {
            const { message } = await request('/api/notes/rm-by-master', 'POST', { masterId, competitionId: params.id })
            successAlert(message)
        }
        catch {}
    }

    useEffect(() => {
        if ( params.competitionId ) {
            getNotes(params.competitionId)
        }
    }, [params, getNotes])

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, clearError, errorAlert])

    return (
        <div className="container-fluid p-0">
            { loading && <Loader /> }
            <Navbar links={links} />
            <div className="container">
                <h3 className="my-3">
                    { parts.length > 0 ? <>Участники</> : <>Нет зарегистрированных участников</> }
                </h3>
                { parts.length > 0 && <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Имя</th>
                                <th scope="col">Кол-во номинаций</th>
                                <th className="text-center">Изменить</th>
                                <th className="text-center">Удалить</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parts.map(({number, master, categories}) => (
                                    <tr key={master._id}>
                                        <td>{number}</td>
                                        <td>{master.name}</td>
                                        <td>{categories.length}</td>
                                        <td className="text-center">
                                            <NavLink
                                                to={`/admin/competitions/parts/add/${params.competitionId}/${master._id}`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                Изменить
                                            </NavLink>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-danger" data-master-id={master._id}
                                                onClick={rmMasterHandler}
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div> }
            </div>
        </div>
    )
}