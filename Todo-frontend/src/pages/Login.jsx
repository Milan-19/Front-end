import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, error: authError, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (authLoading || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      toast.success('Login successful!');
    } catch (error) {
      // Error is handled in AuthContext and displayed below
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-10">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
          Welcome Back
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Login to Your Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
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
          
          <div className="mb-6">
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
          
          {authError && (
            <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{authError}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                (authLoading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={authLoading || isSubmitting}
            >
              {isSubmitting || authLoading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/register"
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 