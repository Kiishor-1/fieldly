import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../services/api';
import { apiConnector } from "../services/apiConnector";
import axios from "axios";

const { REGISTER, LOGIN, LOGOUT_USER } = AUTH_ENDPOINTS;
const { UPDATE_USER } = USER_ENDPOINTS;

export const isTokenExpired = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        const now = Date.now() / 1000;
        return payload.exp < now;
    } catch (error) {
        console.error('Error during checking token expiration:', error);
        return true;
    }
};

export const registerUser = createAsyncThunk('auth/registerUser', async (credentials, { rejectWithValue }) => {
    const toastId = toast.loading('User is being registered');
    try {
        const response = await apiConnector('POST', REGISTER, { ...credentials });

        if (!response?.data?.success) {
            toast.dismiss(toastId);
            toast.error(response?.data?.error || 'Failed to register user');
            return rejectWithValue(response?.data?.error || 'Failed to register user');
        }

        toast.dismiss(toastId);
        toast.success("User registered successfully");
        return response.data;
    } catch (error) {
        console.log(error);
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.error || 'Error during registration');
        return rejectWithValue(error?.response?.data?.error || 'Error during registration');
    }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    const toastId = toast.loading("Logging In");
    try {
        const response = await apiConnector('POST', LOGIN, { ...credentials });

        if (!response?.data?.success) {
            toast.dismiss(toastId);
            toast.error(response?.data?.error || 'Failed to login');
            return rejectWithValue(response?.data?.error || 'Failed to login');
        }
        toast.dismiss(toastId);
        toast.success('Login Success');
        return response.data;
    } catch (error) {
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.error || 'Error during login');
        return rejectWithValue(error?.response?.data?.error || 'Error during login');
    }
});

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async (formData, { rejectWithValue, getState, dispatch }) => {
        const toastId = toast.loading('Updating..');
        const { name, email, oldPassword, newPassword } = formData;

        let fieldCount = 0;
        if (name) fieldCount++;
        if (email) fieldCount++;
        if (newPassword) fieldCount++;

        if (fieldCount > 1) {
            toast.dismiss(toastId);
            toast.error('Cannot update more than one field at a time');
            return rejectWithValue('Cannot update more than one field at a time');
        }

        if (newPassword && !oldPassword) {
            toast.dismiss(toastId);
            toast.error('Provide old password to update new password');
            return rejectWithValue('Provide old password to update new password');
        }

        const data = {};
        if (name) data.name = name;
        if (email) data.email = email;
        if (oldPassword && newPassword) {
            data.oldPassword = oldPassword;
            data.newPassword = newPassword;
        }

        try {
            const { token } = getState().auth;
            const response = await apiConnector('put', UPDATE_USER, data, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (!response.data?.success) {
                toast.dismiss(toastId);
                return rejectWithValue('Failed to update user');
            }

            toast.dismiss(toastId);
            toast.success('User updated successfully. Please log in again.');
            dispatch(logout());

            return response?.data?.user;
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.response?.data?.error || 'Failed to update user');
            return rejectWithValue(error.response?.data?.error || 'Failed to update user');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            if (!token) {
                return rejectWithValue('No token provided, user is not logged in');
            }
            const response = await apiConnector('post', LOGOUT_USER, {}, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (response.data?.success)
                dispatch(logout());
            toast.success('User logged out successfully');
            return true;
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error(error.response?.data?.error || 'Failed to logout');
            return rejectWithValue(error?.response?.data?.error || 'Failed to logout');
        }
    }
);

const getUserFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

const getTokenFromLocalStorage = () => {
    return localStorage.getItem("token") || null;
};

const initialState = {
    user: getUserFromLocalStorage(),
    token: getTokenFromLocalStorage(),
    role:"User",
    error: null,
    isLoading: false,
    status: 'idle',
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.status = 'succeed';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error;
                state.status = 'failed';
            });

        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.role = action.payload.user?.role;
                state.status = 'succeed';
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error;
                state.status = 'failed';
            });

        builder
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });

        builder
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.status = 'succeed';
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error;
                state.status = 'failed';
            });
    },
});

export const { setIsLoading, logout } = authSlice.actions;
export default authSlice.reducer;
