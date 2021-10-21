import React from "react"
import { Container, Nav, Navbar } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useAuth } from "../hooks/auth.hook"

export const Header = () => {
    const {id} = useSelector(state => state.authState)
    const { logout } = useAuth()

    if ( !id ) {
        return null
    }

    return (
        <Container fluid className="p-0">
            <Navbar bg="light" expand="lg" className="px-1">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#" onClick={logout}>Выход</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    )
}