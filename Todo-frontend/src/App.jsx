import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { NotificationProvider } from './context/NotificationContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoList from './pages/TodoList';
import TodoDetail from './pages/TodoDetail';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is already authenticated, redirect to the home page or the page they were trying to access
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TodoList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/todos/:id"
        element={
          <ProtectedRoute>
            <TodoDetail />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TodoProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <AppRoutes />
              </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
          </NotificationProvider>
        </TodoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 