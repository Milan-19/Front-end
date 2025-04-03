import { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import { toast } from 'react-toastify';

const TodoList = () => {
  const { todos, loading, error, addTodo } = useTodos();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleAddTodo = async (todoData) => {
    try {
      await addTodo(todoData);
      setShowForm(false);
      toast.success('Todo created successfully!');
    } catch (error) {
      toast.error('Failed to create todo');
    }
  };

  const filteredTodos = () => {
    if (filter === 'all') return todos;
    if (filter === 'completed') return todos.filter(todo => todo.status === 'completed');
    if (filter === 'in-progress') return todos.filter(todo => todo.status === 'in-progress');
    if (filter === 'pending') return todos.filter(todo => todo.status === 'pending');
    return todos;
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Todos</h1>
        <button
          onClick={toggleForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showForm ? 'Cancel' : 'Add New Todo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Todo</h2>
          <TodoForm onSubmit={handleAddTodo} />
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'in-progress'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredTodos().length > 0 ? (
        <div>
          {filteredTodos().map(todo => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No todos found.</p>
          {filter !== 'all' ? (
            <p className="text-sm text-gray-400">
              Try changing your filter or create a new todo.
            </p>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Create your first todo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList; 