import { createContext, useState, useEffect, useContext } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo, sendReminder } from '../services/api';
import { useAuth } from './AuthContext';

const TodoContext = createContext();

export const useTodos = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      setError('Failed to fetch todos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      setError(null);
      const response = await createTodo(todoData);
      setTodos([...todos, response.data]);
      return response.data;
    } catch (error) {
      setError('Failed to create todo');
      console.error(error);
      throw error;
    }
  };

  const updateTodoItem = async (id, todoData) => {
    try {
      setError(null);
      const response = await updateTodo(id, todoData);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      return response.data;
    } catch (error) {
      setError('Failed to update todo');
      console.error(error);
      throw error;
    }
  };

  const removeTodo = async (id) => {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      setError('Failed to delete todo');
      console.error(error);
      throw error;
    }
  };

  const sendTodoReminder = async (id) => {
    try {
      setError(null);
      const response = await sendReminder(id);
      return response;
    } catch (error) {
      setError('Failed to send reminder');
      console.error(error);
      throw error;
    }
  };

  const value = {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo: updateTodoItem,
    deleteTodo: removeTodo,
    sendReminder: sendTodoReminder,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export default TodoContext; 