import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	getLocalStore,
	removeLocalStore,
	setLocalStore,
} from "../utils/storage";

interface UserState {
	userId: string;
	username: string;
	sessionToken: string;
}

export interface AuthState {
	isAuth: boolean;
	user: UserState | null;
}

// const storedState = getLocalStore<AuthState>("auth");

const initialState: AuthState = {
	isAuth: false,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		login: (state, action: PayloadAction<UserState>) => {
			state.isAuth = true;
			state.user = action.payload;
			setLocalStore<AuthState>("auth", state);
		},

		logout: (state) => {
			state.isAuth = false;
			state.user = null;
			removeLocalStore("auth");
		},

		validateSession: (state, action: PayloadAction<boolean>) => {
			if (!action.payload) {
				state.isAuth = false;
				state.user = null;
				removeLocalStore("auth");
			}
		},
	},
});

export const { login, logout, validateSession } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
	state.auth.isAuth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export default authSlice.reducer;
