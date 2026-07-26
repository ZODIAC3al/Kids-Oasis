import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveAccount } from '@/lib/accountManager';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isMfaEnabled?: boolean;
  } | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthState['user'] }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload.token);
        if (action.payload.user) {
          saveAccount(action.payload.user, action.payload.token);
        }
      }
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
    },
    logout(state) {
      if (typeof window !== 'undefined' && state.user?.email) {
        // Clear active token
        localStorage.removeItem('authToken');
      }
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
