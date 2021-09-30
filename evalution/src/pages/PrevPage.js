import React, { useEffect, useRef, useState } from "react"
import { Navbar } from "../compenets/Navbar"
import { Rfid } from "../compenets/Rfid"
import { Loader } from "../compenets/Loader"
import { useHttp } from "../hooks/http.hook"
import { useAlert } from "../hooks/alert.hook"
import micImg from "../img/microphone.svg"
import { useMic } from "../hooks/mic.hook"
import { useSelector } from "react-redux"

export const PrevPage = () => {
    const { id } = useSelector(state => state.authState)
    const [note, setNote] = useState()
    const { request, sendFormData, loading, error, clearError } = useHttp()
    const { micClickHandler, recording, file, clearFile } = useMic()
    const { errorAlert, successAlert } = useAlert()
    const comment = useRef()

    const submitHandler = async () => {
        try {
            const data = JSON.stringify({ note, userId: id })
            const { message } = await sendFormData('/api/notes/set-previous-score', { data }, [{ comment: comment.current }])
            successAlert(message)
            comment.current = null
            setNote(null)
        }
        catch (e) {
            console.log(e)
        }
    }

    const cancelHandler = () => {
        comment.current = null
        setNote(null)
    }

    const rfidCallback = async rfid => {
        try {
            const response = await request('/api/notes/get-note-by-rfid', 'POST', { rfid })
            setNote(response)
        }
        catch {}
    }

    const scoreKdHandler = event => {
        if ( event.key === 'Backspace' ) return
        if ( isNaN(event.key) ) {
            event.preventDefault()
            return
        }
        event.target.value = ''
    }

    const scoreHandler = event => {
        if ( event.target.value > 2 ) event.target.value = 2
        setNote(state => ({...state, previousScore: {...state.previousScore, value: event.target.value}}))
    }

    useEffect(() => {
        if ( file ) {
            comment.current = file
            clearFile()
            setNote(state => ({ ...state, previousScore: {...state.previousScore, comment: URL.createObjectURL(comment.current)} }))
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
            { loading && <Loader /> }
            <Navbar title="Оценка кожи" label={note?.category.name} />
            { !note && <Rfid rfidCallback={rfidCallback} /> }
            { note && <div className="container my-auto">
                <div className="row">
                    <div className="col-3 mx-auto">
                        <p className="text-center mb-2">Оценка</p>
                        <div className="mb-3 row">
                            <input className="form-control fs-4 text-center" value={note.previousScore.value}
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
                            <audio src={note.previousScore.comment} controls className="col-10 mx-0" />
                        </div>
                    </div>
                </div>
            </div> }
            { note && <div className="row justify-content-around mt-auto mb-3">
                <button className="btn btn-primary col-auto" onClick={submitHandler}>OK</button>
                <button className="btn btn-primary col-auto" onClick={cancelHandler}>Отмена</button>
            </div> }
        </div>
    )
}