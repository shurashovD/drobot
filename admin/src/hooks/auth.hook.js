import { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { authSliceLogin, authSliceLogout } from "../redux/authSlice"

export const useAuth = () => {
    const dispatch = useDispatch()

    const login = useCallback(_id => {
        dispatch(authSliceLogin(_id))
        localStorage.setItem('drobot',  JSON.stringify({ _id }))
    }, [dispatch])

    const logout = useCallback(() => {
        dispatch(authSliceLogout())
        localStorage.removeItem('drobot')
    }, [dispatch])

    useEffect(() => {
        try {
            const {_id} = JSON.parse(localStorage.getItem('drobot'))
            if ( _id ) {
                login(_id)
            }
        }
        catch (e) {
            console.log(e)
        }
    }, [login])

    return { login, logout }
}