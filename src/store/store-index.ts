import { configureStore ,Reducer,UnknownAction } from "@reduxjs/toolkit";
import { useDispatch} from 'react-redux'
import userReducer from './module/users'
import type { userInfo } from "./module/users";
import type { PersistPartial } from "redux-persist/es/persistReducer";
import {
    persistStore,
    persistReducer,
    // FLUSH,
    // REHYDRATE,
    // PAUSE,
    // PERSIST,
    // PURGE,
    // REGISTER,
  } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist:['token']
  }


export const store = configureStore({
       reducer:{
        user:persistReducer(persistConfig,userReducer) as Reducer<userInfo & PersistPartial, UnknownAction>
       },
       middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        //   serializableCheck: {
        //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        //   },
        serializableCheck:false
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

persistStore(store)
