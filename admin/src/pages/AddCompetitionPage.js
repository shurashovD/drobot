import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"
import { COMPETITION_STATUS_CREATED, COMPETITION_STATUS_FINISHED, COMPETITION_STATUS_PUBLISHED, COMPETITION_STATUS_STARTED } from "../redux/competitionStatuses"
import { COMPETITION_ROLE_FINAL_SCREEN, COMPETITION_ROLE_HYHINICAL, COMPETITION_ROLE_PHOTO, COMPETITION_ROLE_PREV, COMPETITION_ROLE_REFEREE, COMPETITION_ROLE_REGISTER, COMPETITION_ROLE_SCREEN } from "../redux/refereeRoles"

export const AddCompetitionPage = () => {
    const [competition, setCompetition] = useState({name: '', status: COMPETITION_STATUS_CREATED, categories: [], screens: [], stages: []})
    const [categDropdown, setCategDropdown] = useState([])
    const [categInput, setCategInput] = useState('')
    const candidateCategory = useRef()
    const categs = useRef()

    const [userDropdown, setUserDropdown] = useState([])
    const [userInput, setUserInput] = useState('')
    const users = useRef()

    const [screenDropdown, setScreenDropdown] = useState([])
    const [screenInput, setScreenInput] = useState('')
    const candidateScreen = useRef()

    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const params = useParams()
    const links = [
        { to: '/admin/competitions', title: 'Мероприятия' }
    ]

    const getCompetitionById = useCallback(async id => {
        try {
            const response = await request('/api/competitions/get-competition-by-id', 'POST', {id})
            setCompetition(response)
        }
        catch {}
    }, [request])

    const getCategories = useCallback(async () => {
        try {
            const response = await request('/api/categories/get-all')
            categs.current = response
        }
        catch {}
    }, [request])

    const getUsers = useCallback(async () => {
        try {
            const response = await request('/api/users/get-all')
            users.current = response
        }
        catch {}
    }, [request])

    const accordeonHandler = event => {
        const id = event.target.getAttribute('data-category-id')
        setCompetition(state => ({
            ...state,
            categories: state.categories.map(item => 
                ({
                    ...item, category: {...item.category, show: item.category._id.toString() === id.toString() ? !item.category.show : item.category.show}
                })
            )
        }))
    }

    const rmCategoryHandler = event => {
        const id = event.target.getAttribute('data-category-id')
        setCompetition(state => ({
            ...state,
            categories: state.categories.filter(({category}) => category._id.toString() !== id.toString())
        }))
    }

    const categInputChange = event => {
        const { value } = event.target
        const filterCategs = categs.current
            .filter(({_id}) => !competition.categories.some(({category}) => category._id.toString() === _id.toString()))
            .filter(({name}) => name.toLowerCase().includes(value.toLowerCase()))
        candidateCategory.current = null
        setCategDropdown(filterCategs)
        setCategInput(value)
    }

    const categDropdownHandler = event => {
        const id = event.target.getAttribute('data-category-id')
        const categ = categs.current.find(({_id}) => _id.toString() === id.toString())
        if ( categ ) {
            candidateCategory.current = id
            setCategInput(categ.name)
            setCategDropdown([])
        }
    }

    const addCategoryBtnHandler = () => {
        const category = categs.current.find(({_id}) => _id.toString() === candidateCategory.current.toString())
        setCompetition(state => ({
            ...state, categories: state.categories.concat([{category, referees: []}])
        }))
        candidateCategory.current = null
        setCategInput('')
    }

    const refereeRoleHandler = event => {
        const categoryId = event.target.getAttribute('data-category-id')
        const userId = event.target.getAttribute('data-user-id')
        setCompetition(state => ({
            ...state, categories: state.categories.map(item => {
                if ( item.category._id.toString() === categoryId.toString() ) {
                    const referees = item.referees.map(referee => {
                        const { _id } = referee
                        if ( _id.toString() === userId.toString() ) {
                            return {...referee, role: event.target.value}
                        }
                        return referee
                    })
                    return {...item, referees}
                }
                return item
            })
        }))
    }

    const rmReferee = event => {
        const categoryId = event.target.getAttribute('data-category-id')
        const userId = event.target.getAttribute('data-user-id')
        setCompetition(state => ({
            ...state, categories: state.categories.map(item => {
                if ( item.category._id.toString() === categoryId.toString() ) {
                    const referees = item.referees.filter(({_id}) => _id.toString() !== userId.toString())
                    return {...item, referees}
                }
                return item
            })
        }))
    }

    const userInputChange = event => {
        const { value } = event.target
        const filterUsers = users.current
            .filter(({name}) => name.toLowerCase().includes(value.toLowerCase()))
        setUserDropdown(filterUsers)
        setUserInput(value)
    }

    const userDropdownHandler = event => {
        const userId = event.target.getAttribute('data-user-id')
        const categoryId = event.target.getAttribute('data-category-id')
        console.log(categoryId);
        const user = users.current.find(({_id}) => _id.toString() === userId.toString())
        if ( user ) {
            setCompetition(state => ({
                ...state,
                categories: state.categories.map(item => {
                    if ( item.category._id.toString() === categoryId.toString() ) {
                        const referees = item.referees.concat([{...user, role: COMPETITION_ROLE_REFEREE}])
                        return {...item, referees}
                    }
                    return item
                })
            }))
            setUserInput('')
            setUserDropdown([])
        }
    }

    const screenInputChange = event => {
        const { value } = event.target
        const filterUsers = users.current
            .filter(({_id}) => !competition.categories.some(({referees}) => referees.some(referee => referee._id.toString() === _id.toString())))
            .filter(({_id}) => !competition.screens.some(({screen}) => screen._id.toString() === _id.toString()))
            .filter(({name}) => name.toLowerCase().includes(value.toLowerCase()))
        candidateScreen.current = null
        setScreenDropdown(filterUsers)
        setScreenInput(value)
    }

    const screenDropdownHandler = event => {
        const id = event.target.getAttribute('data-user-id')
        const user = users.current.find(({_id}) => _id.toString() === id.toString())
        if ( user ) {
            candidateScreen.current = id
            setScreenInput(user.name)
            setScreenDropdown([])
        }
    }

    const addScreenBtnHandler = () => {
        const screen = users.current.find(({_id}) => _id.toString() === candidateScreen.current.toString())
        setCompetition(state => ({
            ...state, screens: state.screens.concat([{ screen, categories: [], role: COMPETITION_ROLE_SCREEN }])
        }))
        candidateScreen.current = null
        setScreenInput('')
    }

    const screenAccordeonHandler = event => {
        const id = event.target.getAttribute('data-screen-id')
        setCompetition(state => ({
            ...state,
            screens: state.screens.map(item => 
                {
                    return {...item, show: (item.screen._id.toString() === id.toString()) ? !item.show : item.show}
                }
            )
        }))
    }

    const screeneRoleHandler = event => {
        const screenId = event.target.getAttribute('data-screen-id')
        setCompetition(state => ({
            ...state,
            screens: state.screens.map(item => {
                if ( item.screen._id.toString() === screenId.toString() ) {
                    return { ...item, role: event.target.value }
                }
                return item
            })
        }))
    }

    const screenCategoryHandler = event => {
        const screenId = event.target.getAttribute('data-screen-id')
        const categoryId = event.target.getAttribute('data-category-id')
        const category = categs.current.find(({_id}) => _id.toString() === categoryId.toString())
        setCompetition(state => ({
            ...state,
            screens: state.screens.map(item => {
                if ( item.screen._id.toString() === screenId.toString() ) {
                    const categories = event.target.checked ?
                        item.categories.concat([category]) : item.categories.filter(({_id}) => _id.toString() !== categoryId.toString())
                    return { ...item, categories }
                }
                return item
            })
        }))
    }
    
    const rmScreenHandler = event => {
        const id = event.target.getAttribute('data-screen-id')
        setCompetition(state => ({
            ...state,
            screens: state.screens.filter(({screen}) => screen._id.toString() !== id.toString())
        }))
    }

    const addStageBtnHandler = () => {
        const number = Math.max(...competition.stages.map(({number}) => number), 0) + 1
        setCompetition(state => ({
            ...state, stages: state.stages.concat([{ _id: performance.now(), number, categories: [] }])
        }))
    }

    const stageAccordeonHandler = event => {
        const id = event.target.getAttribute('data-stage-id')
        setCompetition(state => ({
            ...state,
            stages: state.stages.map(item => 
                {
                    return {...item, show: (item._id.toString() === id.toString()) ? !item.show : item.show}
                }
            )
        }))
    }

    const rmStageHandler = event => {
        const id = event.target.getAttribute('data-stage-id')
        setCompetition(state => ({
            ...state,
            stages: state.stages.filter(({_id}) => _id.toString() !== id.toString())
        }))
    }

    const stageCategoryHandler = event => {
        const stageId = event.target.getAttribute('data-stage-id')
        const categoryId = event.target.getAttribute('data-category-id')
        setCompetition(state => ({
            ...state,
            stages: state.stages.map(item => {
                if ( item._id.toString() === stageId.toString() ) {
                    const categories = event.target.checked ?
                        item.categories.concat([categoryId]) : item.categories.filter(cId => cId.toString() !== categoryId.toString())
                    return { ...item, categories }
                }
                return item
            })
        }))
    }

    const saveHandler = async () => {
        const data = {
            ...competition,
            categories: competition.categories.map(item => {
                const category = item.category._id
                const referees = item.referees.map(({_id, role}) => ({referee: _id, role}))
                return { category, referees }
            }),
            screens: competition.screens.map(item => {
                const screen = item.screen._id
                const categories = item.categories.map(({_id}) => _id)
                const role = item.role
                return { screen, categories, role }
            }),
            stages: competition.stages.map(item => (
                { number: item.number, categories: item.categories }
            ))
        }
        try {
            const {message} = await request('/api/competitions/add-competition', 'POST', { competition: data})
            setCompetition({name: '', status: '', categories: [], screens: []})
            successAlert(message)
        }
        catch (e) {
            console.log(e);
        }
    }

    const updateHandler = async () => {
        const data = {
            ...competition,
            categories: competition.categories.map(item => {
                const category = item.category._id
                const referees = item.referees.map(({_id, role}) => ({referee: _id, role}))
                return { category, referees }
            }),
            screens: competition.screens.map(item => {
                const screen = item.screen._id
                const categories = item.categories.map(({_id}) => _id)
                const role = item.role
                return { screen, categories, role }
            }),
            stages: competition.stages.map(item => (
                { number: item.number, categories: item.categories }
            ))
        }
        try {
            const {message} = await request('/api/competitions/update-competition', 'POST', {id: params.id, competition: data})
            successAlert(message)
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getCategories()
        getUsers()
        if ( params.id ) {
            getCompetitionById(params.id)
        }
    }, [params, getCompetitionById, getCategories, getUsers])

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
                    { params.id ? <>Обновление мероприятия</> : <>Создание мероприятия</> }
                </h3>
                <div className="row mb-2">
                    <label className="form-label col-md-4">
                        <h4>Название</h4>
                        <input type="text" className="form-control" value={competition.name}
                            onChange={event => setCompetition(state => ({...state, name: event.target.value}))}
                        />
                    </label>
                    <label className="form-label col-md-4">
                        <h4>Статус</h4>
                        <select className="form-select" onChange={event => setCompetition(state => ({...state, status: event.target.value}))}
                            value={competition.status}
                        >
                            <option value={COMPETITION_STATUS_CREATED}>Создано</option>
                            <option value={COMPETITION_STATUS_STARTED}>В работе</option>
                            <option value={COMPETITION_STATUS_FINISHED}>Завершено</option>
                            <option value={COMPETITION_STATUS_PUBLISHED}>Опубликовано</option>
                        </select>
                    </label>
                </div>
                <h4>Категории</h4>
                {
                    competition.categories.map(item => {
                        const {category, referees} = item
                        const { _id, name, show } = category
                        return (
                            <div className="accordion mb-1" key={_id}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className={"accordion-button " + (!show && "collapsed")} type="button"
                                            data-category-id={_id}
                                            onClick={accordeonHandler}
                                        >
                                            {name}
                                        </button>
                                    </h2>
                                    <div className={"accordion-collapse collapse " + (show && "show")}>
                                        <div className="accordion-body">
                                            <button className="col btn btn-outline-danger my-1" type="button"
                                                data-category-id={_id}
                                                onClick={rmCategoryHandler}
                                            >
                                                Удалить категорию
                                            </button>
                                            <div className="table-responsive">
                                                { referees.length > 0 && <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Имя</th>
                                                            <th>Логин</th>
                                                            <th>Роль</th>
                                                            <th>Удалить</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        referees.map(referee => {
                                                            const { avatar, name, login, role } = referee
                                                            const userId = referee._id
                                                            return (
                                                                <tr key={`${_id}_${userId}`}>
                                                                    <td>
                                                                        { avatar?.length > 0 && <img alt="avatar" src={avatar} width="64" /> }
                                                                    </td>
                                                                    <td>{name}</td>
                                                                    <td>{login}</td>
                                                                    <td>
                                                                        <select className="form-select" aria-label="Default select example"
                                                                            value={role}
                                                                            data-category-id={_id}
                                                                            data-user-id={userId}
                                                                            onChange={refereeRoleHandler}
                                                                        >
                                                                            <option value={COMPETITION_ROLE_REFEREE}>Судья</option>
                                                                            <option value={COMPETITION_ROLE_REGISTER}>Регистратор</option>
                                                                            <option value={COMPETITION_ROLE_PHOTO}>Фотограф</option>
                                                                            <option value={COMPETITION_ROLE_PREV}>Предварительный судья</option>
                                                                            <option value={COMPETITION_ROLE_HYHINICAL}>Гигиенист</option>
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <button className="btn-sm btn-danger" onClick={rmReferee}
                                                                            data-category-id={_id}
                                                                            data-user-id={userId}
                                                                        >
                                                                            Удалить
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                </table> }
                                                <div className="col col-md-4 overflow-hidden">
                                                    <input type="text" className={"form-control " + (userDropdown.length > 0 && "rounded-0 rounded-top")}
                                                        placeholder="Добавить судью по имени"
                                                        value={userInput}
                                                        onChange={userInputChange}
                                                    />
                                                    {
                                                        <div className="dropdown position-absolute rounded-0 rounded-bottom" style={{zIndex: 1080}}>
                                                            {
                                                                userDropdown.map(user => (
                                                                        <button type="button" className="list-group-item list-group-item-action w-100"
                                                                            key={`d_${_id}_${user._id}`}
                                                                            data-user-id={user._id}
                                                                            data-category-id={_id}
                                                                            onClick={userDropdownHandler}
                                                                        >
                                                                            {user.name}
                                                                        </button>
                                                                ))
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="row mb-3">
                    <div className="col col-md-4">
                        <input type="text" className={"form-control " + (categDropdown.length > 0 && "rounded-0 rounded-top")}
                            placeholder="Название категории"
                            value={categInput}
                            onChange={categInputChange}
                        />
                        {
                            categDropdown.length > 0 && (
                                <div className="position-relative"  style={{zIndex: 1080}}>
                                    <div className="list-group position-absolute w-100 rounded-0 rounded-bottom" style={{zIndex: 1080}}>
                                    {
                                        categDropdown.map(({_id, name}) => (
                                            <button type="button" className="list-group-item list-group-item-action"
                                                key={`d_${_id}`}
                                                data-category-id={_id}
                                                onClick={categDropdownHandler}
                                            >
                                                {name}
                                            </button>
                                        ))
                                    }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <button className="btn btn-primary col-auto" disabled={!candidateCategory.current} onClick={addCategoryBtnHandler}>
                        Добавить
                    </button>
                </div>
                <h4>Этапы</h4>
                {
                    competition.stages.map(({_id, number, categories, show}) => {
                        return (
                            <div className="accordion mb-1" key={_id}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className={"accordion-button " + (!show && "collapsed")} type="button"
                                            data-stage-id={_id}
                                            onClick={stageAccordeonHandler}
                                        >
                                            Этап {number}
                                        </button>
                                    </h2>
                                    <div className={"accordion-collapse collapse " + (show && "show")}>
                                        <div className="accordion-body">
                                            <div className="row align-items-center">
                                                <button className="col btn btn-outline-danger my-1 col-auto" type="button"
                                                    data-stage-id={_id}
                                                    onClick={rmStageHandler}
                                                >
                                                    Удалить этап
                                                </button>
                                            </div>
                                            {
                                                competition.categories?.length > 0 &&
                                                <ul className="list-group">
                                                    {
                                                        competition.categories.map(({category}) => (
                                                            <li className="list-group-item" key={`stage-category-${category._id}`}>
                                                                <input className="form-check-input me-1" type="checkbox"
                                                                    data-category-id={category._id}
                                                                    data-stage-id={_id}
                                                                    checked={
                                                                        categories.some(item => item.toString() === category._id.toString())
                                                                    }
                                                                    onChange={stageCategoryHandler}
                                                                />
                                                                {category.name}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="row mb-3">
                    <button className="btn btn-primary col-auto" onClick={addStageBtnHandler}>
                        Добавить
                    </button>
                </div>
                <h4>Экраны</h4>
                {
                    competition.screens.map(({screen, categories, role, show}) => {
                        const {_id, name} = screen
                        return (
                            <div className="accordion mb-1" key={_id}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className={"accordion-button " + (!show && "collapsed")} type="button"
                                            data-screen-id={_id}
                                            onClick={screenAccordeonHandler}
                                        >
                                            {name}
                                        </button>
                                    </h2>
                                    <div className={"accordion-collapse collapse " + (show && "show")}>
                                        <div className="accordion-body">
                                            <div className="row align-items-center">
                                                <div className="col-3">
                                                    <select className="form-select" onChange={screeneRoleHandler} value={role} data-screen-id={_id}>
                                                        <option value={COMPETITION_ROLE_SCREEN}>Рабочий экран</option>
                                                        <option value={COMPETITION_ROLE_FINAL_SCREEN}>Финальный экран</option>
                                                    </select>
                                                </div>
                                                <button className="col btn btn-outline-danger my-1 col-auto" type="button"
                                                    data-screen-id={_id}
                                                    onClick={rmScreenHandler}
                                                >
                                                    Удалить экран
                                                </button>
                                            </div>
                                            {
                                                competition.categories?.length > 0 &&
                                                <ul className="list-group">
                                                    {
                                                        competition.categories.map(({category}) => (
                                                            <li className="list-group-item" key={`screen-category-${category._id}`}>
                                                                <input className="form-check-input me-1" type="checkbox"
                                                                    data-category-id={category._id}
                                                                    data-screen-id={_id}
                                                                    checked={
                                                                        categories.some(item => item._id.toString() === category._id.toString())
                                                                    }
                                                                    onChange={screenCategoryHandler}
                                                                />
                                                                {category.name}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="row mb-3">
                    <div className="col col-md-4">
                        <input type="text" className={"form-control " + (screenDropdown.length > 0 && "rounded-0 rounded-top")}
                            placeholder="Название экрана"
                            value={screenInput}
                            onChange={screenInputChange}
                        />
                        {
                            screenDropdown.length > 0 && (
                                <div className="position-relative">
                                    <div className="list-group position-absolute w-100 rounded-0 rounded-bottom">
                                    {
                                        screenDropdown.map(({_id, name}) => (
                                            <button type="button" className="list-group-item list-group-item-action"
                                                key={`d_${_id}`}
                                                data-user-id={_id}
                                                onClick={screenDropdownHandler}
                                            >
                                                {name}
                                            </button>
                                        ))
                                    }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <button className="btn btn-primary col-auto" disabled={!candidateScreen.current} onClick={addScreenBtnHandler}>
                        Добавить
                    </button>
                </div>
                <div className="row mt-4">
                    <button className="btn btn-primary" onClick={() => params.id ? updateHandler() : saveHandler() }>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}