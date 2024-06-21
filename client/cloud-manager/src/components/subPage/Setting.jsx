import React from "react";
import { useState, useEffect, useContext } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
// import { UserContext } from "../../context/UserContext";
import addProjectIcon from "../../assets/add-project.svg";
import "../style.scss";
import AddMemberForm from "../form/AddMemberForm";

const Setting = (data) => {
  const type = data.type;
  if (type == "cloudProject") {
    const listInstances = data.listInstances;
    const cloudProject = data.cloudProject;
    const billing = data.billing;

    // State hooks for form fields
    const [formData, setFormData] = useState({
      name: cloudProject.name,
      id: cloudProject.id,
      provider: cloudProject.provider,
      projectId: cloudProject.projectId,
      billingTableId: cloudProject.billingTableId || "",
      billingAccount: cloudProject.billingAccount || "",
    });

    // Handle input change
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(
          `http://localhost:3000/cloudProject/${cloudProject._id}`,
          formData
        );
        toast.success("Project updated successfully.");
      } catch (error) {
        console.error("Error updating project:", error);
        toast.error("Error updating project.");
      }
    };
    return (
      <div>
        <div className="projectListPage w-max rounded-sm">
          <h3 className="text-xl font-bold mb-4">
            Update Cloud Application Information
          </h3>
          <form onSubmit={handleSubmit} className="w-max">
            <div>
              <div>
                <div>
                  <h3 className="text-lg font-bold">Name</h3>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mb-2 p-1 min-w-10 w-max disabled:bg-white"
                    size="50"
                    disabled
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">ID</h3>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="mb-2 p-1 min-w-10 w-max disabled:bg-white"
                    size="50"
                    disabled
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Provider</h3>
                  <input
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    className="mb-2 p-1 min-w-10 w-max disabled:bg-white"
                    size="50"
                    disabled
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">MultiCloud Project ID</h3>
                  <input
                    type="text"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className="mb-2 p-1 min-w-10 w-max disabled:bg-white"
                    size="50"
                    disabled
                  />
                </div>
                {cloudProject.provider === "google" && (
                  <div className="w-max">
                    <h3 className="text-lg font-bold row-direction">
                      Billing Table ID{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        className="ml-2"
                      >
                        <g fill="none">
                          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="black"
                            d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z"
                          />
                        </g>
                      </svg>
                    </h3>
                    <input
                      type="text"
                      name="billingTableId"
                      value={formData.billingTableId}
                      onChange={handleInputChange}
                      className="mb-2 p-1 min-w-10 w-max"
                      size="50"
                    />
                  </div>
                )}
                {cloudProject.provider === "google" &&
                  cloudProject.billingAccount !== undefined && (
                    <div>
                      <h3 className="text-lg font-bold row-direction">
                        Billing Account{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          className="ml-2"
                        >
                          <g fill="none">
                            <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path
                              fill="black"
                              d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z"
                            />
                          </g>
                        </svg>
                      </h3>

                      <input
                        type="text"
                        name="billingAccount"
                        value={formData.billingAccount}
                        onChange={handleInputChange}
                        className="mb-2 p-1 min-w-5 w-max"
                        size="50"
                      />
                    </div>
                  )}
                <button
                  type="submit"
                  className="mt-4 bg-blue-500 text-white p-2 rounded"
                >
                  Update Project
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  } else if (type == "instance") {
    return (
      <div className="projectListPage">
        <h1>Setting Instance</h1>
      </div>
    );
  } else if (type == "project") {
    const project = data.project;
    const [formData, setFormData] = useState({
      projectName: project.projectName,
      id: project._id,
      projectDescription: project.projectDescription,
      projectStatus: project.projectStatus,
      projectCreateDate: project.projectCreateDate,
      budgetLimit: project.budgetLimit,
      projectMembers: project.projectMembers,
    });

    const [buttonPopup, setButtonPopup] = useState(false);

    const handleOpenAddMemForm = () => {
      setButtonPopup(true);
    };

    return (
      <div className="m-0 row-direction justify-start align-top flex-wrap">
        <AddMemberForm
          trigger={buttonPopup}
          setTrigger={setButtonPopup}
          project={project}
        />
        <div className="projectListPage w-max rounded-sm m-3">
          <div>
            <h3 className="text-lg font-bold">Project Name</h3>
            <p className="mb-2 p-1 min-w-10 w-max">{formData.projectName}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Project ID</h3>
            <p className="mb-2 p-1 min-w-10 w-max">{formData.id}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Description</h3>
            <p className="mb-2 p-1 min-w-10 w-max">
              {formData.projectDescription}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Status</h3>
            <p className="mb-2 p-1 min-w-10 w-max">{formData.projectStatus}</p>
          </div>
        </div>
        <div className="projectListPage w-max rounded-sm m-3">
          <div className="row-direction justify-between">
            <h5 className="text-xl font-semibold">List of member</h5>
            <button
              type="button"
              onClick={handleOpenAddMemForm}
              className="row-direction hover:bg-blue-100 hover:shadow p-2 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="scale-150 mr-3"
              >
                <path
                  fill="black"
                  d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
                />
              </svg>
            </button>
          </div>
          <table className="mt-4 w-full " hover size="sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  ID
                </th>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Email
                </th>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {data.project.projectMembers.map((instance) => (
                <tr key={instance._id} className="hover:bg-slate-100">
                  <td className="pl-3 text-gray-700 whitespace-nowrap">
                    {instance.uid}
                  </td>
                  <td className="pl-3 text-gray-700 whitespace-nowrap">
                    {instance.email}
                  </td>
                  <td className="pl-3 text-gray-700 whitespace-nowrap">
                    {instance.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (type == "account") {
    return (
      <div className="projectListPage">
        <h1>Setting account</h1>
      </div>
    );
  }
};

export default Setting;
