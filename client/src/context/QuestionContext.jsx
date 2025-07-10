// context for question to store fetched question data
import { createContext, useContext } from "react";

export const QuestionContext = createContext(null);
export const useQuestion = ()=> useContext(QuestionContext);