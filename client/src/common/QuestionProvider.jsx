import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { QuestionContext } from "../context/QuestionContext";
const QuestionProvider = ({children}) => {
    const [ data, setData] = useState([])
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async()=>{
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/add-question`, {
      withCredentials: true,
    });
    setData(response.data);
  }

  console.log('my data is >>>', data);
  return(
    <QuestionContext.Provider value={data}>
        {children}
    </QuestionContext.Provider>
  )
};

export default QuestionProvider;
