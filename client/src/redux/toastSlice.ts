import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToastPayload {
	text: string;
	type: string;
}

interface ToastState {
	content: ToastPayload;
}

const initialState: ToastState = {
	content: { text: "", type: "" },
};

const toastSlice = createSlice({
	name: "toast",
	initialState,
	reducers: {
		setContent: (state, action: PayloadAction<ToastPayload>) => {
			state.content = action.payload;
		},
	},
});

export const { setContent } = toastSlice.actions;
export const selectContent = (state: { toast: ToastState }) =>
	state.toast.content;

export default toastSlice.reducer;
