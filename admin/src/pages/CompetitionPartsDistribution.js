import { useCallback, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const CompetitionPartsDistributuion = () => {
    const [competition, setCompetition] = useState()
    const [notes, setNotes] = useState([])
    const [parts, setParts]= useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert } = useAlert()
    const params = useParams()
    const links = [
        { to: '/admin/competitions', title: 'Мероприятия' },
        { to: '/admin/competitions/parts', title: 'Участники' }
    ]

    const getNotes = useCallback(async id => {
        try {
            const response = await request('/api/notes/get-all', 'POST', {competitionId: id})
            setNotes(response)
        }
        catch {}
    }, [request])

    const getCompetitionById = useCallback(async id => {
        try {
            const response = await request('/api/competitions/get-competition-by-id', 'POST', {id})
            setCompetition(response)
        }
        catch {}
    }, [request])

    useEffect(() => {
        if ( notes, competition ) {
            const result = notes.reduce((arr, note) => {
                const stage = competition.stages.find(({categories}) => categories.some(item => item.toString() === note.category._id.toString())).number
                if ( arr.some(({_id}) => _id.toString() === note.master._id.toString()) ) {
                    arr.find(({_id}) => _id.toString() === note.master._id.toString()).stages.push(stage)
                    return arr
                }
                arr.push({
                    _id: note.master._id, number: note.number, name: note.master.name,
                    stages: [stage]
                })
                return arr
            }, [])
            setParts(result)
        }
    }, [notes, competition])

    useEffect(() => {
        if ( params.competitionId ) {
            getNotes(params.competitionId)
            getCompetitionById(params.competitionId)
        }
    }, [params, getNotes, getCompetitionById])

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
                    { parts.length > 0 ? <>Распределение участников</> : <>Нет зарегистрированных участников</> }
                </h3>
                { competition && parts.length > 0 && <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                {
                                    competition.stages.map(({number}) => <th>Поток {number}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parts.map(({_id, number, name, stages}) => (
                                    <tr key={_id}>
                                        <td>{number}</td>
                                        {
                                            competition.stages.map(({number}) => {
                                                return stages.some(item => item === number) ?
                                                    <td key={`${_id}_${number}`}>{name}</td> :
                                                    <td key={`${_id}_${number}`}>Пусто</td>
                                            })
                                        }
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