import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiConnector } from "../services/apiConnector";

// Async thunks for CRUD operations
export const fetchAllFields = createAsyncThunk("fields/fetchAllFields", async (_, { rejectWithValue }) => {
    try {
        const response = await apiConnector("GET", "/fields");
        console.log("data is",response?.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error fetching fields" });
    }
});

export const fetchFieldById = createAsyncThunk("fields/fetchFieldById", async (id, { rejectWithValue }) => {
    try {
        const response = await apiConnector("GET", `/fields/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error fetching field" });
    }
});

export const createField = createAsyncThunk("fields/createField", async (fieldData, { rejectWithValue }) => {
    try {
        const response = await apiConnector("POST", "/fields", fieldData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error creating field" });
    }
});

export const updateField = createAsyncThunk("fields/updateField", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const response = await apiConnector("PUT", `/fields/${id}`, updatedData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error updating field" });
    }
});

export const deleteField = createAsyncThunk("fields/deleteField", async (id, { rejectWithValue }) => {
    try {
        const response = await apiConnector("DELETE", `/fields/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error deleting field" });
    }
});

// Initial state
const initialState = {
    fields: [],
    field: null,
    isLoading: false,
    error: null,
    successMessage: null,
};

// Slice
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
        // Fetch all fields
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

        // Fetch field by ID
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

        // Create a field
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

        // Update a field
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

        // Delete a field
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
