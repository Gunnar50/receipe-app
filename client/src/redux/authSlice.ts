import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	userId: string;
	username: string;
	image: string | null;
}

export interface AuthState {
	isAuth: boolean;
	user: UserState | null;
}

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
		},

		logout: (state) => {
			state.isAuth = false;
			state.user = null;
		},

		validateSession: (state, action: PayloadAction<boolean>) => {
			if (!action.payload) {
				state.isAuth = false;
				state.user = null;
			}
		},
	},
});

export const { login, logout, validateSession } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
	state.auth.isAuth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export default authSlice.reducer;
