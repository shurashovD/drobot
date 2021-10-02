import React, { useCallback, useEffect, useRef, useState } from "react"
import { Navbar } from "../compenets/Navbar"
import { Loader } from "../compenets/Loader"
import { useHttp } from "../hooks/http.hook"
import { useAlert } from "../hooks/alert.hook"
import { Rfid } from "../compenets/Rfid"

export const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', category: '', mail: '' })
    const [categories, setCategories] = useState([])
    const [notes, setNotes] = useState([])
    const [dropdown, setDropdown] = useState([])
    const [step, setStep] = useState('text')
    const masterId = useRef()
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()

    const getNotes = useCallback(async () => {
        try {
            const response = await request('/api/notes/get-all-in-current-competition')
            const result = response.reduce((arr, item) => {
                const index = arr.findIndex(el => el.master._id.toString() === item.master._id.toString())
                if ( index !== -1 ) {
                    arr[index].categories.push(item.category)
                    return arr
                }
                arr.push({ master: item.master, categories: [item.category] })
                return arr
            }, [])
            setNotes(result)
        }
        catch(e) {console.log(e);}
    }, [request])

    const getCategories = useCallback(async () => {
        try {
            const response = await request('/api/categories/get-by-current-cometition')
            setCategories(response)
        }
        catch {}
    }, [request])

    const selectHandler = event => {
        setForm(state => ({...state, category: event.target.value, name: ''}))
        setDropdown([])
        masterId.current = null
    }

    const nameChangeHandler = event => {
        masterId.current = null
        setForm(state => ({ ...state, name: event.target.value, mail: '' }))
        if ( event.target.value === '' ) {
            setDropdown([])
        }
        else {
            console.log(notes);
            console.log(form.category);
            setDropdown(
                notes.filter(({master}) => master.name.toLowerCase().includes(event.target.value.toLowerCase()))
                    .filter(({rfid}) => !rfid)
                    .filter(({categories}) => categories.some(item => item._id.toString() === form.category.toString()))
                    .slice(0, 10)
            )
        }
    }

    const dropdownHandler = event => {
        const userId = event.target.getAttribute('data-user-id')
        masterId.current = userId
        const { name, mail } = notes.find(({master}) => master._id.toString() === userId.toString())
        setForm(state => ({...state, name, mail}))
        setDropdown([])
    }

    const rfidCallback = async rfid => {
        try {
            const { message } = await request('/api/notes/add-note', 'POST', {...form, rfid, masterId: masterId.current})
            successAlert(message)
            setStep('text')
            setForm({ name: '', mail: '', category: '' })
            masterId.current = null
        }
        catch {}
    }

    const btnCallback = () => {
        setStep('text')
    }

    useEffect(() => {
        getNotes()
        getCategories()
    }, [getNotes, getCategories])

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
                <div className="row mt-5 gx-5 justify-content-center">
                    <div className="col-4">
                        <div className="row">
                            <p className="text-center mb-2">Выбор категории</p>
                        </div>
                        <div className="row">
                            <select className="form-select fs-4" value={form.category}
                                onChange={selectHandler}
                            >
                                <option value={''} className="fs-5">--Не выбрано--</option>
                                {
                                    categories.map(({_id, name}) => <option value={_id} key={_id} className="fs-5">{name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="row">
                            <p className="text-center mb-2">Фамилия, имя участника</p>
                            <input className="form-control fs-4" value={form.name}
                                disabled={form.category === ''}
                                onChange={nameChangeHandler}
                            />
                            { dropdown.length > 0 && <div className="w-100 d-block position-relative p-0">
                                <div className="list-group position-absolute w-100">
                                    {
                                        dropdown.map(({master}) => (
                                            <button type="button" className="list-group-item list-group-item-action border-primary" key={master._id}
                                                data-user-id={master._id}
                                                onClick={dropdownHandler}
                                            >
                                                {master.name}
                                            </button>
                                        ))
                                    }
                                </div>
                            </div> }
                        </div>
                    </div>
                </div>
                <div className="row mt-4 gx-5 justify-content-center">
                    <div className="col-4">
                        <div className="row">
                            <p className="text-center mb-2">Электронная почта мастера</p>
                            <input className="form-control fs-4" value={form.mail} disabled />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="row">
                            <p className="text-center mb-2">Номер телефона модели</p>
                            <input className="form-control fs-4" disabled />
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