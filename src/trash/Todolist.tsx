import React, { ChangeEvent } from "react";
import { AddItemForm } from "common/components/AddItemsForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import { Delete } from "@mui/icons-material";
import { Button, Checkbox } from "@mui/material";

import { FilterValuesType } from "features/TodolistsList/model/todolists/todolistSlice";
import { TaskStatuses } from "common/enums/enums";
import {TaskType} from 'features/TodolistsList/api/tasks/tasksApi.types';

type PropsType = {
  id: string;
  title: string;
  tasks: Array<TaskType>;
  removeTask: (taskId: string, todolistId: string) => void;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeTaskStatus: (id: string, status: number, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
  filter: FilterValuesType;
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void;
};

export function Todolist(props: PropsType) {
  const addTask = async (title: string) => {
   /* props.addTask(title, props.id);*/
  };

  const removeTodolist = () => {
    props.removeTodolist(props.id);
  };
  const changeTodolistTitle = (title: string) => {
    props.changeTodolistTitle(props.id, title);
  };

  const onAllClickHandler = () => props.changeFilter("all", props.id);
  const onActiveClickHandler = () => props.changeFilter("active", props.id);
  const onCompletedClickHandler = () => props.changeFilter("completed", props.id);

  return (
    <div>
      <h3>
        {" "}
        <EditableSpan value={props.title} onChange={changeTodolistTitle} />
        <IconButton onClick={removeTodolist}>
          <Delete />
        </IconButton>
      </h3>
      {/*        //заглушка*/}
      <AddItemForm addItem={addTask} disabled={false} />
      <div>
        {props.tasks.map((t) => {
          const onClickHandler = () => props.removeTask(t.id, props.id);
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;

            props.changeTaskStatus(t.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.id);
          };
          const onTitleChangeHandler = (newValue: string) => {
            props.changeTaskTitle(t.id, newValue, props.id);
          };

          return (
            <div key={t.id} className={t.status === TaskStatuses.Completed ? "is-done" : ""}>
              <Checkbox checked={t.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />

              <EditableSpan value={t.title} onChange={onTitleChangeHandler} />
              <IconButton onClick={onClickHandler}>
                <Delete />
              </IconButton>
            </div>
          );
        })}
      </div>
      <div>
        <Button variant={props.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
          All
        </Button>
        <Button
          variant={props.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}>
          Active
        </Button>
        <Button
          variant={props.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}>
          Completed
        </Button>
      </div>
    </div>
  );
}
