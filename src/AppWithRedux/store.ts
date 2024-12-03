import { tasksSlice } from "features/tasksSlice";
import {todolistSlice, todolistsSlice} from 'features/todolistSlice';
import { ThunkAction } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "AppWithRedux/appSlice";
import { authReducer, authSlice } from "features/login/authSlice";
import { configureStore, UnknownAction } from "@reduxjs/toolkit";
import { todolistsApi} from 'api/todolists-api';
import {RootState, setupListeners} from '@reduxjs/toolkit/query';
import {baseApi} from 'api/base-api';



export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    // todolists: todolistSlice,
    [baseApi.reducerPath]: baseApi.reducer,
    app: appReducer,
auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware)
});

setupListeners(store.dispatch)

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>;

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

/*//REDUX
import {TasksActionsType, tasksSlice} from '../features/tasks-reducer';
import {TodolistsActionsType, todolistSlice} from '../features/todolists-reducer';
import {applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {thunk, ThunkAction, ThunkDispatch} from 'redux-thunk';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppActionType, appSlice} from './app-reducer';
import {LoginActionType, authSlice} from '../features/login/auth-reducer';

const rootReducer = combineReducers({
    tasks: tasksSlice,
    todolists: todolistSlice,
    app:appSlice,
    auth:authSlice
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TodolistsActionsType | TasksActionsType | AppActionType | LoginActionType

//сделали универс диспач, чтобы мог дисп и эакшены и санки
export type AppDispatchType=ThunkDispatch<AppRootStateType,unknown,AppActionsType>
// сделали универс типизацию Thunk для всех санк
export type AppThunk<ReturnType=void>=ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

export const useAppDispatch = useDispatch<AppDispatchType>;
export const useAppSelector:TypedUseSelectorHook<AppRootStateType>=useSelector
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

//window.store.getState()*/
