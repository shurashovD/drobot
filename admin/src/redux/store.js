import { configureStore } from '@reduxjs/toolkit'
import alertSlice from './alertSlice'
import authSlice from './authSlice'

export default configureStore({
    reducer: {
        authState: authSlice,
        alertState: alertSlice
    }
})