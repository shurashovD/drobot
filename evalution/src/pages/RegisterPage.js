import React, { useCallback, useEffect, useRef, useState } from "react"
import { Navbar } from "../compenets/Navbar"
import { Loader } from "../compenets/Loader"
import { useHttp } from "../hooks/http.hook"
import { useAlert } from "../hooks/alert.hook"
import { Rfid } from "../compenets/Rfid"
import checkboxImg from "../img/checkbox.svg"

export const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', category: '', mail: '', phone: '' })
    const [categories, setCategories] = useState([])
    const [notes, setNotes] = useState([])
    const [dropdown, setDropdown] = useState([])
    const [step, setStep] = useState('text')
    const [random, setRandom] = useState(true)
    const [options, setOptions] = useState([])
    const masterId = useRef()
    const notesRef = useRef()
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()

    const getNotes = useCallback(async () => {
        try {
            const response = await request('/api/notes/get-avail-to-register')
            notesRef.current = response
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
            setOptions(response)
        }
        catch {}
    }, [request])

    const selectHandler = event => {
        setForm(state => ({...state, category: event.target.value}))
        setDropdown([])
    }

    const nameChangeHandler = event => {
        masterId.current = null
        setForm(state => ({ ...state, name: event.target.value, mail: '' }))
        if ( event.target.value === '' ) {
            setDropdown([])
        }
        else {
            setDropdown(
                notes.filter(({master}) => master.name.toLowerCase().includes(event.target.value.toLowerCase())).slice(0, 10)
            )
        }
    }

    const dropdownHandler = event => {
        const userId = event.target.getAttribute('data-user-id')
        masterId.current = userId
        const { name, mail } = notes.find(({master}) => master._id.toString() === userId.toString()).master
        setForm(state => ({...state, name, mail}))
        setOptions(
            notesRef.current.filter(({master}) => master._id.toString() === masterId.current.toString())
                .map(({category}) => categories.find(({_id}) => _id.toString() === category._id.toString()))
        )
        setDropdown([])
    }

    const randomMasterHandler = ()   => {
        setRandom(state => !state)
    }

    const rfidCallback = async rfid => {
        try {
            const note = notesRef.current
                .find(({master, category}) => master._id.toString() === masterId.current?.toString() && form.category.toString() === category._id.toString())
            const { message } = await request('/api/notes/set-rfid', 'POST', {...form, rfid, noteId: note?._id, random})
            successAlert(message)
            setStep('text')
            setForm({ name: '', mail: '', category: '', phone: '' })
            getNotes()
            masterId.current = null
        }
        catch(e) {console.log(e);}
    }

    const btnCallback = () => {
        setStep('text')
    }

    useEffect(() => {
        console.log(options)
    }, [options])

    useEffect(() => {
        if ( random ) {
            masterId.current = null
            setForm(state => ({ ...state, name: '', mail: '' }))
        }
    }, [random])

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
            { step === 'rfid' && <Rfid rfidCallback={rfidCallback} btnCallback={btnCallback} btnTitle="????????????" /> }
            { step === 'text' && <Navbar title="??????????????????????" /> }
            { step === 'text' && <div className="container">
                <div className="row mt-5 gx-5 justify-content-center">
                    <div className="col-4">
                        <div className="row">
                            <p className="text-center mb-2">??????????????, ?????? ??????????????????</p>
                            <input className="form-control fs-4" value={form.name}
                                disabled={random}
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
                    <div className="col-4">
                        <div className="row">
                            <p className="text-center mb-2">?????????? ??????????????????</p>
                        </div>
                        <div className="row">
                            <select className="form-select fs-4" value={form.category}
                                disabled={ !random && !masterId.current }
                                onChange={selectHandler}
                            >
                                <option value={''} className="fs-5">--???? ??????????????--</option>
                                {
                                    options.map(({_id, name}) => <option value={_id} key={_id} className="fs-5">{name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row mt-4 gx-5 justify-content-center">
                    <div className="col-4">
                        <div className="row">
                            <p className="text-center mb-2">?????????????????????? ?????????? ??????????????</p>
                            <input className="form-control fs-4" value={form.mail} disabled />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="row">
                            <p className="text-center mb-2">?????????? ???????????????? ????????????</p>
                            <input className="form-control fs-4" value={form.phone}
                                onChange={event => setForm(state => ({...state, phone: event.target.value}))}
                            />
                        </div>
                    </div>
                </div>
                <div className="row mt-4 gx-5 justify-content-center">
                    <div className="col-4">
                        <label className="row justify-content-center">
                            <img src={checkboxImg} alt="checkbox"
                                className={"p-1 border border-primary " + (random && "bg-primary")} style={{width: '28px'}} />
                            <input type="checkbox" className="d-none" checked={random} onChange={randomMasterHandler} />
                            <span className="text-primary w-auto">?????????????????? ????????????</span>
                        </label>
                    </div>
                </div>
            </div> }
            { step === 'text' && <div className="row m-0 mt-auto mb-5">
                <button className="btn btn-primary col-auto mx-auto"
                    disabled={(!masterId.current && !random) || form.category === ''}
                    onClick={() => setStep('rfid')}
                >
                    OK
                </button>
            </div> }
        </div>
    )
}