import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'authState',
    initialState: {
        id: null, name: null, role: null
    },
    reducers: {
        authSliceLogin: (state, {payload}) => ({...state, id: payload._id, name: payload.name, role: payload.role}),
        authSliceLogout: state => ({...state, id: null, name: null, role: null})
    }
})

export const { authSliceLogin, authSliceLogout } = authSlice.actions
export default authSlice.reducer