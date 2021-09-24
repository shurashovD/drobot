import React, { useEffect, useState } from "react"
import { useAuth } from "../hooks/auth.hook"
import { useHttp } from "../hooks/http.hook"

export const AuthPage = () => {
    const [form, setForm] = useState({ login: '', pass: '' })
    const { request, error, clearError, loading } = useHttp()
    const { login } = useAuth()

    const handleSubmit = async event => {
        event.preventDefault()
        try {
            const {_id} = await request('/api/auth/login', 'POST', form)
            login(_id)
        }
        catch (e) {}
    } 

    useEffect(() => {
        if ( error ) {
            setTimeout(clearError, 3000)
        }
    }, [error, clearError])

    return (
        <div className="container-fluid min-vh-100 d-flex p-0">
            { error &&
                <div className="position-absolute top-0 left-center w-100 m-0 p-1">
                    <div className="alert alert-danger">
                        { error }
                    </div>
                </div>
            }
            <form className="m-auto p-3 bg-light rounded" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">
                        Логин
                        <input type="text" className="form-control" value={form.login}
                            onChange={event => setForm(state => ({...state, login: event.target.value}))}
                        />
                    </label>
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        Пароль
                        <input type="password" className="form-control" value={form.pass}
                            onChange={event => setForm(state => ({...state, pass: event.target.value}))}
                        />
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    { !loading && <>GO</> }
                    { loading && <span className="spinner-border text-primary" /> }
                </button>
            </form>
        </div>
    )
}