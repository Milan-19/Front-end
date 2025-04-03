import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useTodos } from '../context/TodoContext';
import { toast } from 'react-toastify';

const TodoItem = ({ todo }) => {
  const { updateTodo, deleteTodo, sendReminder } = useTodos();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (e) => {
    try {
      setIsLoading(true);
      const newStatus = e.target.value;
      await updateTodo(todo._id, { status: newStatus });
      toast.success(`Todo status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update todo status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        setIsLoading(true);
        await deleteTodo(todo._id);
        toast.success('Todo deleted successfully');
      } catch (error) {
        toast.error('Failed to delete todo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendReminder = async () => {
    try {
      setIsLoading(true);
      await sendReminder(todo._id);
      toast.success('Reminder sent successfully');
    } catch (error) {
      toast.error('Failed to send reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{todo.title}</h3>
          {todo.description && (
            <p className="text-gray-600 mt-1">{todo.description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}>
            {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
          </span>
          
          <select
            value={todo.status}
            onChange={handleStatusChange}
            disabled={isLoading}
            className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-y-2 justify-between items-center">
        <div className="text-sm text-gray-500">
          {todo.deadline && (
            <div className="flex items-center">
              <span className="mr-2">Deadline:</span>
              <span className={`font-medium ${new Date(todo.deadline) < new Date() && todo.status !== 'completed' ? 'text-red-600' : ''}`}>
                {format(new Date(todo.deadline), 'MMM d, yyyy')}
              </span>
            </div>
          )}
          
          {todo.reminder && todo.reminder.enabled && (
            <div className="flex items-center mt-1">
              <span className="mr-2">Reminder:</span>
              <span className="font-medium">
                {format(new Date(todo.reminder.time), 'MMM d, yyyy h:mm a')}
              </span>
              <span className="ml-2 text-xs">
                {todo.reminder.sent ? '(Sent)' : '(Pending)'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {todo.reminder && todo.reminder.enabled && !todo.reminder.sent && (
            <button
              onClick={handleSendReminder}
              disabled={isLoading}
              className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition-colors duration-200"
            >
              Send Now
            </button>
          )}
          
          <Link
            to={`/todos/${todo._id}`}
            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
          >
            View
          </Link>
          
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 