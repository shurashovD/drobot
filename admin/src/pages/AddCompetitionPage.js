import React, { useCallback, useEffect, useState } from "react"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const AddCompetitionPage = () => {
    const [competitions, setCompetitions] = useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert } = useAlert()
    const links = [
        {to: '/admin/competitions', title: 'Мероприятия'}
    ]

    const submitHandler = async () => {
        try {
            const result = await request('/api/competitions/create-competition')
            setCompetitions(result)
            console.log(result);
        }
        catch {}
    }

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            setTimeout(clearError, 4000)
        }
    }, [error, clearError, errorAlert])

    return (
        <div className="container-fluid">
            { loading && <Loader /> }
            <Navbar links={links} />
            <div className="container">
                <p className="text-center fs-3 m-5">Добавление мероприятия</p>
            </div>
        </div>
    )
}