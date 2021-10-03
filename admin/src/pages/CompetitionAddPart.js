import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const CompetitionAddParts = () => {
    const [competition, setCompetition] = useState()
    const [note, setNote] = useState()
    const masters = useRef([])
    const [categories, setCategories] = useState([])

    const [input, setInput] = useState('')
    const [dropdown, setDropdown] = useState([])

    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const params = useParams()
    const links = [
        { to: `/admin/competitions/parts/${params.competitionId}`, title: 'Участники' }
    ]

    const getCompetitionById = useCallback(async id => {
        try {
            const response = await request('/api/competitions/get-competition-by-id', 'POST', {id})
            setCompetition(response)
        }
        catch {}
    }, [request])

    const getMasters = useCallback(async () => {
        try {
            const response = await request('/api/masters/get-all')
            masters.current = response
        }
        catch {}
    }, [request])

    const getCategories = useCallback(async () => {
        try {
            const response = await request('/api/categories/get-all')
            setCategories(response)
        }
        catch {}
    }, [request])

    const getNotesByMsater = useCallback(async id => {
        try {
            const currMaster = masters.current.find(({_id}) => _id.toString() === id.toString())
            const response = await request('/api/notes/get-by-master', 'POST', { masterId: id, competitionId: params.competitionId })
            const result = response.reduce((res, item) => ({
                ...res, categories: res.categories.concat({category: item.category._id, myModel: item?.myModel})
            }), {
                master: response[0]?.master ?? currMaster,
                categories: response[0]?.category ? [{category: response[0].category._id, myModel: response[0]?.myModel}] : []
            })
            setNote(result)
            setInput(result.master.name)
        }
        catch {}
    }, [request, params.competitionId])

    const inputChange = event => {
        const { value } = event.target
        const filterMasters = masters.current
            .filter(({name}) => name.toLowerCase().includes(value.toLowerCase()))
        if ( event.target.value === '' ) {
            setDropdown('')
        }
        else {
            setDropdown(filterMasters)
        }
        setInput(value)
        setNote(null)
    }

    const dropdownHandler = async event => {
        const id = event.target.getAttribute('data-master-id')
        const master = masters.current.find(({_id}) => _id.toString() === id.toString())
        if ( master ) {
            setInput(master.name)
            setDropdown([])
            getNotesByMsater(id)
        }
    }

    const categoryHandler = event => {
        const categoryId = event.target.getAttribute('data-category-id')
        const categoriesByStage = competition.stages.find(({categories}) => categories.some(item => item.toString() === categoryId.toString())).categories
        setNote(state => ({
            ...state,
            categories: state.categories.some(item => item.toString() === categoryId.toString()) ?
                state.categories.filter(item => item.toString() !== categoryId.toString()) :
                state.categories
                    .filter(({category}) => !categoriesByStage.some(el => el.toString() === category.toString()))
                    .concat({category: categoryId, myModel: false})
        }))
    }

    const myModelHandler = event => {
        const categoryId = event.target.getAttribute('data-category-id')
        const categoriesByStage = competition.stages.find(({categories}) => categories.some(item => item.toString() === categoryId.toString())).categories
        setNote(state => ({
            ...state,
            categories: state.categories.some(item => item.toString() === categoryId.toString()) ?
                state.categories.filter(item => item.toString() !== categoryId.toString()) :
                state.categories
                    .filter(({category}) => !categoriesByStage.some(el => el.toString() === category.toString()))
                    .concat({category: categoryId, myModel: event.target.checked})
        }))
    }

    const saveHandler = async () => {
        try {
            const { message } = await request('/api/notes/prev-register', 'POST', { competitionId: params.competitionId, note })
            successAlert(message)
            setInput('')
            setNote(null)
        }
        catch {}
    }

    useEffect(() => {
        getCategories()
        getMasters()
        if ( params.competitionId ) {
            getCompetitionById(params.competitionId)
        }
        if ( params.masterId ) {
            getNotesByMsater(params.masterId)
        }
    }, [params, getCompetitionById, getCategories, getMasters, getNotesByMsater])

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
                <h3 className="my-3">Редактирование предварительной заявки</h3>
                <div className="row mb-3">
                    <div className="col-12">
                        <h4>Имя мастера</h4>
                        <div className="col-4">
                            <input className={"form-control " + (dropdown.length > 0 && "rounded-0 rounded-top")} value={input} onChange={inputChange} />
                            <div className="col-12 position-relative">
                                { dropdown && <div className="list-group position-absolute w-100 rounded-0 rounded-bottom" style={{zIndex: 1}}>
                                    {
                                        dropdown.slice(0, 10).map(({_id, name}) => (
                                            <button type="button" className="list-group-item list-group-item-action" key={`list_${_id}`}
                                                data-master-id={_id}
                                                onClick={dropdownHandler}
                                            >
                                                {name}
                                            </button>
                                        ))
                                    }
                                </div> }
                            </div>
                        </div>
                    </div>
                </div>
                { note && <h4>Категории</h4> }
                {
                    note && competition?.stages.map(stage => {
                        return (
                            <div className="col-md-8">
                                <ul className="list-group">
                                    <li className="list-group-item bg-light">
                                        Поток {stage.number}
                                    </li>
                                {
                                    stage.categories.map(item => {
                                        return (
                                            <li className="list-group-item d-flex" key={`categs_list_${item}`}>
                                                <input className="form-check-input me-1" type="checkbox"
                                                    checked={note.categories.some(({category}) => category.toString() === item.toString())}
                                                    data-category-id={item}
                                                    onChange={categoryHandler}
                                                />
                                                {
                                                    categories.find(({_id}) => _id.toString() === item.toString())?.name
                                                }
                                                <div className="ms-auto me-2 d-flex align-items-center">
                                                    <span className="me-2 text-primary">своя модель</span>
                                                    <input className="form-check-input" type="checkbox"
                                                        disabled={!note.categories.some(({category}) => category.toString() === item.toString())}
                                                        checked={note.categories.find(({category}) => category.toString() === item.toString())?.myModel ?? false}
                                                        data-category-id={item}
                                                        onChange={myModelHandler}
                                                    />
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                                </ul>
                            </div>
                        )
                    })
                }
                <div className="row mt-4">
                    <button className="btn btn-primary" onClick={saveHandler}
                        disabled={!(note?.categories.length > 0)}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}