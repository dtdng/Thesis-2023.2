import React from "react";
import { useState, useEffect, useContext } from "react";
import "./style.scss";
import cloudLogo from "../assets/cloud.png";
import { toast } from "react-toastify";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import axios, { isCancel, AxiosError } from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    var email = document.querySelector(
      'input[placeholder="Email address"]'
    ).value;
    var password = document.querySelector(
      'input[placeholder="Password"]'
    ).value;
    var fullName =
      document.querySelector('input[placeholder="First Name"]').value +
      " " +
      document.querySelector('input[placeholder="Last Name"]').value;

    var phoneNumber = document.querySelector(
      'input[placeholder="Phone Number"]'
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

    const account = {
      email: email,
      password: password,
      username: fullName,
      phone: phoneNumber,
    };
    console.log(account);
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/account",
        account
      );
      console.log(response.data);

      // Only proceed to user creation if account creation is successful
      await doCreateUserWithEmailAndPassword(email, password);

      // After both account and user creation succeed, continue...
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="loginPage">
      <div className="leftContainer">
        <p className="category">Cloud</p>

        <h3 className="applicationName">Multi-Cloud Management</h3>
        <br />
        <p>Welcome to our platform!</p>

        <div className="loginForm">
          <form action="" className="form" onSubmit={handleSubmit}>
            <div class="input-group mb-1">
              <input
                type="text"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="Email address"
                autoFocus
                required
              ></input>
            </div>
            <div class="input-group mb-1">
              <input
                type="text"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="First Name"
                autoFocus
                required
              ></input>
              <input
                type="text"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="Last Name"
                autoFocus
              ></input>
            </div>
            <div class="input-group mb-1">
              <input
                type="text"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="Phone Number"
                autoFocus
                required
              ></input>
            </div>

            <div class="input-group mb-1">
              <input
                type="password"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="Password"
                required
              ></input>
            </div>
            <div class="input-group mb-1">
              <input
                type="password"
                class="form-control form-control-lg bg-light fs-6"
                placeholder="Confirm password"
                required
              ></input>
            </div>
            <div class="input-group mb-5 d-flex justify-content-between"></div>
            <div class="input-group mb-3">
              <button class="btn btn-lg btn-primary w-100 fs-6" type="submit">
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
