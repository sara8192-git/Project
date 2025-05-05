import { createSlice } from '@reduxjs/toolkit'
const i={
token:null,
user:{}
}
const tokenSlice = createSlice({
    name: 'token',
    initialState: i,
    reducers: {
        setToken(state, action) {
            state.token = action.payload.token
            state.user=action.payload.user
            console.log(state.user);
        },
        logOut(state) {
            state.token = null; // איפוס הטוקן
            state.user = {};    // איפוס פרטי המשתמש
        }
    }
})

export const { setToken, logOut } = tokenSlice.actions
export default tokenSlice.reducer