import React from "react"

export const Loader = () => {
    return (
        <div className="position-fixed top-0 bottom-0 left-0 right-0 d-flex m-0 p-0 bg-light overflow-hidden container-fluid">
            <div className="spinner-border text-primary m-auto" />
        </div>
    )
}