import { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { authSliceLogin, authSliceLogout } from "../redux/authSlice"

export const useAuth = () => {
    const dispatch = useDispatch()

    const login = useCallback(({_id, name}) => {
        dispatch(authSliceLogin({_id, name}))
        localStorage.setItem('drobot-participant',  JSON.stringify({ _id, name }))
    }, [dispatch])

    const logout = useCallback(() => {
        dispatch(authSliceLogout())
        localStorage.removeItem('drobot-participant')
    }, [dispatch])

    useEffect(() => {
        try {
            const { _id, name } = JSON.parse(localStorage.getItem('drobot-participant'))
            if ( _id ) {
                login({_id, name})
            }
        }
        catch {}
    }, [login])

    return { login, logout }
}