// TodoApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoApp.css';
import Footer from './Footer'

export default function TodoApp({ setTotalTodos, setCompletedTodos, token }) {
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
    const [error, setError] = useState('');

    // Fetch tasks from the API when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        setTotalTodos(tasks.length);
        setCompletedTodos(tasks.filter(task => task.completed).length);
    }, [tasks, setTotalTodos, setCompletedTodos]);

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`, // Add token to headers
                },
            });
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to load tasks');
        }
    };

    // Add a new task
    const addTask = async () => {
        if (!newTaskText.trim()) {
            setError('Task text cannot be empty');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/tasks', { text: newTaskText }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add token to headers
                },
            });
            setTasks([...tasks, res.data]);
            setNewTaskText('');
            setError('');
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task');
        }
    };

    // Delete a task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Edit a task (save the changes)
    const saveTaskEdit = async (id) => {
        if (!editTaskText.trim()) {
            setError('Task text cannot be empty');
            return;
        }

        try {
            const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { text: editTaskText }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(tasks.map(task => (task._id === id ? res.data : task)));
            setEditTaskId(null);
            setEditTaskText('');
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditTaskId(null);
        setEditTaskText('');
    };

    // Mark a task as completed/uncompleted
    const toggleTaskCompletion = async (id, completed) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(tasks.map(task => (task._id === id ? res.data : task)));
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };

    return (

        <div className="todo-container">
            <h1>Todo List</h1>

            <div className="todo-input">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task._id}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task._id, task.completed)}
                        />
                        {editTaskId === task._id ? (
                            <input
                                type="text"
                                value={editTaskText}
                                onChange={(e) => setEditTaskText(e.target.value)}
                            />
                        ) : (
                            <span onDoubleClick={() => {
                                setEditTaskId(task._id);
                                setEditTaskText(task.text);
                            }}  className={task.completed ? 'completed' : ''}>
                                {task.text}
                            </span>
                        )}
                        {editTaskId === task._id ? (
                            <>
                                <button onClick={() => saveTaskEdit(task._id)} className="save">Save</button>
                                <button onClick={cancelEdit} className="cancel">Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => {
                                    setEditTaskId(task._id);
                                    setEditTaskText(task.text);
                                }} className="edit">Edit</button>
                                <button onClick={() => deleteTask(task._id)} className="delete">Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
