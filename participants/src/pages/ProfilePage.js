import React, { useCallback, useEffect, useState } from 'react'
import { Container, Offcanvas } from 'react-bootstrap'
import { useHttp } from '../hooks/http.hook'
import { useSelector } from 'react-redux'

export const ProfilePage = () => {
    const [result, setResult] = useState([])
    const [show, setShow] = useState(false)
    const [title, setTitle] = useState({ referee: '', taks: '' })
    const [src, setSrc] = useState()
    const { request } = useHttp()
    const {id, name} = useSelector(state => state.authState)

    const getCompetitions = useCallback(async () => {
        try {
            const response = await request('/api/masters/get-comments', 'POST', {id})
            setResult(response)
        }
        catch {}
    }, [request, id])

    const handleClick = async event => {
        setSrc(event.target.getAttribute('data-link'))
        setTitle({ referee: event.target.getAttribute('data-referee'), task: event.target.getAttribute('data-task') })
        setShow(true)
    }

    const handleHide = () => {
        setSrc(null)
        setShow(false)
    }

    useEffect(getCompetitions, [getCompetitions])

    return (
        <Container fluid>
            <h3>{name}</h3>
            {
                result.map(({_id, competition, comments}) => (
                    <div key={_id} className="mb-3">
                        <p>{competition}</p>
                        {
                            comments.map(({_id, categoryName, items}) => (
                                <div key={_id} className="mb-3">
                                    <p>{categoryName}</p>
                                    {
                                        items.map(({_id, refereeName, taskName, link}) => (
                                            <button key={_id} className="p-2 rounded bg-light mb-1 w-100 border-0"
                                                data-link={link}
                                                data-referee={refereeName}
                                                data-task={taskName}
                                                onClick={handleClick}
                                            >
                                                <span
                                                    data-link={link}
                                                    data-referee={refereeName}
                                                    data-task={taskName}
                                                >{refereeName} - {taskName}</span>
                                            </button>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                ))
            }
            <Offcanvas show={show} onHide={handleHide} placement="bottom">
                <Offcanvas.Header className="d-flex flex-column justify-content-start align-items-start">
                    <p className="m-0">{title.referee}</p>
                    <p className="m-0">{title.task}</p>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex justify-content-center align-items-center">
                    <audio src={src} controls autoPlay className="w-100" />
                </Offcanvas.Body>
            </Offcanvas>
        </Container>
    )
}