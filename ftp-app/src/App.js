import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/dashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
