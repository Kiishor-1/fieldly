import './App.css'
import { Routes, Route } from 'react-router-dom'
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

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}>
          {
            user?.role === 'User' &&
            <>
              <Route index element={<FieldManager />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/analytics/:id" element={<FieldAnalysis />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
            </>
          }
          {
            user?.role === 'Admin' &&
            <Route path="/admin" element={<AdminDashboard />} />
          }

        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;