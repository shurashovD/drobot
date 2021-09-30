import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { setAlert } from "../redux/alertSlice"
import { ALERT_ERROR } from "../redux/alertTypes"

export const Alert = () => {
    const { text, type, show } = useSelector(state => state.alertState)
    console.log(text, type, show);
    const dispatch = useDispatch()

    return show ? (
        <div className="position-absolute top-0 left-center w-100 m-0 p-1" style={{zIndex: '1080'}}>
            <div className={"d-flex justify-content-between p-3 " + (type === ALERT_ERROR ? "bg-danger" : "bg-secondary")}>
                <span className={type === ALERT_ERROR ? "text-white" : "text-light"}>{ text }</span>
                <button className="ms-auto btn-close" onClick={() => dispatch(setAlert({show: false}))} />
            </div>
        </div>
    ) : <></>
}