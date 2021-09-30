import React, { useCallback, useEffect, useRef, useState } from "react"
import { Navbar } from "../compenets/Navbar"
import { Loader } from "../compenets/Loader"
import { useHttp } from "../hooks/http.hook"
import { useAlert } from "../hooks/alert.hook"
import { Rfid } from "../compenets/Rfid"

export const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', mail: '', category: '' })
    const [categories, setCategories] = useState([])
    const [masters, setMasters] = useState([])
    const [dropdown, setDropdown] = useState([])
    const [step, setStep] = useState('text')
    const masterId = useRef()
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()

    const getMasters = useCallback(async () => {
        try {
            const response = await request('/api/masters/get-all')
            setMasters(response)
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

    const nameChangeHandler = event => {
        setForm(state => ({...state, name: event.target.value}))
        masterId.current = null
        if ( event.target.value.length === 0 ) {
            setDropdown([])
        }
        else {
            setDropdown(
                masters.filter(({name}) => name.toLowerCase().includes(event.target.value.toLowerCase())).slice(0, 10)
            )
        }
    }

    const dropdownHandler = event => {
        const userId = event.target.getAttribute('data-user-id')
        masterId.current = userId
        const { name, mail } = masters.find(({_id}) => _id.toString() === userId.toString())
        setForm(state => ({...state, name, mail}))
        setDropdown([])
    }

    const rfidCallback = async rfid => {
        try {
            const { message } = await request('/api/notes/add-note', 'POST', { data: {...form, rfid}, masterId: masterId.current })
            successAlert(message)
            setStep('text')
            setForm({ name: '', mail: '', category: '' })
        }
        catch {}
    }

    const btnCallback = () => {
        setStep('text')
    }

    useEffect(() => {
        getMasters()
        getCategories()
    }, [getMasters, getCategories])

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, errorAlert, clearError])

    return (
        <div className="container-fluid p-0 min-vh-100 d-flex flex-column">
            { loading && <Loader /> }
            { step === 'rfid' && <Rfid rfidCallback={rfidCallback} btnCallback={btnCallback} btnTitle="Отмена" /> }
            { step === 'text' && <Navbar title="Регистрация" /> }
            { step === 'text' && <div className="container">
                <div className="row mt-5 gx-5">
                    <div className="col">
                        <div className="row">
                            <p className="text-center mb-2">Выбор категории</p>
                        </div>
                        <div className="row">
                            <select className="form-select fs-4" value={form.category}
                                onChange={event => setForm(state => ({...state, category: event.target.value}))}
                            >
                                <option value={''} className="fs-5">--Не выбрано--</option>
                                {
                                    categories.map(({_id, name}) => <option value={_id} key={_id} className="fs-5">{name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row">
                            <p className="text-center mb-2">Фамилия, имя участника</p>
                            <input className="form-control fs-4" value={form.name}
                                onChange={nameChangeHandler}
                            />
                            { dropdown.length > 0 && <div className="w-100 d-block position-relative p-0">
                                <div className="list-group position-absolute w-100">
                                    {
                                        dropdown.map(({_id, name}) => (
                                            <button type="button" className="list-group-item list-group-item-action border-primary" key={_id}
                                                data-user-id={_id}
                                                onClick={dropdownHandler}
                                            >
                                                {name}
                                            </button>
                                        ))
                                    }
                                </div>
                            </div> }
                        </div>
                    </div>
                    <div className="col">
                        <div className="row">
                            <p className="text-center mb-2">Электронная почта</p>
                            <input className="form-control fs-4" value={form.mail}
                                onChange={event => setForm(state => ({...state, mail: event.target.value}))}
                            />
                        </div>
                    </div>
                </div>
            </div> }
            { step === 'text' && <div className="row m-0 mt-auto mb-5">
                <button className="btn btn-primary col-auto mx-auto"
                    disabled={form.name === '' || form.category === ''}
                    onClick={() => setStep('rfid')}
                >
                    OK
                </button>
            </div> }
        </div>
    )
}