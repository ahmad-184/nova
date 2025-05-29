import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginProcessType, SignUpProcessType } from "../../type";

type AuthState = {
  loginProcess: LoginProcessType;
  signUpProcess: SignUpProcessType;
};

const initialState: AuthState = {
  loginProcess: "login",
  signUpProcess: "sign-up",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeLoginProcess(state, action: PayloadAction<LoginProcessType>) {
      state.loginProcess = action.payload;
    },
    changeSignUpProcess(state, action: PayloadAction<SignUpProcessType>) {
      state.signUpProcess = action.payload;
    },
  },
});

export const {
  changeLoginProcess: changeLoginProcessAction,
  changeSignUpProcess: changeSignUpProcessAction,
} = authSlice.actions;

export default authSlice;
