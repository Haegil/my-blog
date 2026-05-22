import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    search: searchReducer,
  },
});
