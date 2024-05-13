import React from "react";
import { useState, useEffect, useContext } from "react";

import "./style.scss";
import { useAuth } from "../contexts/authContext/index";
import searchIcon from "../assets/icons_search.png";
import removeIcon from "../assets/remove.svg";

import axios from "axios";
import { toast } from "react-toastify";

const CreateProjectForm = (props) => {
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [err, setErr] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const { currentUserData } = useAuth();

  const handleSearch = async () => {
    try {
      const userDataResponse = await axios.get(
        "http://localhost:3000/account/" + userEmail
      );
      const userData = userDataResponse.data[0];

      // console.log(userData);
      // console.log(currentUserData);
      if (userData && userData._id != currentUserData._id) setUser(userData);
      setErr(!userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErr(true);
    }
  };

  const handleSelect = async () => {
    let addMember = { uid: user._id, email: user.email };
    // console.log("selectedMembers: ", selectedMembers);
    if (selectedMembers.findIndex((x) => x.uid === addMember.uid) === -1)
      setSelectedMembers([...selectedMembers, addMember]);

    // console.log("selectedMembers: ", selectedMembers);
    setUser(null);
  };

  const handleRemove = (id) => {
    const updatedSelectedMembers = selectedMembers.filter(
      (member) => member.uid !== id
    );
    // Update the state with the filtered selectedMembers
    setSelectedMembers(updatedSelectedMembers);
  };

  useEffect(() => {
    if (currentUserData != null) {
      setSelectedMembers([
        ...selectedMembers,
        { uid: currentUserData._id, email: currentUserData.email },
      ]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      projectName: e.target[0].value,
      projectDescription: e.target[1].value,
      projectAdmin: currentUserData._id,
      projectMembers: selectedMembers,
      projectStatus: "running", // Default status is "running
      budgetLimit: e.target[2].value,
      totalBill: 0,
      numberOfVMs: 0,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/project",
        projectData
      );
      // console.log(response);
      props.setTrigger(false);
      if (response.status === 200) {
        toast.success("Project created successfully!");
      } else {
        toast.error(response.data.message);
      }
      setConfirm(true);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return props.trigger ? (
    <div className="overlayer">
      <form onSubmit={handleSubmit} className="form">
        <div class="input-group mb-1">
          <input
            type="text"
            class="form-control form-control-lg bg-light fs-6"
            placeholder="Project Name"
            required
          ></input>
        </div>
        <div class="input-group mb-1">
          <input
            type="text"
            class="form-control form-control-lg bg-light fs-6"
            placeholder="Project Description"
            required
          ></input>
        </div>
        <div class="input-group mb-1">
          <input
            type="text"
            class="form-control form-control-lg bg-light fs-6"
            placeholder="Budget"
            required
          ></input>
        </div>
        <div className="">
          <div class="input-group mb-1 search">
            <img
              className="searchIcon"
              src={searchIcon}
              alt=""
              onClick={handleSearch}
            />
            <input
              type="text"
              class="form-control form-control-lg bg-light fs-6"
              placeholder="Project Members Email"
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
              value={userEmail}
              // required
            ></input>
          </div>
          {err && <span className="error">User not found!</span>}
          {user && (
            <div className="searchUserChat" onClick={handleSelect}>
              <div className="searchUserChatInfo">
                <span>{user.email}</span>
              </div>
            </div>
          )}
        </div>
        {selectedMembers.map((m) => (
          <div>
            <span key={m.uid} style={{ color: "black" }}>
              {m.email}{" "}
            </span>
            {m.uid != currentUserData._id && (
              <img
                src={removeIcon}
                alt=""
                onClick={() => handleRemove(m.uid)}
              />
            )}
          </div>
        ))}
        <div>
          <button
            className="btn btn-outline-secondary btn-lg fs-6"
            onClick={() => props.setTrigger(false)}
          >
            cancel
          </button>
          <button type="submit" className="btn btn-success">
            Create
          </button>
        </div>
      </form>
    </div>
  ) : (
    ""
  );
};

export default CreateProjectForm;
