import React from 'react'
import { useParams } from 'react-router-dom'
import MyProfile from '../../DashboardComponent/MyProfile';
const PersonalDetail = () => {
    const paths = useParams();
  
  return (
    <MyProfile path={paths.userId}/>
  )
}

export default PersonalDetail