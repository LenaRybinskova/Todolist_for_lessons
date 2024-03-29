import {useAppDispatch, useAppSelector} from '../../../AppWithRedux/store';
import {useCallback, useEffect, useMemo} from 'react';
import {addTaskTC, getTaskTC} from '../../tasks-reducer';
import {removeTodolistTC, TodolistDomainType, updateTodolistTC} from '../../todolists-reducer';
import {TaskStatuses, TaskType} from '../../../api/todolists-api';


export const UseTodolist = ({id, filter, title}: TodolistDomainType, demo?:boolean) => {

    let tasks = useAppSelector<Array<TaskType>>(state => state.tasks[id])
    const dispatch = useAppDispatch()

    useEffect(()=>{
        if(!demo){
            dispatch(getTaskTC(id))
        }
        else{return}
    },[])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(title, id))
    }, [dispatch])

    const removeTodolist = () => {
        dispatch(removeTodolistTC(id))
    }
    const changeTodolistTitle = useCallback((title: string) => {

        dispatch(updateTodolistTC(id, {title:title}))
    }, [dispatch, id, title])

    const onAllClickHandler = useCallback(() => dispatch(updateTodolistTC(id, {filter:'all'})), [dispatch, id])
    const onActiveClickHandler = useCallback(() => dispatch(updateTodolistTC(id, {filter:'active'})), [dispatch, id])
    const onCompletedClickHandler = useCallback(() => dispatch(updateTodolistTC(id, {filter:'completed'})), [dispatch, id])

// это у нас как бы расчет математический, его надо обернуть в useMemo()
    tasks = useMemo(() => {
        if (filter === 'active') {
            tasks = tasks.filter(t => t.status === TaskStatuses.New);
        }
        if (filter === 'completed') {
            tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
        }
        return tasks
    }, [tasks, filter])

    return {
        title,
        changeTodolistTitle,
        removeTodolist,
        addTask,
        tasks,
        onAllClickHandler,
        onActiveClickHandler,
        onCompletedClickHandler,
        id,
        filter
    }
}

