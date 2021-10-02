import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHttp } from '../hooks/http.hook'

export const ScoreboardPage = () => {
    const [result, setResult] = useState({ complete: null, rows: [], tables: [] })
    const [pole, setPole] = useState(true)
    const { authState } = useSelector(state => state)
    const { request, loading, error, clearError } = useHttp()

    useEffect(() => {
        const getResult = async () => {
            try {
                const response = await request('/api/notes/get-result', 'POST', { screenId: authState.id })
                setResult(response)
            }
            catch {}
        }
        if ( !loading && pole ) {
            setPole(false)
            getResult()
            setTimeout(() => setPole(true), 5 * 1000)
        }
}, [request, loading, authState, pole])

    useEffect(() => {
        if ( error ) {
            console.log(error)
            clearError()
        }
    }, [error, clearError])

    return (
        <div className="container-fluid bg-dark min-vh-100 overflow-hidden p-0">
            <div className="row min-vh-100 m-0">
                {  !result.complete && <div className="col-7 d-flex flex-column justify-content-around">
                    <div className="col-12 border border-light border-2 p-0">
                        <div className="row align-items-stretch m-0">
                            <h4 className="text-light col-2 d-flex justify-content-center align-items-center border-bottom border-end border-2 border-light m-0">
                                Судьи
                            </h4>
                            <div className="col-10 p-0 m-0">
                                <h4 className="text-center text-light border-bottom border-2 border-light p-0 m-0">
                                    <span className="text-light me-3" style={{ fontSize: '18px' }}>Участник</span>
                                    Зайцева Марина
                                </h4>
                                <div className="row align-items-stretch m-0 p-0 border-bottom border-light">
                                    <p className="border-end border-light lh-1 text-light text-center m-0 p-0 py-1"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '18px'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Гармоничность образа
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                       Форма
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Цвет
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row p-0 m-0 align-items-stretch">
                            <div className="col-2 border-end border-light border-2 m-0">
                                <h4 className="text-light text-center m-0">
                                    Дробот Ольга
                                </h4>
                            </div>
                            
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 border border-light border-2 p-0">
                        <div className="row align-items-stretch m-0">
                            <h4 className="text-light col-2 d-flex justify-content-center align-items-center border-bottom border-end border-2 border-light m-0">
                                Судьи
                            </h4>
                            <div className="col-10 p-0 m-0">
                                <h4 className="text-center text-light border-bottom border-2 border-light p-0 m-0">
                                    <span className="text-light me-3" style={{ fontSize: '18px' }}>Участник</span>
                                    Зайцева Марина
                                </h4>
                                <div className="row align-items-stretch m-0 p-0 border-bottom border-light">
                                    <p className="border-end border-light lh-1 text-light text-center m-0 p-0 py-1"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '18px'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Гармоничность образа
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                       Форма
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Цвет
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row p-0 m-0 align-items-stretch">
                            <div className="col-2 border-end border-light border-2 m-0">
                                <h4 className="text-light text-center m-0">
                                    Дробот Ольга
                                </h4>
                            </div>
                            
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 border border-light border-2 p-0">
                        <div className="row align-items-stretch m-0">
                            <h4 className="text-light col-2 d-flex justify-content-center align-items-center border-bottom border-end border-2 border-light m-0">
                                Судьи
                            </h4>
                            <div className="col-10 p-0 m-0">
                                <h4 className="text-center text-light border-bottom border-2 border-light p-0 m-0">
                                    <span className="text-light me-3" style={{ fontSize: '18px' }}>Участник</span>
                                    Зайцева Марина
                                </h4>
                                <div className="row align-items-stretch m-0 p-0 border-bottom border-light">
                                    <p className="border-end border-light lh-1 text-light text-center m-0 p-0 py-1"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '18px'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Гармоничность образа
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                       Форма
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Цвет
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row p-0 m-0 align-items-stretch">
                            <div className="col-2 border-end border-light border-2 m-0">
                                <h4 className="text-light text-center m-0">
                                    Дробот Ольга
                                </h4>
                            </div>
                            
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 border border-light border-2 p-0">
                        <div className="row align-items-stretch m-0">
                            <h4 className="text-light col-2 d-flex justify-content-center align-items-center border-bottom border-end border-2 border-light m-0">
                                Судьи
                            </h4>
                            <div className="col-10 p-0 m-0">
                                <h4 className="text-center text-light border-bottom border-2 border-light p-0 m-0">
                                    <span className="text-light me-3" style={{ fontSize: '18px' }}>Участник</span>
                                    Зайцева Марина
                                </h4>
                                <div className="row align-items-stretch m-0 p-0 border-bottom border-light">
                                    <p className="border-end border-light lh-1 text-light text-center m-0 p-0 py-1"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '18px'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Гармоничность образа
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                       Форма
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Цвет
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row p-0 m-0 align-items-stretch">
                            <div className="col-2 border-end border-light border-2 m-0">
                                <h4 className="text-light text-center m-0">
                                    Дробот Ольга
                                </h4>
                            </div>
                            
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> }
                <div className="col-7 d-flex flex-column justify-content-around">
                    <div className="col-12 border border-light border-2 p-0">
                        <div className="row align-items-stretch m-0">
                            <h4 className="text-light col-2 d-flex justify-content-center align-items-center border-bottom border-end border-2 border-light m-0">
                                Судьи
                            </h4>
                            <div className="col-10 p-0 m-0">
                                <h4 className="text-center text-light border-bottom border-2 border-light p-0 m-0">
                                    <span className="text-light me-3" style={{ fontSize: '18px' }}>Участник</span>
                                    Зайцева Марина
                                </h4>
                                <div className="row align-items-stretch m-0 p-0 border-bottom border-light">
                                    <p className="border-end border-light lh-1 text-light text-center m-0 p-0 py-1"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '18px'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Гармоничность образа
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                       Форма
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Цвет
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="border-end border-light lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                    <p className="lh-1 text-light d-flex align-items-center m-0 p-0 overflow-hidden"
                                        style={{width: '10%', wordBreak:'break-all'}}
                                    >
                                        Симметрия формы
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row p-0 m-0 align-items-stretch">
                            <div className="col-2 border-end border-light border-2 m-0">
                                <h4 className="text-light text-center m-0">
                                    Дробот Ольга
                                </h4>
                            </div>
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                            <div className="col-10 p-0 m-0">
                                <div className="row align-items-stretch m-0 p-0 h-100">
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="border-end border-light lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                    <p className="lh-1 text-light h-100 d-flex justify-content-center align-items-center"
                                        style={{width: '10%', wordBreak:'break-all', fontSize: '36px'}}
                                    >
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-5 d-flex flex-column justify-content-around">
                    <div className="w-100 p-0 border border-2 border-light" style={{ height: '31vh', overflow: 'hidden' }}>
                        <h4 className="bg-primary text-center m-0 py-1 border-bottom border-2 border-light">
                            <span className="text-light m-0 me-3" style={{ fontSize: '18px' }}>результаты категории</span>
                            <span className="text-light">Губы “Профи”</span>
                        </h4>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-1 text-center text-light">Место</h4>
                            <h4 className="col-8 m-0 py-1 text-light border-start border-end border-2 border-light">Участник</h4>
                            <h4 className="col-2 m-0 py-1 text-center text-light">Баллы</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light overflow-hidden"
                            style={{ height: 'calc(29vh / 7)' }}
                        >
                            <h4 className="col-2 m-0 py-0 text-center text-light">1</h4>
                            <h4
                                className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light text-nowrap overflow-hidden"
                            >
                                Зайцева Марияяяяяяяяяяяяяяяяяяяяяяя
                            </h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">2</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">3</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">4</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">5</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">6</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">7</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">8</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">9</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">10</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">11</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                    </div>
                    <div className="w-100 p-0 border border-2 border-light" style={{ height: '31vh', overflow: 'hidden' }}>
                        <h4 className="bg-primary text-center m-0 py-1 border-bottom border-2 border-light">
                            <span className="text-light m-0 me-3" style={{ fontSize: '18px' }}>результаты категории</span>
                            <span className="text-light">Губы “Профи”</span>
                        </h4>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-1 text-center text-light">Место</h4>
                            <h4 className="col-8 m-0 py-1 text-light border-start border-end border-2 border-light">Участник</h4>
                            <h4 className="col-2 m-0 py-1 text-center text-light">Баллы</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">1</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">2</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">3</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">4</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">5</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">6</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">7</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">8</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">9</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">10</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">11</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                    </div>
                    <div className="w-100 p-0 border border-2 border-light" style={{ height: '31vh', overflow: 'hidden' }}>
                        <h4 className="bg-primary text-center m-0 py-1 border-bottom border-2 border-light">
                            <span className="text-light m-0 me-3" style={{ fontSize: '18px' }}>результаты категории</span>
                            <span className="text-light">Губы “Профи”</span>
                        </h4>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-1 text-center text-light">Место</h4>
                            <h4 className="col-8 m-0 py-1 text-light border-start border-end border-2 border-light">Участник</h4>
                            <h4 className="col-2 m-0 py-1 text-center text-light">Баллы</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">1</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">2</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">3</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">4</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">5</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">6</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">7</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">8</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">9</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">10</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                        <div className="row m-0 p-0 border-bottom border-2 border-light">
                            <h4 className="col-2 m-0 py-0 text-center text-light">11</h4>
                            <h4 className="col-8 m-0 py-0 text-light border-start border-end border-2 border-light">Зайцева Мария</h4>
                            <h4 className="col-2 m-0 py-0 text-center text-light">25</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}