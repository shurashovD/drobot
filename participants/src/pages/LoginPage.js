import React, { useEffect, useState } from "react"
import { useHttp } from "../hooks/http.hook"
import { Container, Form, Button, Spinner } from "react-bootstrap"
import { useAuth } from "../hooks/auth.hook"

export const LoginPage = () => {
    const [form, setForm] = useState({ mail: '' })
    const [feedbacks, setFeedbacks] = useState({ mail: '' })
    const [validated, setValidated] = useState(false)

    const { request, loading, error, clearError } = useHttp()
    const { login } = useAuth()

    const handleSubmit = event => {
        event.preventDefault()
        if ( form.mail === '' ) {
            setFeedbacks(state => ({ ...state,  mail: 'Введите почту' }))
            setValidated(false)
        }
        else {
            submit()
        }
    }

    const submit = async () => {
        try {
            const response = await request('/api/masters/login', 'POST', form)
            login(response)
        }
        catch {}
    }

    useEffect(() => {
        setValidated(true)
        setFeedbacks(state => ({ ...state,  mail: '' }))
    }, [form])

    useEffect(() => {
        if ( error ) {
            setFeedbacks(state => ({ ...state,  mail: error }))
            setValidated(false)
            clearError()
        }
    }, [error, clearError])

    return (
        <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Почта</Form.Label>
                            <Form.Control type="email" name="mail"
                                value={form.mail}
                                onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}
                                isInvalid={feedbacks.mail !== '' }
                            />
                            <Form.Control.Feedback type="invalid">
                                {feedbacks.mail}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Укажите ту же почту, что и при регитсрации на PE-2021
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading} className="col-3">
                            { !loading && <>Войти</> }
                            { loading && <Spinner animation="border" variant="white" size="sm" /> }
                        </Button>
                    </Form>
        </Container>
    )
}