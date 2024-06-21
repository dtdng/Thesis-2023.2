import closeIcon from "../../assets/black-cancel.svg";
import searchIcon from "../../assets/icons_search.png";
import removeIcon from "../../assets/remove.svg";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../contexts/authContext/index";

const AddMemberForm = ({ project, trigger, setTrigger, refreshProject }) => {
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [err, setErr] = useState(false);
  const { currentUserData } = useAuth();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  var currentProject = project;

  const handleSearch = async () => {
    try {
      setLoadingSearch(true);
      const userDataResponse = await axios.get(
        "http://localhost:3000/account/" + userEmail
      );
      const userData = userDataResponse.data[0];

      if (userData && userData._id != currentUserData._id) setUser(userData);
      setErr(!userData);
      setLoadingSearch(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoadingSearch(false);
      setErr(true);
    }
  };

  const handleSelect = async () => {
    let addMember = { uid: user._id, email: user.email, role: "member" };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedProject = {
        ...project,
        projectMembers: [...project.projectMembers, ...selectedMembers],
      };

      console.log("updatedProject: ", updatedProject);
      const response = await axios.put(
        `http://localhost:3000/project/${project._id}`,
        updatedProject
      );

      console.log("response: ", response);

      toast.success("Members added successfully!");
      setTrigger(false);
    } catch (error) {
      console.error("Error updating project members:", error);
      toast.error("Failed to update members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return trigger ? (
    <div className="overlayer">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="add-member-form">
          <h5 className="text-l font-semibold p-3">Add New Member</h5>

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
            {loadingSearch && <ClipLoader size={20} color="#000" />}
            {user && (
              <div className="searchUserChat" onClick={handleSelect}>
                <div className="searchUserChatInfo">
                  <span>{user.email}</span>
                </div>
              </div>
            )}
          </div>
          {selectedMembers.map((m) => (
            <div className="row-direction">
              <span key={m.uid} style={{ color: "black" }}>
                {m.email}{" "}
              </span>
              {m.uid != currentUserData._id && (
                <img
                  src={removeIcon}
                  alt=""
                  onClick={() => handleRemove(m.uid)}
                  className="p-1"
                />
              )}
            </div>
          ))}
          <div className="row-direction justify-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setTrigger(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddMemberForm;
