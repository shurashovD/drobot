import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { setAlert } from "../redux/alertSlice"
import { ALERT_ERROR } from "../redux/alertTypes"

export const Alert = () => {
    const { text, type, show } = useSelector(state => state.alertState)
    const dispatch = useDispatch()

    return show ? (
        <div className="position-absolute top-0 left-center w-100 m-0 p-1">
            <div className={"d-flex justify-content-between alert " + (type === ALERT_ERROR ? "alert-danger" : "alert-success")}>
                { text }
                <button className="ms-auto btn-close" onClick={() => dispatch(setAlert({show: false}))} />
            </div>
        </div>
    ) : <></>
}