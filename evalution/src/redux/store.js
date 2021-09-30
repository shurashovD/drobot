import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import alertReducer from './alertSlice'

export default configureStore({
    reducer: {
        authState: authReducer,
        alertState: alertReducer
    }
})