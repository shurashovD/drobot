import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const AddMasterPage = () => {
    const [master, setMaster] = useState({name: '', mail: '', link: '', avatar: null})
    const { request, sendFormData, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const file = useRef()
    const params = useParams()
    const links = [
        { to: '/admin/masters', title: 'Мастеры' }
    ]

    const getMasterById = useCallback(async id => {
        try {
            const response = await request('/api/masters/get-master-by-id', 'POST', {id})
            setMaster(response)
        }
        catch {}
    }, [request])

    const saveHandler = async () => {
        try {
            const {message} = await sendFormData('/api/masters/add-master', master, [{avatar: file.current}])
            setMaster({name: '', mail: '', link: '', avatar: null})
            successAlert(message)
        }
        catch (e) {
            console.log(e);
        }
    }

    const updateHandler = async () => {
        try {
            const {message} = await sendFormData('/api/masters/update-master', master, master.avatar ? [{avatar: file.current}] : null)
            successAlert(message)
        }
        catch (e) {
            console.log(e);
        }
    }

    const fileInputHandler = event => {
        if ( event.target.files?.[0] ) {
            file.current = event.target.files[0]
            setMaster(state => ({...state, avatar: URL.createObjectURL(file.current)}))
        }
    }

    const rmPhotoHandler = () => {
        file.current = null
        setMaster(state => ({...state, avatar: null}))
    }

    useEffect(() => {
        if ( params.id ) {
            getMasterById(params.id)
        }
    }, [params, getMasterById])

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
                    { params.id ? <>Обновление мастера</> : <>Создание мастера</> }
                </h3>
                <div className="row align-items-stretch p-0 g-0">
                    <div className="col-12 col-sm-4 d-flex flex-column justify-content-center align-items-start">
                        { master.avatar && <img src={master.avatar} alt="avatar" width="300" /> }
                        <label className="btn btn-primary my-1" style={{width: '300px'}}>
                            { master.avatar ? <>Изменить фото</> : <>Добавить фото</> }
                            <input type="file" className="d-none" onChange={fileInputHandler} />
                        </label>
                        { master.avatar && <button className="btn btn-danger" onClick={rmPhotoHandler} style={{width: '300px'}}>Удалить фото</button> }
                    </div>
                    <div className="col-12 col-sm-8 d-flex flex-column">
                        <div className="row mb-2">
                            <label className="form-label">
                                <span className="me-2">Имя</span>
                                <input type="text" className="form-control" value={master.name}
                                    onChange={event => setMaster(state => ({...state, name: event.target.value}))}
                                />
                            </label>
                        </div>
                        <div className="row mb-2">
                            <label className="form-label">
                                <span className="me-2">Почта</span>
                                <input type="text" className="form-control" value={master.mail}
                                    onChange={event => setMaster(state => ({...state, mail: event.target.value}))}
                                />
                            </label>
                        </div>
                        <div className="row mb-2">
                            <label className="form-label">
                                <span className="me-2">Сайт</span>
                                <input type="text" className="form-control" value={master.link}
                                    onChange={event => setMaster(state => ({...state, link: event.target.value}))}
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