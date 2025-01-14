import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiConnector } from "../services/apiConnector";
import { FIELD_ENDPOINTS } from "../services/api";


const {
    FETCH_USER_FIELDS,
    FETCH_FIELD_BY_ID,
    CREATE_FIELD,
    UPDATE_FIELD,
    DELETE_FIELD
} = FIELD_ENDPOINTS;

export const fetchAllFields = createAsyncThunk(
    "fields/fetchAllFields",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const headers = token ? { Authorization: `Bearer ${token}` } : {}; 

            const response = await apiConnector("GET", FETCH_USER_FIELDS, null, headers);
            console.log("data is", response?.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Error fetching fields" });
        }
    }
);

export const fetchFieldById = createAsyncThunk(
    "fields/fetchFieldById",
    async (id, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await apiConnector("GET", FETCH_FIELD_BY_ID(id), null, headers);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Error fetching field" });
        }
    }
);

export const createField = createAsyncThunk(
    "fields/createField",
    async (fieldData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await apiConnector("POST", CREATE_FIELD, fieldData, headers);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Error creating field" });
        }
    }
);


export const updateField = createAsyncThunk(
    "fields/updateField",
    async ({ id, data }, { rejectWithValue, getState }) => { // Renamed `updatedData` to `data`
        try {
            const token = getState().auth.token;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await apiConnector("PUT", UPDATE_FIELD(id), data, headers);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Error updating field" });
        }
    }
);


export const deleteField = createAsyncThunk(
    "fields/deleteField",
    async (id, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await apiConnector("DELETE", DELETE_FIELD(id), null, headers);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Error deleting field" });
        }
    }
);


const initialState = {
    fields: [],
    field: null,
    isLoading: false,
    error: null,
    successMessage: null,
};

const fieldSlice = createSlice({
    name: "fields",
    initialState,
    reducers: {
        resetState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFields.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(fetchAllFields.fulfilled, (state, action) => {
                state.isLoading = false;
                state.fields = action.payload.data;
                state.successMessage = action.payload.message;
            })
            .addCase(fetchAllFields.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            });

        builder
            .addCase(fetchFieldById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFieldById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.field = action.payload.data;
                state.successMessage = action.payload.message;
            })
            .addCase(fetchFieldById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            });

        builder
            .addCase(createField.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createField.fulfilled, (state, action) => {
                state.isLoading = false;
                state.fields.push(action.payload.data);
                state.successMessage = action.payload.message;
            })
            .addCase(createField.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            });

        builder
            .addCase(updateField.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateField.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedField = action.payload.data;
                state.fields = state.fields.map((field) =>
                    field._id === updatedField._id ? updatedField : field
                );
                state.successMessage = action.payload.message;
            })
            .addCase(updateField.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            });

        builder
            .addCase(deleteField.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteField.fulfilled, (state, action) => {
                state.isLoading = false;
                const deletedFieldId = action.meta.arg;
                state.fields = state.fields.filter((field) => field._id !== deletedFieldId);
                state.successMessage = action.payload.message;
            })
            .addCase(deleteField.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            });
    },
});

export const { resetState } = fieldSlice.actions;
export default fieldSlice.reducer;
