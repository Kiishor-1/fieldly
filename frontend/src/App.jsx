import './App.css'
import {Routes, Route, useLocation} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import FieldManager from './components/FieldManager'
import Analytics from './pages/Analytics'
import Subscriptions from './pages/Subscriptions'
import FieldAnalysis from './pages/FieldAnalysis'

function App() {
  // const location = useLocation();
  // const NoNavbarAndFooter = location.pathname !== ''
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route index element={<FieldManager/>} />
          <Route path='/analytics' element={<Analytics/>} />
          <Route path='/analytics/:id' element={<FieldAnalysis/>} />
          <Route path='/subscriptions' element={<Subscriptions/>} />
        </Route>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  )
}

export default App
