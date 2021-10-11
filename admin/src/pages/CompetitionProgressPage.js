import { useCallback, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"
/*

export const CompetitionProgressPage = () => {
    const [filterNotes, setFilterNotes] = useState([])
    const [notes, setNotes] = useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert } = useAlert()
    const params = useParams()
    const links = [
        { to: '/admin/competitions', title: 'Мероприятия' }
    ]

    useEffect(() => {
        const getResult = async () => {
            try {
                const response = await request('/api/notes/get-all', 'POST', {competitionId: id})
                setNotes(response)
                setFilterNotes(response)
            }
            catch {}
        }
        if ( !loading && pole ) {
            setPole(false)
            getResult()
            setTimeout(() => setPole(true), 60 * 1000)
        }
    }, [request, loading, authState, pole])

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
        <div className="container-fluid">
            { loading && <Loader /> }
            <Navbar links={links} />
            <div className="container">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Стол</th>
                                <th>Мастер</th>
                                <th>Категория</th>
                                <th>RFID</th>
                                <th>Фото</th>
                                <th>Гигиена</th>
                                <th>Судьи</th>
                                <th>Сумма</th>
                                <th>Среднее</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filterNotes.map(note => {
                                    return (
                                        <tr key={note._id} className={note.complete && "bg-light"}>
                                            <td>{note._id.toString()}</td>
                                            <td>{note.number}</td>
                                            <td>{note.master.name}</td>
                                            <td>{note.category.name}</td>
                                            <td>{note.rfid}</td>
                                            <td>{note.photos?.length ?? 0}</td>
                                            <td>{
                                                !note.hygienicalScore.referee &&
                                                (note.previousScore.value + note.hygienicalScore.value)
                                            }</td>
                                            <td>{note.scores?.length ?? 0}</td>
                                            <td>{note.total}</td>
                                            <td>{note.middle}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}*/

export const CompetitionProgressPage = () => <h1>CompetitionProgressPage</h1>