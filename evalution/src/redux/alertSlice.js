import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
    name: 'alertState',
    initialState: {
        text: null, show: false
    },
    reducers: {
        setAlert: (state, {payload}) => ({...state, text: payload.text ?? '', type: payload.type, show: payload.show})
    }
})

export const { setAlert } = alertSlice.actions

export default alertSlice.reducer