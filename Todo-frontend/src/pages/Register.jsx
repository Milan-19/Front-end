import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register: registerUser, error: authError, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    if (authLoading || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful!');
    } catch (error) {
      // Error is handled in AuthContext and displayed below
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-10">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
          Join Us
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create an Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="Full Name"
              disabled={authLoading || isSubmitting}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? 'border-red-500' : ''
              }`}
              placeholder="Email"
              disabled={authLoading || isSubmitting}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? 'border-red-500' : ''
              }`}
              placeholder="Password"
              disabled={authLoading || isSubmitting}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              placeholder="Confirm Password"
              disabled={authLoading || isSubmitting}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          {authError && (
            <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{authError}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                (authLoading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={authLoading || isSubmitting}
            >
              {isSubmitting || authLoading ? 'Registering...' : 'Register'}
            </button>
            <div className="text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 