import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import toastReducer from "./toastSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		toast: toastReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
