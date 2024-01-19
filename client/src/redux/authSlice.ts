import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	isAuth: boolean;
	userId: string | null;
	username: string | null;
	sessionToken: string | null;
}

interface LoginPayload {
	userId: string;
	username: string;
	sessionToken: string;
}

const initialState: UserState = {
	isAuth: false,
	userId: null,
	username: null,
	sessionToken: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<LoginPayload>) => {
			state.isAuth = true;
			state.userId = action.payload.userId;
			state.username = action.payload.username;
			state.sessionToken = action.payload.sessionToken;
		},
	},
});

export const { login } = authSlice.actions;
export const selectIsAuthenticated = (state: { user: UserState }) =>
	state.user.isAuth;

export default authSlice.reducer;
