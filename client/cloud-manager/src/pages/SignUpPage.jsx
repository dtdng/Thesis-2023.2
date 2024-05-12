import React from "react";
import { useState, useEffect, useContext } from "react";
import "./style.scss";
import cloudLogo from "../assets/cloud.png";
import { toast } from "react-toastify";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    var email = document.querySelector(
      'input[placeholder="Email address"]'
    ).value;
    var password = document.querySelector(
      'input[placeholder="Password"]'
    ).value;
    var confirmPassword = document.querySelector(
      'input[placeholder="Confirm password"]'
    ).value;

    if (email === "" || password === "" || confirmPassword === "") {
      toast.error("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    console.log(email, password);

    try {
      await doCreateUserWithEmailAndPassword(email, password);
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
        <p>Welcome to our platform! Please provide some information</p>

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
            <div class="input-group mb-1">
              <input
                type="password"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="Confirm password"
              ></input>
            </div>
            <div class="input-group mb-5 d-flex justify-content-between"></div>
            <div class="input-group mb-3">
              <button
                class="btn btn-lg btn-primary w-100 fs-6"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
            </div>
            <div class="row">
              <small>
                Already have an account? <Link to="/login">Login</Link>
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

export default SignUpPage;
