// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import CandidateProvider from "./common/CandidateProvider.jsx";

createRoot(document.getElementById("root")).render(
  <CandidateProvider>
    <App />
  </CandidateProvider>
);
