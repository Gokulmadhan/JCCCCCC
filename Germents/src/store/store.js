// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './userApi';
import authReducer from './authSlice';
import productReducer from './ProductSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import { cartApi } from './cartApi';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['jc_auth','products'], // add 'auth' here
};

const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    products:productReducer,
    jc_auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      userApi.middleware,cartApi.middleware
    ),
});

export const persistor = persistStore(store);
