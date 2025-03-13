import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import baseVersionReducer from './baseVersionSlice'; // Your slice reducer

// Configuration for Redux Persist
const persistConfig = {
  key: 'baseVersion',
  storage,
};

const persistedReducer = persistReducer(persistConfig, baseVersionReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Persistor for Redux Persist
export const persistor = persistStore(store);
