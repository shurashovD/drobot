import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { setAlert } from "../redux/alertSlice"
import { ALERT_ERROR, ALERT_SUCCESS } from "../redux/alertTypes"

export const useAlert = () => {
    const dispatch = useDispatch()

    const successAlert = useCallback(text => {
        dispatch(setAlert({ text, type: ALERT_SUCCESS, show: true }))
    }, [dispatch])

    const errorAlert = useCallback(text => {
        dispatch(setAlert({ text, type: ALERT_ERROR, show: true }))
    }, [dispatch])

    return { successAlert, errorAlert }
}