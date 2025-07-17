import React from 'react'
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleBacktoHome = ()=>{
     navigate('/')
  }
  return (
    <>
    <h1>This is not available</h1>
    <button onClick={handleBacktoHome}>Home</button>
    </>
  )
}

export default NotFound