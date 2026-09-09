import { Route, Routes } from 'react-router-dom';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Home.tsx'
import CapacityMapping from './CapacityMapping.tsx'
import Assets from './Assets.tsx'
import EnrichDescription from './EnrichDescription.tsx'
import Reports from './Reports.tsx'
import UserManagement from './UserManagement.tsx'
import Login from './Login.tsx';
import Logout from './Logout.tsx';




function App() {

  return (
  <>
     <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/Home'element={<Home/>}/>
      <Route path='/CapacityMapping'element={<CapacityMapping/>}/>
      <Route path='/Assets'element={<Assets/>}/>
      <Route path='/EnrichDescription' element={<EnrichDescription/>}/>
      <Route path='/Reports' element={<Reports/>}/>
      <Route path='/UserManagement' element={<UserManagement/>}/>
      <Route path='/Logout' element={<Logout/>}/>
     </Routes>
  </>
  )
}

export default App
