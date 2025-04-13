import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Layout from "./common/Layout";
import AddStudent from "./pages/AddStudent";
import OverView from "./pages/OverView";
import Read from "./pages/Read";
import CheckStudent from "./pages/CheckStudent";
import Update from "./pages/Update";
import Conduct from "./pages/Conduct";
import Status from "./pages/Status";
import Incidents from "./pages/Incidents";
import StaffManagement from "./pages/StaffManagement";


const App = () => {
  const [activePage, setActivePage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //Check authentication on app load and on token change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // true if token exists
  }, []); // Only runs on first load

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protected routes */}
        <Route
          path="/system"
          element={
            isAuthenticated
              ? <Layout activePage={activePage} handleLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        >
          <Route path="dashboard" element={<Dashboard setActivePage={setActivePage} />} />
          <Route path="check-student" element={<CheckStudent setActivePage={setActivePage} />} />
          <Route path="add-student" element={<AddStudent setActivePage={setActivePage} />} />
          <Route path="conduct/:id" element={<Conduct setActivePage={setActivePage} />} />
          <Route path="update/:id" element={<Update setActivePage={setActivePage} />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="status/:id" element={<Status setActivePage={setActivePage} />} />
          <Route path="staff-management" element={<StaffManagement setActivePage={setActivePage} />} />
          <Route path="overview" element={<OverView setActivePage={setActivePage} />} />
          <Route path="read/:id" element={<Read />} />
        </Route>

        {/* Catch-all route for invalid URLs */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
