// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import F1 from "./pages/f1";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Landing */}
        <Route path="/" element={<F1 />} />

        
      </Routes>
    </Router>
  );
};

export default App;
