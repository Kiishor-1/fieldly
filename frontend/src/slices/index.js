import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import fieldReducer from './fieldSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        field: fieldReducer
    }
})