import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'authSlice',
    initialState: {
        id: null
    },
    reducers: {
        authSliceLogin: (state, {payload}) => ({...state, id: payload._id, name: payload.name}),
        authSliceLogout: state => ({...state, id: null, name: null})
    }
})

export const { authSliceLogin, authSliceLogout } = authSlice.actions
export default authSlice.reducer