
import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './landingpage'
import InputPage from './input'
import Dashboard from './dashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/input' element={<InputPage />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        
      </Routes>
    </>
  )
}

export default App;