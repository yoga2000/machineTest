import React from "react";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import AddEmployee from "./pages/AddEmployee";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/create" element={<AddEmployee />} />
        <Route path="/update/:id" element={<AddEmployee />} />
      </Routes>
    </div>
  );
};

export default App;
