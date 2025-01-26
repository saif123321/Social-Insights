import thunk from 'redux-thunk';
import { combineReducer } from '../Reducers/rootReducer';
import {
    persistReducer,
    persistStore
} from 'redux-persist';
import {configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const persistConfig = {
    key : 'rn-task-storage-root',
    storage : AsyncStorage,
    debug : __DEV__,
};

const persistedReducer = persistReducer(persistConfig ,combineReducer);
export const store = configureStore({
    reducer : persistedReducer,
    middleware : getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck : false ,
        }),
});

export const persistor = persistStore(store);