import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { alertShow } from "../redux/alertSlice"
import { loaderSetShow } from "../redux/loaderSlice"
import { useAuth } from './auth.hook'

export const useHttp = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const { auth } = useAuth()
    const dispatch = useDispatch()

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        headers['Content-Type'] = 'application/json'
        headers['Authorization'] = `Base ${auth}`
        if ( body ) body = JSON.stringify(body)
        try {
            const response = await fetch(url, { method, body, headers })
            const data = await response.text()

            try {
                JSON.parse(data)
            }
            catch {
                throw new Error('INVALID SERVER RESPONSE')
            }

            const result = JSON.parse(data)

            if ( !response.ok ) {
                throw new Error(result.message || 'SERVER ERROR')
            }

            setLoading(false)
            return result
        }
        catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [auth])

    const sendFormData = useCallback( async (url, data, files, headers = {}) => {
        const formData = new FormData()
        for ( let [key, value] of Object.entries(data)) {
            formData.append(key, value)
        }

        for (let i in files) {
            const [fileKey, fileName] = Object.entries(files[i])[0]
            formData.append(fileKey, fileName)
        }
        
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url)

        headers['Authorization'] = `Base ${auth}`
        for ( let [key, value] of Object.entries(headers) ) {
            xhr.setRequestHeader(key, value)
        }

        try {
            return await new Promise((resolve, reject) => {
                setProgress(0)
                setLoading(true)
                xhr.send(formData)
                xhr.upload.onprogress = event =>  {
                    setProgress(parseInt(100 * event.loaded / event.total))
                }
                xhr.onreadystatechange = () => {
                    if (parseInt(xhr.readyState) === 4) {
                        try {
                            JSON.parse(xhr.response)
                        }
                        catch {
                            reject({message: 'INVALID SERVER RESPONSE'})
                        }
                        const response = JSON.parse(xhr.response)
                        if ( parseInt(xhr.status) < 300 ) {
                            setProgress(0)
                            setLoading(false)
                            resolve(response)
                        }
                        reject(response)
                    }
                }
            })
        }
        catch (e) {
            setProgress(0)
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [auth])

    const getFile = useCallback(async (url) => {
        setLoading(true)
        const headers = {}
        headers['Authorization'] = `Base ${auth}`
        try {
            const response = await fetch(url, { method: 'GET', body: null, headers })
            const result = await response.blob()

            if ( !response.ok ) {
                throw new Error(result.message || 'SERVER ERROR')
            }

            setLoading(false)
            return result
        }
        catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [auth])

    const clearError = useCallback(() => setError(null), [])

    useEffect(() => {
        dispatch(loaderSetShow(loading))
    }, [loading])

    useEffect(() => {
        if ( error ) {
            dispatch(alertShow({ text: error, variant: 'danger' }))
        }
    }, [error, clearError])

    return { request, sendFormData, getFile, loading, progress, error, clearError } 
}