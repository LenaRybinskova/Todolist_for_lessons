import {FilterValuesType, todolistsThunks} from 'features/TodolistsList/model/todolists/todolistSlice';
import {appActions} from 'app/appSlice';
import {createSlice} from '@reduxjs/toolkit';
import {clearState} from 'common/actions/common.actions';
import {createAppAsyncThunks, handleServerNetworkError} from 'common/utils'
import {ResultCode, TaskPriorities, TaskStatuses} from 'common/enums';
import {tasksApi} from 'features/TodolistsList/api/tasks/tasksApi';
import {
    AddTaskArgs,
    RemoveTaskArgs,
    TaskType,
    UpdateTaskModelType
} from 'features/TodolistsList/api/tasks/tasksApi.types';
import {TodolistType} from 'features/TodolistsList/api/todolists/todolistsApi.types';


// isDone заменили на status, у новых тасок по умолчанию priority: TaskPriorities.Low

/*/!*  [todolistId1]: [
          {id: v1(),title: 'CSS',status: TaskStatuses.New},
          {id: v1(),title: 'JS',status: TaskStatuses.Completed,},
          {id: v1(),title: 'React', status: TaskStatuses.New, }
      ],
       [todolistId2]: [
          {id: v1(),title: 'CSS',status: TaskStatuses.New},
          {id: v1(),title: 'JS',status: TaskStatuses.Completed,},
          {id: v1(),title: 'React', status: TaskStatuses.New, }
]
*!/*/
/*;*/

export type TasksStateType = Record<string, TaskType[]>

export type UpdateTaskDomainType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
};

export type UpdateTaskDomain = {
    todolistId: string;
    taskId: string;
    model: UpdateTaskDomainType;
};


export const sliceTasks = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId];
                tasks.unshift(action.payload.task);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model};
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) {
                    tasks.splice(index, 1);
                }
            })
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl: TodolistType) => (state[tl.id] = []));
            })
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId];
            })
            .addCase(todolistsThunks.createTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            .addCase(clearState, () => {
                return {};
            });
    },
    selectors: {
        selectTasksByFilter: (state, filter: FilterValuesType, todolistID: string) => {
            let tasks: TaskType[] = state[todolistID]
            if (filter === 'active') {
                tasks = tasks.filter((task) => task.status === TaskStatuses.New);
            }
            if (filter === 'completed') {
                tasks = tasks.filter((task) => task.status === TaskStatuses.Completed);
            }
            return tasks;
        }
    }
});

export const fetchTasks = createAppAsyncThunks<{ tasks: TaskType[]; todolistId: string }, string>(
    `${sliceTasks.name}/getTasks`,
    async (todolistId) => {
        const res = await tasksApi.getTasks(todolistId);
        return {tasks: res.data.items, todolistId};
    },
);

export const addTask = createAppAsyncThunks<{
    task: TaskType
}, AddTaskArgs>(`${sliceTasks.name}/addTask`, async (arg, thunkAPI): Promise<any> => {
    const {rejectWithValue} = thunkAPI
    const res = await tasksApi.createTask(arg)
    if (res.data.resultCode === ResultCode.Success) {
        const task = res.data.data.item
        return {task}
    } else {
        return rejectWithValue(res.data)
    }
})


export const updateTask = createAppAsyncThunks<UpdateTaskDomain, UpdateTaskDomain>(
    `${sliceTasks.name}/updateTask`,
    async (arg, thunkAPI) => {
        const {rejectWithValue, getState} = thunkAPI;
        const {todolistId, taskId, model} = arg;
        const state = getState();
        const task = state.tasks[todolistId].find((t) => t.id === taskId);
        if (!task) {
            return rejectWithValue(null);
        }

        const apiModel: UpdateTaskModelType = {
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            order: task.order,
            ...model,
        };

        const res = await tasksApi.updateTask({todolistId, taskId, model: apiModel});
        if (res.data.resultCode === ResultCode.Success) {
            return arg;
        } else {
            return rejectWithValue(null);
        }
    },
);

export const removeTask = createAppAsyncThunks<RemoveTaskArgs, RemoveTaskArgs>(
    `${sliceTasks.name}/removeTask`,
    async (arg) => {
        await tasksApi.deleteTask(arg);
        return arg;
    },
);

export const tasksSlice = sliceTasks.reducer;
export const {selectTasksByFilter} = sliceTasks.selectors;
export const thunkTasks = {addTask, updateTask, removeTask, fetchTasks}
export type TasksReducerType = ReturnType<typeof sliceTasks.getInitialState>;



















