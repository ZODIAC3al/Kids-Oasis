import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import academiesReducer from './academiesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    academies: academiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
