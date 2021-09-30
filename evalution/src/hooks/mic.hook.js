import { useCallback, useEffect, useRef, useState } from "react"

export const useMic = () => {
    const [recording, setRecording] = useState(false)
    const [file, setFile] = useState()
    const mic = useRef()

    const start = useCallback(() => {
        if ( mic.current?.state === 'inactive' ) {
            mic.current.start()
        }
    }, [mic])

    const stop = useCallback(() => {
        if ( mic.current?.state === 'recording' ) {
            mic.current.stop()
        }
    }, [mic])

    const clearFile = useCallback(() => {
        setFile(null)
    }, [])

    const micClickHandler = () => {
        if ( recording ) {
            stop()
        }
        else {
            start()
        }
    }

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            audio: true, video: false
        }).then(stream => {
            const mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'})
            mic.current = mediaRecorder

            mediaRecorder.ondataavailable = event => {
                setFile(event.data)
            }

            mediaRecorder.onstart = event => {
                if (event.currentTarget.state === 'recording') {
                    setFile(null)
                    setRecording(true)
                }
            }

            mediaRecorder.onstop = event => {
                if ( event.currentTarget.state === 'inactive' ) {
                    setRecording(false)
                }
            }
        })
    }, [])

    return { micClickHandler, recording, file, clearFile }
}