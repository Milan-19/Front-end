import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const TodoForm = ({ onSubmit, initialData = null, submitButtonText = 'Create Todo' }) => {
  const [showReminderOptions, setShowReminderOptions] = useState(
    initialData?.reminder?.enabled || false
  );
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      status: 'pending',
      deadline: '',
      reminder: {
        enabled: false,
        time: '',
      },
    },
  });

  const onFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      reminder: showReminderOptions
        ? data.reminder
        : { enabled: false, time: null, sent: false },
    };
    
    await onSubmit(formattedData);
    
    if (!initialData) {
      reset();
      setShowReminderOptions(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('description')}
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('status')}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <input
          id="deadline"
          type="datetime-local"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('deadline')}
        />
      </div>

      <div className="flex items-center">
        <input
          id="enableReminder"
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={showReminderOptions}
          onChange={() => setShowReminderOptions(!showReminderOptions)}
        />
        <label htmlFor="enableReminder" className="ml-2 block text-sm text-gray-700">
          Enable reminder
        </label>
      </div>

      {showReminderOptions && (
        <div className="pl-6">
          <div>
            <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Time *
            </label>
            <Controller
              name="reminder.enabled"
              control={control}
              render={({ field }) => (
                <input
                  type="hidden"
                  {...field}
                  value={showReminderOptions}
                />
              )}
            />
            <Controller
              name="reminder.time"
              control={control}
              rules={{ required: showReminderOptions ? 'Reminder time is required' : false }}
              render={({ field }) => (
                <input
                  id="reminderTime"
                  type="datetime-local"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.reminder?.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...field}
                />
              )}
            />
            {errors.reminder?.time && (
              <p className="mt-1 text-xs text-red-500">{errors.reminder.time.message}</p>
            )}
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default TodoForm; 