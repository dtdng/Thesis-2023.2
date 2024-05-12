import React from "react";
import { useState, useEffect, useContext } from "react";
import "./style.scss";
import cloudLogo from "../assets/cloud.png";
import { toast } from "react-toastify";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    var email = document.querySelector(
      'input[placeholder="Email address"]'
    ).value;
    var password = document.querySelector(
      'input[placeholder="Password"]'
    ).value;

    if (email === "" || password === "") {
      toast.error("Please fill all the fields");
      return;
    }

    console.log(email, password);
    try {
      await doSignInWithEmailAndPassword(email, password);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="loginPage">
      <div className="leftContainer">
        <p className="category">Cloud</p>

        <h1 className="applicationName">Multi-Cloud Management</h1>
        <br />
        <p>Welcome back! Please login to your account</p>

        <div className="loginForm">
          <form action="" className="form" onSubmit={handleSubmit}>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="Email address"
                autoFocus
              ></input>
            </div>
            <div class="input-group mb-1">
              <input
                type="password"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="Password"
              ></input>
            </div>
            <div class="input-group mb-5 d-flex justify-content-between">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="formCheck"
                ></input>
                <label for="formCheck" class="form-check-label text-secondary">
                  <small>Remember Me</small>
                </label>
              </div>
              <div class="forgot">
                <small>
                  <a href="#">Forgot Password?</a>
                </small>
              </div>
            </div>
            <div class="input-group mb-3">
              <button
                class="btn btn-lg btn-primary w-100 fs-6"
                // onClick={handleSubmit}
              >
                Login
              </button>
            </div>
            {/* <div class="input-group mb-3">
                    <button class="btn btn-lg btn-light w-100 fs-6"><img src="images/google.png" style="width:20px" class="me-2"><small>Sign In with Google</small></button>
                </div> */}
            <div class="row">
              <small>
                Don't have account? <Link to="/register">Sign Up</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
      <div className="rightContainer">
        <div className="cloudLogo">
          <img src={cloudLogo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
