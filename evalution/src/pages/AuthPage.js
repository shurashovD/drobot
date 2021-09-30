import React, { useEffect, useState } from "react"
import { Loader } from '../compenets/Loader'
import PromoImg from '../img/promo.svg'
import loginBgi from '../img/loginBgi.svg'
import passBgi from '../img/passBgi.svg'
import entranceImg from '../img/entrance.svg'
import { useHttp } from '../hooks/http.hook'
import { useAlert } from '../hooks/alert.hook'
import { useAuth } from "../hooks/auth.hook"

export const AuthPage = () => {
    const [form, setForm] = useState({ login: '', pass: '' })
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert } = useAlert()
    const { login } = useAuth()

    const styles = {
        login: {
            backgroundImage: `url(${loginBgi})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left 15px center',
            paddingLeft: '40px'
        },
        pass: {
            backgroundImage: `url(${passBgi})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left 15px center',
            paddingLeft: '40px'
        }
    }

    const handler = async () => {
        try {
            const response = await request('/api/auth/login', 'POST', form)
            login(response)
        }
        catch {}
    }

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, errorAlert, clearError])
    
    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center p-0">
            { loading && <Loader /> }
            <div className="col-12 col-sm-4">
                <div className="row justify-content-center mb-3 p-0">
                    <img src={PromoImg} alt="promo" className="col-9 m-auto" />
                </div>
                <h4 className="mb-2 text-center">Авторизация</h4>
                <div className="row mb-2">
                    <div className="col-9 mx-auto">
                        <input className="form-control" placeholder="Логин" style={styles.login}
                            value={form.login}
                            onChange={event => setForm(state => ({...state, login: event.target.value}))}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-9 mx-auto">
                        <input type="password" className="form-control" placeholder="Пароль" style={styles.pass}
                            value={form.pass}
                            onChange={event => setForm(state => ({...state, pass: event.target.value}))}
                        />
                    </div>
                </div>
                <div className="row mb-2">
                    <button className="btn btn-primary col-auto m-auto"
                        onClick={handler}
                    >
                        <img src={entranceImg} alt="entrance" className="mb-1" />
                        <span className="text-light ms-1">Войти</span>
                    </button>
                </div>
            </div>
        </div>
    )
}