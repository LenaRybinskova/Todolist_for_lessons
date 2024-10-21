import {AppRootStateType} from '../AppWithRedux/store';
import {addTaskAC, getTasksAC, removeTaskAC, updateTaskAC, UpdateTaskDomainType} from './tasks-reducer';
import {GetTaskResponseType, ResponseType, TaskType, todolistAPI, UpdateTaskModelType} from '../api/todolists-api';
import {setAppStatusAC} from '../AppWithRedux/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {AxiosResponse} from 'axios';
import {call, put, select, takeEvery} from 'redux-saga/effects';




export const getTask = (tlId: string) => ({
    type: 'TASKS/FETCH-TASKS-SAGA',
    tlId
});

export function* fetchTasksSaga(action: ReturnType<typeof getTask>) {
    try {
        yield put(setAppStatusAC('loading'));
        const res: AxiosResponse<GetTaskResponseType> = yield call(
            todolistAPI.getTasks,
            action.tlId
        );
        if (!res.data.error) {
            yield put(getTasksAC(res.data.items, action.tlId));
            yield put(setAppStatusAC('succeeded'));
        } else {
            yield handleServerAppError(res.data);
        }
    } catch (e) {
        yield handleServerNetworkError(e as { message: string });
    }
}

export const addTask = (title: string, todolistId: string) => ({
    type: 'TASKS/ADD-TASK-SAGA',
    title,
    todolistId
});

export function* addTaskSaga(action: ReturnType<typeof addTask>) {
    yield put(setAppStatusAC('loading'));
    try {
        const res: AxiosResponse<ResponseType<{ item: TaskType }>> = yield call(
            todolistAPI.createTask,
            action.todolistId,
            action.title
        );
        if (res.data.resultCode === 0) {
            yield put(addTaskAC(res.data.data.item));
            yield put(setAppStatusAC('succeeded'));
        } else {
            handleServerAppError(res.data);
        }
    } catch (e) {
        yield handleServerNetworkError(e as { message: string });
    }
}

export const removeTask = (taskId: string, todolistId: string) => ({
    type: 'TASKS/REMOVE-TASK-SAGA',
    taskId,
    todolistId
});

export function* removeTaskSaga(action: ReturnType<typeof removeTask>) {
    yield put(setAppStatusAC('loading'));
    try {
        const res: AxiosResponse<ResponseType> = yield call(
            todolistAPI.deleteTask,
            action.todolistId,
            action.taskId
        );
        if (res.data.resultCode === 0) {
            yield put(removeTaskAC(action.taskId, action.todolistId));
            yield put(setAppStatusAC('succeeded'));
        } else {
            handleServerAppError(res.data);
        }
    } catch (e) {
        yield handleServerNetworkError(e as { message: string });
    }
}

export const updateTask = (
    todolistId: string,
    taskId: string,
    model: UpdateTaskDomainType
) => ({type: 'TASKS/UPDATE-TASK-SAGA', todolistId, taskId, model});

export const getTaskSSS = (
    state: AppRootStateType,
    todolistId: string,
    taslId: string
) => {
    return state.tasks[todolistId].find((t) => t.id === taslId);
};

export function* updateTaskSaga(action: ReturnType<typeof updateTask>) {
    const task: TaskType = yield select(
        getTaskSSS,
        action.todolistId,
        action.taskId
    );
    if (!task) {
        return;
    }

    const apiModel: UpdateTaskModelType = {
        title: task.title,
        status: task.status,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        order: task.order,
        ...action.model
    };

    yield put(setAppStatusAC('loading'));
    try {
        const res: AxiosResponse<ResponseType> = yield call(
            todolistAPI.updateTask,
            action.todolistId,
            action.taskId,
            apiModel
        );

        if (res.data.resultCode === 0) {
            yield put(updateTaskAC(action.todolistId, action.taskId, action.model));
            yield put(setAppStatusAC('succeeded'));
        } else {
            handleServerAppError(res.data);
        }
    } catch (e) {
        yield handleServerNetworkError(e as { message: string });
    }
}

export function* tasksWatcherSaga() {
  yield takeEvery('TASKS/FETCH-TASKS-SAGA', fetchTasksSaga);
  yield takeEvery('TASKS/ADD-TASK-SAGA', addTaskSaga);
  yield takeEvery('TASKS/REMOVE-TASK-SAGA', removeTaskSaga);
  yield takeEvery('TASKS/UPDATE-TASK-SAGA', updateTaskSaga);
}