import { AppRootStateType } from "app/store";

export const selectTodolists = (state: AppRootStateType) => state.todolists;
export const selectStatusTodolist = (state: AppRootStateType) => state.app.status;
