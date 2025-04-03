import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, isPast, differenceInMinutes } from 'date-fns';
import { toast } from 'react-toastify';
import { getTodo } from '../services/api';
import { useTodos } from '../context/TodoContext';
import TodoForm from '../components/TodoForm';

const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTodo, deleteTodo, sendReminder } = useTodos();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [reminderStatus, setReminderStatus] = useState('');

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        const response = await getTodo(id);
        
        // Format dates for the form
        const todoData = response.data;
        if (todoData.deadline) {
          todoData.deadline = new Date(todoData.deadline).toISOString().slice(0, 16);
        }
        if (todoData.reminder && todoData.reminder.time) {
          todoData.reminder.time = new Date(todoData.reminder.time).toISOString().slice(0, 16);
          
          // Set reminder status
          updateReminderStatus(todoData.reminder);
        }
        
        setTodo(todoData);
      } catch (err) {
        setError('Failed to fetch todo details');
        toast.error('Failed to fetch todo details');
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  // Update reminder status message
  const updateReminderStatus = (reminder) => {
    if (!reminder || !reminder.enabled) {
      setReminderStatus('');
      return;
    }

    const reminderTime = new Date(reminder.time);
    
    if (reminder.sent) {
      setReminderStatus('Reminder has been sent');
    } else if (isPast(reminderTime)) {
      setReminderStatus('Reminder time has passed but not sent');
    } else {
      const minutesLeft = differenceInMinutes(reminderTime, new Date());
      if (minutesLeft < 60) {
        setReminderStatus(`Reminder will be sent in ${minutesLeft} minutes`);
      } else if (minutesLeft < 1440) { // Less than a day
        setReminderStatus(`Reminder will be sent in ${Math.floor(minutesLeft / 60)} hours`);
      } else {
        setReminderStatus(`Reminder will be sent on ${format(reminderTime, 'MMM d, yyyy')}`);
      }
    }
  };

  const handleUpdateTodo = async (todoData) => {
    try {
      setLoading(true);
      const updatedTodo = await updateTodo(id, todoData);
      
      // Update todo and reminder status
      setTodo(updatedTodo);
      if (updatedTodo.reminder && updatedTodo.reminder.enabled) {
        updateReminderStatus(updatedTodo.reminder);
      }
      
      setIsEditing(false);
      toast.success('Todo updated successfully');
    } catch (err) {
      toast.error('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        setIsDeleting(true);
        await deleteTodo(id);
        toast.success('Todo deleted successfully');
        navigate('/');
      } catch (err) {
        toast.error('Failed to delete todo');
        setIsDeleting(false);
      }
    }
  };

  const handleSendReminder = async () => {
    try {
      setIsSendingReminder(true);
      await sendReminder(id);
      
      // Update the local todo state to reflect the sent reminder
      setTodo(prev => {
        const updatedTodo = {
          ...prev,
          reminder: {
            ...prev.reminder,
            sent: true
          }
        };
        
        // Update reminder status
        updateReminderStatus(updatedTodo.reminder);
        
        return updatedTodo;
      });
      
      toast.success('Reminder sent successfully');
    } catch (err) {
      toast.error('Failed to send reminder');
    } finally {
      setIsSendingReminder(false);
    }
  };

  const getStatusBadgeClass = (status) => {
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

  const getReminderBadgeClass = (reminder) => {
    if (!reminder || !reminder.enabled) return '';
    
    if (reminder.sent) {
      return 'bg-green-100 text-green-800';
    } else if (isPast(new Date(reminder.time))) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading && !todo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !todo) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          &larr; Back to todos
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to todos
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
          <TodoForm 
            onSubmit={handleUpdateTodo} 
            initialData={todo} 
            submitButtonText="Update Todo"
          />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-4 w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      ) : todo ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{todo.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(todo.status)}`}>
                {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
              </span>
            </div>
            
            {todo.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{todo.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Created</h3>
                <p className="text-gray-600">
                  {format(new Date(todo.createdAt), 'MMMM d, yyyy h:mm a')}
                </p>
              </div>
              
              {todo.deadline && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Deadline</h3>
                  <p className={`${new Date(todo.deadline) < new Date() && todo.status !== 'completed' ? 'text-red-600' : 'text-gray-600'}`}>
                    {format(new Date(todo.deadline), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
              )}
            </div>
            
            {todo.reminder && todo.reminder.enabled && (
              <div className={`mb-6 p-4 rounded-md ${getReminderBadgeClass(todo.reminder)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Reminder</h3>
                    <p className="text-gray-600">
                      Scheduled for {format(new Date(todo.reminder.time), 'MMMM d, yyyy h:mm a')}
                    </p>
                    
                    {reminderStatus && (
                      <p className="text-sm mt-1 font-medium">
                        {reminderStatus}
                      </p>
                    )}
                  </div>
                  
                  {!todo.reminder.sent && (
                    <button
                      onClick={handleSendReminder}
                      disabled={isSendingReminder}
                      className={`px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isSendingReminder ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSendingReminder ? 'Sending...' : 'Send Now'}
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteTodo}
                disabled={isDeleting}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TodoDetail; 