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
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Home />
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