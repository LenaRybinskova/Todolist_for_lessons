import { ResponseErrorType, todolistsActions } from "features/todolistSlice";
import { TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions } from "AppWithRedux/appSlice";
import { handleServerAppError } from "utils/error-utils";
import { AxiosError } from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppRootStateType, AppThunk } from "AppWithRedux/store";

// isDone заменили на status, у новых тасок по умолчанию priority: TaskPriorities.Low
const initialState = {
  /*  [todolistId1]: [
              {
                id: v1(),
                  title: 'CSS',

              },
              {
                  id: v1(),
                  title: 'JS',

              },
              {
                  id: v1(),
                  title: 'React',

              },
              {
                  id: v1(),
                  title: 'Redux',

              }
          ],
          [todolistId2]: [
              {
                  id: v1(),
                  title: 'milk',
              },
              {
                  id: v1(),
                  title: 'bread',
              },
              {
                  id: v1(),
                  title: 'cheese
              }
          ]*/
};

export const sliceTasks = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks.splice(index, 1);
      }
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasks = state[action.payload.task.todoListId];
      tasks.unshift(action.payload.task);
    },
    getTasks: (state, action: PayloadAction<{ tasks: TaskType[]; tlId: string }>) => {
      state[action.payload.tlId] = action.payload.tasks;
    },
    updateTask: (state, action: PayloadAction<{ todolistId: string; taskId: string; model: UpdateTaskDomainType }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.getTodolist, (state, action) => {
        action.payload.todolists.forEach((tl) => (state[tl.id] = []));
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistsActions.createTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.clearState, (state, action) => {
        return {};
      });
  },
});

export const tasksSlice = sliceTasks.reducer;
export const tasksActions = sliceTasks.actions;
export type tasksReducer = ReturnType<typeof sliceTasks.getInitialState>;

//thunk
export const getTaskTC = (tlId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistAPI.getTasks(tlId).then((res) => dispatch(tasksActions.getTasks({ tasks: res.data.items, tlId })));
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
  };
};
export const addTaskTC = (title: string, todolistId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(tasksActions.addTask({ task: res.data.data.item }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
          console.log("сюда попали");
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error: AxiosError<ResponseErrorType>) => {});
  };
};
export const removeTaskTC = (taskId: string, todolistId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistAPI.deleteTask(todolistId, taskId).then((res) =>
      dispatch(
        tasksActions.removeTask({
          taskId,
          todolistId,
        }),
      ),
    );
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
  };
};
export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateTaskDomainType): AppThunk => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
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
      ...model,
    };
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistAPI.updateTask(todolistId, taskId, apiModel).then((res) => {
      dispatch(tasksActions.updateTask({ todolistId, taskId, model }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};

//types
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
export type UpdateTaskDomainType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
/* REDUX
import {
    changeTodolistEntityStatusAC,
    CreateTodolistACType,
    GetTodolistACType,
    RemoveTodolistActionType, ResponseErrorType
} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {AppActionsType, AppRootStateType, AppThunk} from '../AppWithRedux/store';
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from '../AppWithRedux/app-reducer';
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
            action.todolists.forEach(tl => {
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
