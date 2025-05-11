import { configureStore } from '@reduxjs/toolkit';
import { todosApi } from './services/todosApi';

/**
 * Redux store configuration
 * Sets up the store with todos API reducer and middleware
 */
export const store = configureStore({
  reducer: {
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todosApi.middleware),
});

// Type definitions for store state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;