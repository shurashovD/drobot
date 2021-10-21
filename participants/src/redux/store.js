import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./alertSlice";
import authSlice from "./authSlice";
import loaderSlice from "./loaderSlice";

export default configureStore({
    reducer: {
        authState: authSlice,
        loaderState: loaderSlice,
        alertState: alertSlice
    }
})