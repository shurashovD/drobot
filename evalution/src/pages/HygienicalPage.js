import React, { useCallback, useEffect, useRef, useState } from "react"
import { Navbar } from "../compenets/Navbar"
import { useHttp } from "../hooks/http.hook"
import { useAlert } from "../hooks/alert.hook"
import micImg from "../img/microphone.svg"
import { useMic } from "../hooks/mic.hook"
import { useSelector } from "react-redux"

export const HygienicalPage = () => {
    const { id } = useSelector(state => state.authState)
    const [note, setNote] = useState()
    const [categories, setCategories] = useState([])
    const [form, setForm] = useState({ number: '', category: '' })
    const { sendFormData, request, loading, error, clearError } = useHttp()
    const { micClickHandler, recording, file, clearFile } = useMic()
    const { errorAlert, successAlert } = useAlert()
    const comment = useRef()

    const submitHandler = async () => {
        try {
            const data = JSON.stringify({ note, userId: id })
            const { message } = await sendFormData('/api/notes/set-hygienical-score', { data }, [{ comment: comment.current }])
            successAlert(message)
        }
        catch (e) {
            console.log(e)
        }
    }

    const getCategories = useCallback(async () => {
        try {
            const response = await request('/api/categories/get-all')
            setCategories(response)
        }
        catch {}
    }, [request])

    const numberKdHandler = event => {
        if ( event.key === 'Backspace' ) return
        if ( isNaN(event.key) ) {
            event.preventDefault()
            return
        }
        if ( event.target.value === '0' ) {
            event.target.value = ''
        }
    }

    const scoreKdHandler = event => {
        if ( event.key === 'Backspace' ) return
        if ( isNaN(event.key) ) {
            event.preventDefault()
            return
        }
        event.target.value = ''
    }

    const categoryHandler = event => {
        setForm(state => ({...state, category: event.target.value}))
        setNote(null)
        comment.current = null
    }

    const scoreHandler = event => {
        if ( event.target.value > 5 ) event.target.value = 5
        setNote(state => ({...state, hygienicalScore: {...state.hygienicalScore, value: event.target.value}}))
    }

    const numberHandler = async event => {
        setForm(state => ({...state, number: event.target.value}))
        setNote(null)
        comment.current = null
        if ( form.category !== '' && event.target.value !== '' ) {
            try {
                const response = await request('/api/notes/get-note-by-number', 'POST', {...form, number: event.target.value})
                setNote(response)
            }
            catch {}
        }
    }

    useEffect(getCategories, [getCategories])

    useEffect(() => {
        if ( file ) {
            comment.current = file
            clearFile()
            setNote(state => ({ ...state, hygienicalScore: {...state.hygienicalScore, comment: URL.createObjectURL(comment.current)} }))
        }
    }, [file, clearFile, comment])
    
    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, errorAlert, clearError])

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column">
            <Navbar title="Оценка гигиены" />
            <div className="container mb-3">
                <div className="row mt-5 mb-2 gx-5 justify-content-center">
                    <div className="col-5">
                        <div className="row">
                            <p className="text-center mb-2">Выбор категории</p>
                        </div>
                        <div className="row">
                            <select className="form-select fs-4" value={form.category}
                                onChange={categoryHandler}
                            >
                                <option value={''} className="fs-5">--Не выбрано--</option>
                                {
                                    categories.map(({_id, name}) => <option value={_id} key={_id} className="fs-5">{name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="row">
                            <p className="text-center mb-2">Номер участника</p>
                            <input className="form-control fs-4 text-center" value={form.number}
                                onChange={numberHandler}
                                onKeyDown={numberKdHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-auto">
                { !loading && note && <div className="col-3 mx-auto">
                    <p className="text-center mb-2">Оценка</p>
                    <div className="mb-3 row">
                        <input className="form-control fs-4 text-center" value={note.hygienicalScore.value}
                            onChange={scoreHandler}
                            onKeyDown={scoreKdHandler}
                        />
                    </div>
                    <p className="text-center mb-2">Комментарий</p>
                    <div className="row gy-3 align-items-center">
                        <button className="btn btn-primary col-2" style={{minWidth: 0}} onClick={micClickHandler}>
                            { !recording && <img src={micImg} alt="mic" height="24" /> }
                            { recording && <div className="spinner-grow text-light" /> }
                        </button>
                        <audio src={note.hygienicalScore.comment} controls className="col-10 mx-0" />
                    </div>
                </div> }
                { loading && <div className="spinner-border text-primary mx-auto" /> }
            </div>
            <div className="row justify-content-around mt-auto mb-3">
                <button className="btn btn-primary col-auto" onClick={submitHandler}>OK</button>
            </div>
        </div>
    )
}