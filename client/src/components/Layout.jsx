import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
const Layout = ({user , isAdminMode, setIsAdminMode}) => {

  return (
   <>
   <Navbar myUser={user} isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode}/>
   <Outlet context={{ isAdminMode }}/>
   </>
  )
}

export default Layout