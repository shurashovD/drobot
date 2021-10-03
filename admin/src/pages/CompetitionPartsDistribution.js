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
                const item = arr.find(({number}) => number === note.number)
                if ( item ) {
                    item.stages.push({ stageNumber: stage, name: note.master.name })
                    return arr
                }
                arr.push({
                    number: note.number,
                    stages: [{ stageNumber: stage, name: note.master.name }]
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
                                parts.map(({number, stages}) => (
                                    <tr key={number}>
                                        <td>{number}</td>
                                        {
                                            competition.stages.map(stage => {
                                                const item = stages.find(({stageNumber}) => stageNumber === stage.number)
                                                return item ?
                                                    <td key={`${number}_${stage.number}`}>{item.name}</td> :
                                                    <td key={`${number}_${stage.number}`}>Пусто</td>
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