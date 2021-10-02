import React, { useEffect, useRef, useState } from "react"
import { Navbar } from "../compenets/Navbar"
import { Rfid } from "../compenets/Rfid"
import { Loader } from "../compenets/Loader"
import { useHttp } from "../hooks/http.hook"
import { useAlert } from "../hooks/alert.hook"
import micImg from "../img/microphone.svg"
import { useMic } from "../hooks/mic.hook"
import { useSelector } from "react-redux"

export const RefereePage = () => {
    const { id, name } = useSelector(state => state.authState)
    const [note, setNote] = useState()
    const [scores, setScores] = useState({})
    const [total, setTotal] = useState(0)
    const { request, sendFormData, loading, error, clearError } = useHttp()
    const { micClickHandler, recording, file, clearFile } = useMic()
    const { errorAlert, successAlert } = useAlert()
    const comments = useRef({})
    const micBusy = useRef()

    const submitHandler = async () => {
        try {
            const data = JSON.stringify({ scores, userId: id, noteId: note._id })
            const files = []
            for ( let key in comments.current ) {
                files.push({ comment: comments.current[key] })
            }
            const { message } = await sendFormData('/api/notes/set-referee-scores', { data }, files)
            successAlert(message)
            comments.current = {}
            setTotal(0)
            setNote(null)
            setScores({})
        }
        catch (e) {
            console.log(e)
        }
    }

    const cancelHandler = () => {
        comments.current = []
        setTotal(0)
        setNote(null)
        setScores({})
    }

    const rfidCallback = async rfid => {
        try {
            const response = await request('/api/notes/get-note-by-rfid', 'POST', { rfid })
            const newScores = response.category.tasks.reduce((obj, item) => {
                const key = item._id.toString()
                const value = response.scores
                    .find(({referee}) => referee.toString() === id.toString())
                    ?.refereeScores.find(({test}) => test.toString() === key) ?? { value: 0 }
                return {...obj, [key]: value}
            }, {})
            setScores(newScores)
            setNote(response)
        }
        catch {}
    }

    const scoreKdHandler = event => {
        if (event.key === 'Backspace') {
            return
        }
        if ( isNaN(event.key) ) {
            event.preventDefault()
            return
        }
    }

    const scoreHandler = event => {
        let value = event.target.value
        if ( isNaN(value) || value === '' ) {
            value = 0
        }
        else {
            if ( parseInt(value) > 50 ) {
                value = 50
            }
            if ( value.length > 1 ) {
                value = parseInt(value.slice(1))
            }
        }
        const taskId = event.target.getAttribute('data-task-id')
        let newTotal = 0
        for ( let key in scores ) {
            if ( key === taskId.toString() ) {
                newTotal += parseInt(value)
                continue
            }
            newTotal += parseInt(scores[key].value === '' ? 0 : scores[key].value)
        }
        setScores(state => ({ ...state, [taskId.toString()]: { ...state[taskId.toString()], value } }))
        setTotal(newTotal)
    }

    const mickHandler = event => {
        micBusy.current = event.target.getAttribute('data-task-id').toString()
        micClickHandler()
    }

    const photoBtnCallback = () => {}

    useEffect(() => {
        console.log(note?.scores);
    }, [note])

    useEffect(() => {
        if ( file ) {
            const taskId = micBusy.current
            setScores(state => ({ ...state, [taskId]: { ...state[taskId], comment: URL.createObjectURL(file) } }))
            comments.current[taskId] = new File([file], `${note._id}_${id}_${micBusy.current}.webm`)
            clearFile()
            micBusy.current = null
        }
    }, [file, clearFile, comments, note._id, id])
    
    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, errorAlert, clearError])

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column">
            { loading && <Loader /> }
            <Navbar title={`Судья: ${name}`} label={note?.category.name} btnTitle={note?.photos.length > 0 && "Фото модели"} btnCallback={photoBtnCallback} />
            { !note && <Rfid rfidCallback={rfidCallback} /> }
            { note &&
                <div className="container">
                    <div className="mt-4">
                        <table className="table text-primary table-bordered border-primary">
                            <thead className="text-center">
                                <tr>
                                    <th style={{ width: '18%' }}>Критерий</th>
                                    <th style={{ width: '50%' }}>Расшифровка</th>
                                    <th style={{ width: '8%' }}>Баллы</th>
                                    <th style={{ width: '24%' }}>Аудио-комментарий</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    note.category.tasks.map(({_id, name, description}) => (
                                        <tr key={_id}>
                                            <td className="col-2" style={{ width: '18%' }}>{name}</td>
                                            <td className="col-6" style={{ width: '50%' }}>{description}</td>
                                            <td className="col-1 align-middle" style={{ width: '8%' }}>
                                                <input data-task-id={_id} value={scores[_id.toString()].value}
                                                    className="text-center text-primary fs-4 border-0 w-100"
                                                    onKeyDown={scoreKdHandler}
                                                    onChange={scoreHandler}
                                                />
                                            </td>
                                            <td className="col-2 text-center" style={{ width: '24%' }}>
                                                <div className="row p-0 g-0 align-items-center">
                                                    <button className="btn btn-primary col-3 me-auto" style={{minWidth: 0, padding: '8px'}}
                                                        onClick={mickHandler}
                                                        data-task-id={_id}
                                                    >
                                                        {
                                                            !(recording && micBusy.current === _id.toString()) &&
                                                            <img src={micImg} alt="mic" height="24"
                                                                data-task-id={_id}
                                                            />
                                                        }
                                                        {
                                                            recording && micBusy.current === _id.toString() &&
                                                            <div className="spinner-grow text-light"
                                                                data-task-id={_id}
                                                            />
                                                        }
                                                    </button>
                                                    {
                                                        scores[_id.toString()].comment &&
                                                        <audio src={scores[_id.toString()].comment} controls style={{ width: '210px' }} />
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr className="border-0">
                                    <td colSpan="2" className="fs-4 text-end border-0">Сумма баллов</td>
                                    <td className="fs-4 text-center border-0">{total}</td>
                                    <td className="border-0" />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            }
            { note &&
                <div className="row justify-content-around mt-auto mb-3">
                    <button className="btn btn-primary col-auto" onClick={submitHandler}>OK</button>
                    <button className="btn btn-primary col-auto" onClick={cancelHandler}>Отмена</button>
                </div>    
            }
        </div>
    )
}