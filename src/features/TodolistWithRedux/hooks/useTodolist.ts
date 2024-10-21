import { useAppDispatch, useAppSelector } from "../../../AppWithRedux/store";
import { useCallback, useEffect, useMemo } from "react";
import { addTask, getTask } from "../../tasks-sagas";
import { updateTodolist, removeTodolist } from "../../todolists-sagas";
import {
  changeTodolistFilterAC,
  TodolistDomainType
} from "../../todolists-reducer";
import { TaskStatuses, TaskType } from "../../../api/todolists-api";

export const UseTodolist = (
  { id, filter, title }: TodolistDomainType,
  demo?: boolean
) => {
  let tasks = useAppSelector<Array<TaskType>>((state) => state.tasks[id]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!demo) {
      dispatch(getTask(id));
    } else {
      return;
    }
  }, []);

  const addTaskCB = useCallback(
    (title: string) => {
      dispatch(addTask(title, id));
    },
    [dispatch]
  );

  const removeTodolistCB = () => {
    dispatch(removeTodolist(id));
  };
  const changeTodolistTitle = useCallback(
    (title: string) => {
      dispatch(updateTodolist(id, { title: title }));
    },
    [dispatch, id, title]
  );

  const onAllClickHandler = useCallback(
    () => dispatch(changeTodolistFilterAC(id, "all")),
    [dispatch, id]
  );
  const onActiveClickHandler = useCallback(() => {
    dispatch(changeTodolistFilterAC(id, "active"));
  }, [dispatch, id]);
  const onCompletedClickHandler = useCallback(
    () => dispatch(changeTodolistFilterAC(id, "completed")),
    [dispatch, id]
  );

  // это у нас как бы расчет математический, его надо обернуть в useMemo()
  tasks = useMemo(() => {
    if (filter === "active") {
      tasks = tasks.filter((t) => t.status === TaskStatuses.New);
    }
    if (filter === "completed") {
      tasks = tasks.filter((t) => t.status === TaskStatuses.Completed);
    }
    return tasks;
  }, [tasks, filter]);

  return {
    title,
    changeTodolistTitle,
    removeTodolistCB,
    addTaskCB,
    tasks,
    onAllClickHandler,
    onActiveClickHandler,
    onCompletedClickHandler,
    id,
    filter
  };
};