import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import ProjectPage from './ProjectPage'
import Profile from './Profile'
import InputForm from './InputForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home />}/>
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/:userId/addProject" element={<InputForm />} />
        <Route path="/profile/:userId/editProject" element={<InputForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
