import "./App.css";
import Home from "./pages/Home";
import { v4 as uuidV4 } from "uuid";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectToDocument />} />
        <Route path="/code-editor/:id" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

function RedirectToDocument() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/code-editor/${uuidV4()}`);
  }, [navigate]);

  return null; }

export default App;
