import React from "react"
import { Alert } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { alertHide } from "../redux/alertSlice"

export const AlertComponent = () => {
    const { show, variant, text } = useSelector(state => state.alertState)
    const dispatch = useDispatch()

    return show ? (
        <Alert variant={variant} dismissible className="position-fixed top-0 left-0 mt-1 w-100" style={{zIndex: 1080}}
            onClose={() => dispatch(alertHide())}
        >
            {text}
        </Alert>
    ) : <></>
}