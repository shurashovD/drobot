import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const AddUserPage = () => {
    const [user, setUser] = useState({login: '', pass: '', name: '', avatar: null})
    const { request, sendFormData, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const file = useRef()
    const params = useParams()
    const links = [
        { to: '/admin/users', title: 'Пользователи' }
    ]

    const getUserById = useCallback(async id => {
        try {
            const response = await request('/api/users/get-user-by-id', 'POST', {id})
            setUser({...response, pass: ''})
        }
        catch {}
    }, [request])

    const saveHandler = async () => {
        try {
            const {message} = await sendFormData('/api/users/add-user', user, [{avatar: file.current}])
            setUser({login: '', pass: '', name: '', avatar: null})
            successAlert(message)
        }
        catch (e) {
            console.log(e);
        }
    }

    const updateHandler = async () => {
        try {
            const {message} = await sendFormData('/api/users/update-user', user, user.avatar ? [{avatar: file.current}] : null)
            setUser({login: '', pass: '', name: '', avatar: null})
            successAlert(message)
        }
        catch (e) {
            console.log(e);
        }
    }

    const fileInputHandler = event => {
        if ( event.target.files?.[0] ) {
            file.current = event.target.files[0]
            setUser(state => ({...state, avatar: URL.createObjectURL(file.current)}))
        }
    }

    const rmPhotoHandler = () => {
        file.current = null
        setUser(state => ({...state, avatar: null}))
    }

    useEffect(() => {
        if ( params.id ) {
            getUserById(params.id)
        }
    }, [params, getUserById])

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
                    { params.id ? <>Обновление пользователя</> : <>Создание пользователя</> }
                </h3>
                <div className="row align-items-stretch p-0 g-0">
                    <div className="col-12 col-sm-4 d-flex flex-column justify-content-center align-items-start">
                        { user.avatar && <img src={user.avatar} alt="avatar" width="300" /> }
                        <label className="btn btn-primary my-1" style={{width: '300px'}}>
                            { user.avatar ? <>Изменить фото</> : <>Добавить фото</> }
                            <input type="file" className="d-none" onChange={fileInputHandler} />
                        </label>
                        { user.avatar && <button className="btn btn-danger" onClick={rmPhotoHandler} style={{width: '300px'}}>Удалить фото</button> }
                    </div>
                    <div className="col-12 col-sm-8 d-flex flex-column">
                        <div className="row mb-2">
                            <label className="form-label">
                                <span className="me-2">Имя</span>
                                <input type="text" className="form-control" value={user.name}
                                    onChange={event => setUser(state => ({...state, name: event.target.value}))}
                                />
                            </label>
                        </div>
                        <div className="row mb-2">
                            <label className="form-label">
                                <span className="me-2">Логин</span>
                                <input type="text" className="form-control" value={user.login}
                                    onChange={event => setUser(state => ({...state, login: event.target.value}))}
                                />
                            </label>
                        </div>
                        <div className="row mb-2">
                            <label className="form-label">
                                <span className="me-2">Пароль</span>
                                <input type="text" className="form-control" value={user.pass}
                                    onChange={event => setUser(state => ({...state, pass: event.target.value}))}
                                />
                            </label>
                        </div>
                        <div className="row justify-content-around px-3 mt-auto">
                            <button className="btn btn-primary" onClick={() => params.id ? updateHandler() : saveHandler()}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}