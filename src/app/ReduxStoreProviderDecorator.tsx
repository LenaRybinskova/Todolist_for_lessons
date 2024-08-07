import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { tasksReducer } from "features/tasksReducer";
import { todolistSlice } from "features/todolistSlice";
import { v1 } from "uuid";
import { AppRootStateType } from "./store";
import {} from "api/todolists-api";
import { todolistId1, todolistId2 } from "./id-utils";
import { thunk } from "redux-thunk";
import { authReducer } from "features/login/authSlice";
import { appReducer } from "app/appSlice";
import { TaskPriorities, TaskStatuses } from "common/enums/enums";

// заново как бы создаем стор, конкретно для сторибук
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistSlice,
  app: appReducer,
  auth: authReducer,
});

const initialGlobalState = {
  todolists: [
    { id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: "", entityStatus: "idle" },
    { id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: "", entityStatus: "loading" },
  ],
  tasks: {
    [todolistId1]: [
      {
        id: v1(),
        title: "CSS",
        status: TaskStatuses.New,
        description: "",
        todoListId: todolistId1,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: v1(),
        title: "JS",
        status: TaskStatuses.Completed,
        description: "",
        todoListId: todolistId1,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: v1(),
        title: "React",
        status: TaskStatuses.New,
        description: "",
        todoListId: todolistId1,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: v1(),
        title: "Redux",
        status: TaskStatuses.New,
        description: "",
        todoListId: todolistId1,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
    [todolistId2]: [
      {
        id: v1(),
        title: "milk",
        status: TaskStatuses.Completed,
        description: "",
        todoListId: todolistId2,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: v1(),
        title: "bread",
        status: TaskStatuses.Completed,
        description: "",
        todoListId: todolistId2,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: v1(),
        title: "cheese",
        status: TaskStatuses.New,
        description: "",
        todoListId: todolistId2,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
  },
  app: {
    error: null,
    status: "idle",
  },
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType, applyMiddleware(thunk));

// for decorator
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
