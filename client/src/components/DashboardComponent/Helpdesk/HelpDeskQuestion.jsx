import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../utils/api";

const HelpDeskQuestion = () => {
  const { helpdeskID } = useParams();
  const [answer, setAnswer] = useState([]);
  const fetchResults = async () => {
    const res = await api.get(`/helpdesk/answer/${helpdeskID}`);
    setAnswer(res.data.data);
  };
  useEffect(() => {
    fetchResults();
  }, []);

  console.log('answr',answer)
  return (
    <>
   <h1>{answer.question}</h1> 
   <span>{answer.answer}</span>
    </>
  )
};

export default HelpDeskQuestion;
