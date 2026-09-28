import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login            from "./pages/Login";
import Register         from "./pages/Register";
import DonorDashboard   from "./pages/DonorDashboard";
import CampaignPage     from "./pages/CampaignPage";
import DonatePage       from "./pages/DonatePage";
import NGOAdminPanel    from "./pages/NGOAdminPanel";
import ExpenditurePage  from "./pages/ExpenditurePage";
import AuditorPanel     from "./pages/AuditorPanel";
import PublicDashboard  from "./pages/PublicDashboard";
import SuperAdminPanel  from "./pages/SuperAdminPanel";

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/"               element={<Navigate to="/login" />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/campaigns"      element={<CampaignPage />} />
        <Route path="/donate/:id"     element={<DonatePage />} />
        <Route path="/ngo-admin"      element={<NGOAdminPanel />} />
        <Route path="/expenditure"    element={<ExpenditurePage />} />
        <Route path="/auditor"        element={<AuditorPanel />} />
        <Route path="/dashboard"      element={<PublicDashboard />} />
        <Route path="/super-admin"    element={<SuperAdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;