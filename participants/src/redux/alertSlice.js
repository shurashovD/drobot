import { createSlice } from '@reduxjs/toolkit'

export const alertSlice = createSlice({
    name: 'alertSlice',
    initialState: {
        show: false, variant: 'success', text: ''
    },
    reducers: {
        alertHide: state => ({ ...state, show: false }),
        alertShow: (state, {payload}) => ({ ...state, show: true, variant: payload.variant, text: payload.text })
    }
})

export const { alertHide, alertShow } = alertSlice.actions
export default alertSlice.reducer