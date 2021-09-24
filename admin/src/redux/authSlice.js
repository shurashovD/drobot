import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'authState',
    initialState: {
        id: null
    },
    reducers: {
        authSliceLogin: (state, {payload}) => ({...state, id: payload}),
        authSliceLogout: state => ({...state, id: null})
    }
})

export const { authSliceLogin, authSliceLogout } = authSlice.actions

export default authSlice.reducer