// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../src/features/common/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
