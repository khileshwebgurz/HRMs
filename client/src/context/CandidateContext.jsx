// context for Candidate to store fetched candidate data
import { createContext, useContext } from "react";

export const CandidateContext = createContext(null);
export const useCandidate = ()=> useContext(CandidateContext);