/* REDUX
import {
    changeTodolistEntityStatusAC,
    CreateTodolistACType,
    GetTodolistACType,
    RemoveTodolistActionType, ResponseErrorType
} from './todolistsList-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from '../api/todolistsList-api';
import {Dispatch} from 'redux';
import {AppActionsType, AppRootStateType, AppThunk} from '../app/store';
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from '../app/app-reducer';
import {handleServerAppError} from '../utils/error-utils';
import {AxiosError} from 'axios';


// isDone заменили на status, у новых тасок по умолчанию priority: TaskPriorities.Low
const initialState = {
    /!*  [todolistId1]: [
          {
              id: v1(),
              title: 'CSS',
              status: TaskStatuses.New,
              description: '',
              todoListId: todolistId1,
              order: 0,
              priority: TaskPriorities.Low,
              startDate: '',
              deadline: '',
              addedDate: ''
          },
          {
              id: v1(),
              title: 'JS',
              status: TaskStatuses.Completed,
              description: '',
              todoListId: todolistId1,
              order: 0,
              priority: TaskPriorities.Low,
              startDate: '',
              deadline: '',
              addedDate: ''
          },
          {
              id: v1(),
              title: 'React',
              status: TaskStatuses.New,
              description: '',
              todoListId: todolistId1,
              order: 0,
              priority: TaskPriorities.Low,
              startDate: '',
              deadline: '',
              addedDate: ''
          },
          {
              id: v1(),
              title: 'Redux',
              status: TaskStatuses.New,
              description: '',
              todoListId: todolistId1,
              order: 0,
              priority: TaskPriorities.Low,
              startDate: '',
              deadline: '',
              addedDate: ''
          }
      ],
      [todolistId2]: [
          {
              id: v1(),
              title: 'milk',
              status: TaskStatuses.Completed,
              description: '',
              todoListId: todolistId2,
              order: 0,
              priority: TaskPriorities.Low,
              startDate: '',
              deadline: '',
              addedDate: ''
          },
          {
              id: v1(),
              title: 'bread',
              status: TaskStatuses.Completed,
              description: '',
              todoListId: todolistId2,
              order: 0,
              priority: TaskPriorities.Low,
              startDate: '',
              deadline: '',
              addedDate: ''
          },
          {
              id: v1(),
              title: 'cheese',
              status: TaskStatuses.New,
              description: '',
              todoListId: todolistId2,
              order: 0,
              priority: TaskPriorities.Low,
              startDate: '',
              deadline: '',
              addedDate: ''
          }
      ]*!/
}

export const tasksSlice = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            const copyState = {...state};
            action.todolistsList.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState;
        case 'GET-TASKS':
            return {...state, [action.tlId]: action.tasks}
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(tl => tl.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'CREATE-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        }
        default:
            return state
    }
}

//action
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', todolistId, taskId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const getTasksAC = (tasks: TaskType[], tlId: string) => {
    return {
        type: 'GET-TASKS',
        tlId,
        tasks
    } as const
}
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateTaskDomainType) => {
    return {
        type: 'UPDATE-TASK',
        todolistId,
        taskId,
        model
    } as const
}


//thunk
export const getTaskTC = (tlId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTasks(tlId).then(res => dispatch(getTasksAC(res.data.items, tlId)))
        dispatch(setAppStatusAC('succeeded'))
    }
}
export const addTaskTC = (title: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.createTask(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
                    console.log('сюда попали')
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch((error: AxiosError<ResponseErrorType>) => {

        })
    }
}
export const removeTaskTC = (taskId: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.deleteTask(todolistId, taskId)
            .then(res => dispatch(removeTaskAC(taskId, todolistId)))
        dispatch(setAppStatusAC('succeeded'))
    }
}
export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateTaskDomainType): AppThunk => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            return
        }


        const apiModel: UpdateTaskModelType = {
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            order: task.order,
            ...model
        }
        dispatch(setAppStatusAC('loading'))
        todolistAPI.updateTask(todolistId, taskId, apiModel).then(res => {
                dispatch(updateTaskAC(todolistId, taskId, model))
                dispatch(setAppStatusAC('succeeded'))
            }
        )
    }
}


//types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type TasksActionsType =
    ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    | RemoveTodolistActionType
    | GetTodolistACType
    | ReturnType<typeof getTasksAC>
    | CreateTodolistACType


export type UpdateTaskDomainType = {
    title?: string,
    description?: string,
    status?: TaskStatuses,
    priority?: TaskPriorities,
    startDate?: string
    deadline?: string
}*/
