import React from "react"

export const Loader = () => {
    return (
        <div className="container-fluid position-absolute top-0 left-0 min-vh-100 d-flex m-0 p-0 bg-white" style={{zIndex:1000, maxWidth: '100%'}}>
            <div className="spinner-border text-primary m-auto" />
        </div>
    )
}