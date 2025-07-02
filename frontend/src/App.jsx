// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import F1 from "./pages/f1";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import F2 from "./pages/f2";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Landing */}
        <Route path="/" element={<F1 />} />
        <Route path="/collections" element={<F1 />} />
        <Route path="/feature2" element={<F2 />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
