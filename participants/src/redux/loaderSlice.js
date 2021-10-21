import { createSlice } from '@reduxjs/toolkit'

export const loaderSlice = createSlice({
    name: 'loaderSlice',
    initialState: {
        show: false
    },
    reducers: {
        loaderSetShow: (state, {payload}) => ({ show: payload })
    }
})

export const { loaderSetShow } = loaderSlice.actions
export default loaderSlice.reducer