import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
const Layout = ({user}) => {

  return (
   <>
   <Navbar myUser={user}/>
   <Outlet/>
   </>
  )
}

export default Layout