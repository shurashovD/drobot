import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const AddCategoryPage = () => {
    const [category, setCategory] = useState({name: '', tasks: []})
    const [showAdd, setShowAdd] = useState(false)
    const [update, setUpdate] = useState(false)
    const [form, setForm] = useState({ name: '', description: '' })
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const params = useParams()
    const links = [
        { to: '/admin/categories', title: 'Категории' }
    ]

    const getCategoryById = useCallback(async id => {
        try {
            const response = await request('/api/categories/get-category-by-id', 'POST', {id})
            setCategory(response)
        }
        catch {}
    }, [request])

    const addTaskHandler = () => {
        const { name, description } = form
        setShowAdd(false)
        setForm({ name: '', description: '' })
        if ( name.length > 0 ) {
            setCategory(state => ({...state, tasks: state.tasks.concat({_id: performance.now(), name, description})}))
        }
    }

    const rmTaskHandler = event => {
        const _id = event.target.getAttribute('data-task-id')
        setCategory(state => ({...state, tasks: state.tasks.filter(task => task._id.toString() !== _id.toString())}))
    }

    const saveHandler = async () => {
        try {
            const {message} = await request('/api/categories/add-category', 'POST', category)
            setCategory({name: '', tasks: []})
            successAlert(message)
        }
        catch (e) {}
    }

    const updateHandler = async () => {
        try {
            const {message} = await request('/api/categories/update-category', 'POST', {category, id: params.id})
            successAlert(message)
        }
        catch (e) {}
    }

    useEffect(() => {
        if ( params.id ) {
            getCategoryById(params.id)
        }
    }, [params])

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, clearError, errorAlert])

    return (
        <div className="container-fluid p-0">
            { loading && <Loader /> }
            {
                showAdd &&
                <div className="container-fluid position-absolute top-0 left-0 min-vh-100 m-0 bg-light d-flex p-0">
                    <form className="col-12 col-sm-4 m-auto">
                        <div className="mb-3">
                            <label className="form-label w-100">
                                <span>Название критерия</span>
                                <input type="text" className="form-control" value={form.name}
                                    onChange={event => setForm(state => ({...state, name: event.target.value}))}
                                />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label w-100">
                                <span>Описание критерия</span>
                                <textarea class="form-control" rows="3" value={form.description}
                                    onChange={event => setForm(state => ({...state, description: event.target.value}))}
                                />
                            </label>
                        </div>
                        <div className="row justify-content-around">
                            <button type="button" className="btn btn-primary col-auto" onClick={addTaskHandler}>
                                Добавить
                            </button>
                            <button type="button" className="btn btn-primary col-auto" onClick={() => setShowAdd(false)}>
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            }
            <Navbar links={links} />
            <div className="container">
                <h3 className="mt-3">
                    { params.id ? <>Обновление категории</> : <>Создание категории</> }
                </h3>
                <div className="row">
                    <label className="form-label">
                        <span className="me-2">Название</span>
                        <input type="text" className="form-control" value={category.name}
                            onChange={event => setCategory(state => ({...state, name: event.target.value}))}
                        />
                    </label>
                </div>
                <p className="mt-3">Критерии</p>
                <div className="table-responsive">
                    <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Критерий</th>
                            <th scope="col">Описание критерия</th>
                            <th scope="col">Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            category.tasks.map(({_id, name, description}, index) => (
                                <tr key={_id}>
                                    <td>{index + 1}</td>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" data-task-id={_id} onClick={rmTaskHandler}>
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        <tr>
                            <td colSpan="4">
                                <button className="btn btn-outline-primary" onClick={() => setShowAdd(true)}>Добавить</button>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div className="row justify-content-around mt-3">
                    <button className="btn btn-primary" onClick={() => params.id ? updateHandler() : saveHandler()}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}