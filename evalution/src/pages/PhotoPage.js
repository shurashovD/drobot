import React, { useEffect, useRef, useState } from "react"
import { Navbar } from "../compenets/Navbar"
import { Loader } from "../compenets/Loader"
import { useHttp } from "../hooks/http.hook"
import { useAlert } from "../hooks/alert.hook"
import { Rfid } from "../compenets/Rfid"

export const PhotoPage = () => {
    const [step, setStep] = useState('rfid')
    const [note, setNote] = useState()
    const { request, sendFormData, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const files = useRef([])

    const rfidCallback = async rfid => {
        try {
            const response = await request('/api/notes/get-note-by-rfid', 'POST', { rfid })
            setNote(response)
            setStep('photo')
        }
        catch {}
    }

    const fileInputHandler = event => {
        if ( event.target.files?.[0] ) {
            console.log(note);
            const addFiles = Array.from(event.target.files).slice(0, (10 - files.current.length ?? 0)).map(file => ({file, src: URL.createObjectURL(file)}))
            files.current = files.current.concat(addFiles)
            setNote(state => ({ ...state, photos: state.photos.concat(addFiles.map(({src}) => src)) }))
        }
    }

    const rmPhotoHandler = event => {
        const src = event.target.getAttribute('data-src')
        files.current = files.current.filter(file => file.src !== src)
        setNote(state => ({ ...state, photos: state.photos.filter(item => item !== src) }))
    }

    const cancelHandler = () => {
        files.current = []
        setNote(null)
        setStep('rfid')
    }

    const submitHandler = async () => {
        try {
            const { message } = await sendFormData(
                '/api/notes/upload-photos',
                { note: JSON.stringify(note) },
                files.current.map(({file}) => ({ photo: file }))
            )
            files.current = []
            setNote(null)
            setStep('rfid')
            successAlert(message)
        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, errorAlert, clearError])

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column">
            { loading && <Loader /> }
            { step === 'rfid' && <Rfid rfidCallback={rfidCallback} /> }
            { step === 'photo' && <Navbar title="Фотограф" /> }
            { step === 'photo' && <div className="container mb-3">
                { note?.photos?.length === 0 && <h4 className="text-center mt-4">Нет фото</h4> }
                { note?.photos?.length > 0 && <div className="row p-2 bg-light mt-3">
                    {
                        note?.photos.map(src => (
                            <div className="col-auto d-flex flex-column align-items-center p-1 position-relative" key={src}>
                                <img src={src} alt="note" height="200" />
                                <button className="btn-close mt-1 position-absolute end-0 bg-light me-2"
                                    data-src={src}
                                    onClick={rmPhotoHandler}
                                />
                            </div>
                        ))
                    }
                </div> }
            </div>}
            { step === 'photo' && <div className="row justify-content-around mt-auto mb-3">
                    <label className="btn btn-primary col-auto">
                        Добавить фото
                        <input type="file" multiple accept="image/*" className="d-none" onChange={fileInputHandler} />
                    </label>
                    <button className="btn btn-primary col-auto" onClick={submitHandler}>OK</button>
                    <button className="btn btn-primary col-auto" onClick={cancelHandler}>Отмена</button>
                </div>
            }
        </div>
    )
}