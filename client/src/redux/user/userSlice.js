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
        signInStart: (state, action) => {
            console.log(action.payload)
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

    }
})
export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;