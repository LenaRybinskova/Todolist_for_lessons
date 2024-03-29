import React, {useReducer} from 'react';
import '../AppWithRedux/App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from '../components/AddItemsForm/AddItemForm';
import {AppBar, Button, Container, Grid, Paper, Toolbar, Typography} from '@mui/material';
import IconButton from '@mui/material/IconButton/IconButton';
import {Menu} from '@mui/icons-material';
import {
    createTodolistAC,
    FilterValuesType,
    removeTodolistAC,
    todolistsReducer,
    updateTodolistAC
} from '../features/todolists-reducer';
import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from '../features/tasks-reducer';
import {TaskPriorities, TaskStatuses} from '../api/todolists-api';
import {todolistId1, todolistId2} from '../AppWithRedux/id-utils';


function AppWithReducers() {
    let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'all', order: 0, addedDate: '',entityStatus:"idle"},
        {id: todolistId2, title: 'What to buy', filter: 'all', order: 0, addedDate: '',entityStatus:"idle"}
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
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
        ]
    });


    function removeTask(id: string, todolistId: string) {
        dispatchToTasks(removeTaskAC(id, todolistId))
    }

    function addTask(title: string, todolistId: string) {
        dispatchToTasks(addTaskAC({
            id: 'id-exist',
            title: title,
            status: TaskStatuses.New,
            description: '',
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            order: 0,
            addedDate: '',
            todoListId: todolistId
        }))
    }

    function changeStatus(id: string, status: number, todolistId: string) {
        dispatchToTasks(updateTaskAC(todolistId,id, {status:status} ))
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        dispatchToTasks(updateTaskAC(todolistId,id, {title:newTitle}))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatchToTodolists(updateTodolistAC(todolistId, {filter: value}))
    }

    function removeTodolist(id: string) {
        let action = removeTodolistAC(id)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    function changeTodolistTitle(id: string, title: string) {
        dispatchToTodolists(updateTodolistAC(id, {title: title}))
    }

    function addTodolist(title: string) {
        const action = createTodolistAC({id: v1(), title: title, addedDate: '', order: 0});
        dispatchToTasks(action);
        dispatchToTodolists(action);
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
       {/*             //заглушка*/}
                    <AddItemForm addItem={addTodolist} disabled={false}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            if (tl.filter === 'active') {
                                tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.New);
                            }
                            if (tl.filter === 'completed') {
                                tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.Completed);
                            }

                            return <Grid key={tl.id} item>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducers;
