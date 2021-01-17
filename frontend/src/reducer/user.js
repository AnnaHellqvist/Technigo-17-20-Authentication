import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    login: {
        userName: "",
        accessToken: null,
        userId: "",
        statusMessage: "",
    }
};

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
      setAccessToken: (store, action) => {
            const accessToken = action.payload;
            console.log(`Access token: ${accessToken}`);
            store.login.accessToken = accessToken;
        },
        setUserId: (store, action) => {
            const userId = action.payload;
            console.log(`User id: ${userId}`);
            store.login.userId = userId;
        },
        setUserName: (store, action) => {
            const userName = action.payload;
            console.log(`User name: ${userName}`);
            store.login.userName = userName;
        },
        setStatusMessage: (store, action) => {
            const { statusMessage } = action.payload;
            console.log(`Status message: ${statusMessage}`)
            store.login.statusMessage = statusMessage;
        },
        logout: (store, action) => {
            console.log("logging out");
            store.login.userId = 0;
            store.login.accessToken = null;
            store.login.userName = '';
        },
    }
});