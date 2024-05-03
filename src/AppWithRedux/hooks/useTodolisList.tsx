import {useAppDispatch, useAppSelector} from '../store';
import {useCallback, useEffect} from 'react';
import {createTodolistTC, getTodolistsTC, TodolistDomainType} from '../../features/todolists-reducer';
import {RequestStatusType} from '../app-reducer';
import {selectStatusTodolist, selectTodolists} from '../../features/TodolistList/todolist-selectors';
import {selectIsLoggedIn} from '../../features/login/login-selectors';
import {useDispatch} from 'react-redux';



export const useTodolisList = (demo: boolean) => {
    const todolists = useAppSelector<Array<TodolistDomainType>>(selectTodolists)
    const status = useAppSelector<RequestStatusType>(selectStatusTodolist)
    const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn)
    const dispatch =useDispatch() //useAppDispatch() не работает


    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title))
    }, [dispatch])


    useEffect(() => {
        // запрос за ТЛ пойдет только если залогинены
        if (!demo  && isLoggedIn) {
            dispatch(getTodolistsTC())
        } else {
            return
        }
    }, [])


    return {addTodolist, todolists, status, isLoggedIn}
}

