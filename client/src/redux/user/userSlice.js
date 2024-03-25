import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentState: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentState = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentState = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (action, state) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state, action) => {
            state.currentState = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (action, state) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state, action) => {
            state.currentState = null;
            state.loading = false;
            state.error = null;
        },
    }
})
export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess
} = userSlice.actions;

export default userSlice.reducer;