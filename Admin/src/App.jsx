/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layout from "./common/Layout";
import AddSchool from "./pages/AddSchool";
import OverView from "./pages/OverView";
import Read from "./pages/Read"
import AddStaff from "./pages/AddStaff";

const App = () => {
  const [activePage, setActivePage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

 
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/system" element={<Layout activePage={activePage} />}>
          <Route
            path=""
            element={<Dashboard setActivePage={setActivePage} />}
          />
          <Route
            path="dashboard"
            element={<Dashboard setActivePage={setActivePage} />}
          />
          <Route
            path="add-staff"
            element={<AddStaff setActivePage={setActivePage} />}
          />
          <Route
            path="add-school"
            element={<AddSchool setActivePage={setActivePage} />}
          />
          <Route
            path="overview"
            element={<OverView setActivePage={setActivePage} />}
          />
          <Route 
            path="read/:id"
            element={<Read />}
          />
         
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
