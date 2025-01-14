import './App.css'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import FieldManager from './components/FieldManager'
import Analytics from './pages/Analytics'
import Subscriptions from './pages/Subscriptions'
import FieldAnalysis from './pages/FieldAnalysis'
import AdminDashboard from './pages/AdminDashboard'
import { useSelector } from 'react-redux'

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/404" />;
  }

  return children;
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<PrivateRoute allowedRoles={['Admin', 'User']}><FieldManager /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute allowedRoles={['Admin', 'User']}><Analytics /></PrivateRoute>} />
          <Route path="/analytics/:id" element={<PrivateRoute allowedRoles={['Admin', 'User']}><FieldAnalysis /></PrivateRoute>} />
          <Route path="/subscriptions" element={<PrivateRoute allowedRoles={['User']}><Subscriptions /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute allowedRoles={['Admin']}><AdminDashboard /></PrivateRoute>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
}

export default App;
