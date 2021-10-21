import React, { useEffect } from "react"
import { Container, Spinner } from "react-bootstrap"
import { useSelector } from "react-redux"

export const Loader = () => {
    const { show } = useSelector(state => state.loaderState)

    return (
        <Container fluid className={"min-vh-100 m-0 position-fixed top-0 left-0 justify-content-center align-items-center " + (show ? "d-flex" : "d-none")}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
        >
            <Spinner animation="border" variant="primary" />
        </Container>
    )
}