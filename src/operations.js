import {  createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'https://connections-api.herokuapp.com/';

const setAuthHeader = token => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

const clearAuthHeader = token => {
    axios.defaults.headers.common.Authorization = "";
}

export const register = createAsyncThunk(
    "auth/register",
    async (credentials, thunkAPI) => {
        try {
            const resp = await axios.post("users/register", credentials);
            setAuthHeader(resp.data.token);
            return resp.data;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const singin = createAsyncThunk(
    "auth/singin",
    async (credentials, thunkAPI) => {
        try {
            const resp = await axios.post("users/singin", credentials);
            setAuthHeader(resp.data.token);
            return resp.data;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logOut = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            await axios.post("users/logout");
            clearAuthHeader();
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const refreshUser = createAsyncThunk(
    "auth/refresh",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState();
        const persistedToken = state.auth.token;
        if (persistedToken === null) {
            return thunkAPI.rejectWithValue("Unable to refresh user")
        }
        try {
            setAuthHeader(persistedToken);
            const resp = await axios.get("users/current");
            return resp.data;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);