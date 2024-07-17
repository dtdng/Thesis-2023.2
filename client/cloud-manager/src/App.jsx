import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import React, { useContext, useState } from "react";

import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Graph from "./components/Graph";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./contexts/authContext";
import ProjectDashboard from "./pages/ProjectDashboard";
import InstanceDashboard from "./pages/InstanceDashboard";
import CloudProjectDashboard from "./pages/CloudProjectDashboard";
import RatingPage from "./pages/RatingPage";
import Overview from "./components/subPage/Overview";
import OverviewRatingPage from "./pages/OverviewRatingPage";
import DetailRatingPage from "./pages/DetailRatingPage";
function App() {
  const { currentUser } = useAuth();
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    } else {
    }
    return children;
  };
  const ProtectedRoute2 = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/" />;
    } else {
    }
    return children;
  };
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* <Route exact path="/graph" element={<Graph />} /> */}
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/instance/:instanceId"
          element={
            <ProtectedRoute>
              <InstanceDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/review" element={<OverviewRatingPage />} />
        <Route
          path="/detailReview/:provider/:region/:product"
          element={<DetailRatingPage />}
        />
        <Route
          exact
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/cloudProject/:cloudProjectId"
          element={
            <ProtectedRoute>
              <CloudProjectDashboard />
            </ProtectedRoute>
          }
        />

        <Route exact path="*" element={<NoPage />} />
        <Route
          exact
          path="/login"
          element={
            <ProtectedRoute2>
              <LoginPage />
            </ProtectedRoute2>
          }
        />
        <Route
          exact
          path="/register"
          element={
            <ProtectedRoute2>
              <SignUpPage />
            </ProtectedRoute2>
          }
        />
        <Route exact path="/graph" element={<Graph />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
