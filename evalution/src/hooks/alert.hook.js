import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { setAlert } from "../redux/alertSlice"
import { ALERT_ERROR, ALERT_SUCCESS } from "../redux/alertTypes"

export const useAlert = () => {
    const dispatch = useDispatch()

    const successAlert = useCallback(text => {
        dispatch(setAlert({ text, type: ALERT_SUCCESS, show: true }))
        setTimeout(() => {
            dispatch(setAlert({ show: false }))
        }, 3000)
    }, [dispatch])

    const errorAlert = useCallback(text => {
        dispatch(setAlert({ text, type: ALERT_ERROR, show: true }))
        setTimeout(() => {
            dispatch(setAlert({ show: false }))
        }, 3000)
    }, [dispatch])

    return { successAlert, errorAlert }
}