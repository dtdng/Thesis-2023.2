import React, { useState, CSSProperties } from "react";

import "../style.scss";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import closeIcon from "../../assets/black-cancel.svg";
import axios from "axios";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const AddClusterInfo = (props) => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [cloudProjectID, setCloudProjectID] = useState("");
  const [provider, setProvider] = useState("google");

  const [loadingAddData, setLoadingAddData] = useState(false);
  const [data, setData] = useState([]);

  const handleProviderChange = (event) => {
    setData([]);
    setProvider(event.target.value.toLowerCase());
  };

  const handleCheck = async () => {
    var cloudProjectID = "";

    if (provider === "google") {
      cloudProjectID = document
        .getElementById("googleProjectID")
        .value.toLowerCase();
    } else if (provider === "aws") {
      cloudProjectID = document
        .getElementById("awsApplicationTag")
        .value.toLowerCase();
      if (cloudProjectID == "" || awsApplicationTag == "") {
        toast.error("Please enter the cloud project ID and application tag");
        return;
      }
    }

    console.log("cloudProjectID", cloudProjectID);
    setCloudProjectID(cloudProjectID);

    try {
      setData([]);
      setLoading(true);
      const res = await axios.patch(
        `http://localhost:3000/cloudProject/${provider}`,
        {
          cloudProjectID: cloudProjectID,
        }
      );

      if (res.status !== 200) {
        toast.error(res.message);
      } else {
        console.log("res.data", res.data);
        setData(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.length == 0) {
      toast.error("Please check the cloud project first");
      return;
    }
    try {
      setLoadingAddData(true);
      var count = 0;
      if (provider === "google") {
        const billingTableId = document.getElementById("billingTableId").value;
        const id = document
          .getElementById("googleProjectID")
          .value.toLowerCase();
        const cloudProject = {
          projectId: projectId,
          name: id,
          id: id,
          provider: provider,
          billingTableId: billingTableId,
        };
        axios.post("http://localhost:3000/cloudProject", cloudProject);
      } else if (provider === "aws") {
        const id = document.getElementById("awsProjectID").value.toLowerCase();
        const tag = document.getElementById("awsApplicationTag").value;
        const cloudProject = {
          projectId: projectId,
          name: id,
          id: tag,
          provider: provider,
          tag: tag,
        };
        axios.post("http://localhost:3000/cloudProject", cloudProject);
      }

      // Create an array of promises for all the axios post requests
      const promises = data.map((obj) => {
        if (obj.existed) {
          return;
        }
        const instance = {
          name: obj.name,
          id: obj.id,
          region: obj.zone,
          projectId: projectId,
          cloudProjectID: cloudProjectID,
          provider: provider,
          status: obj.status,
          type: obj.type,
          selfLink: obj.selfLink,
        };
        console.log("instance", instance);
        count++;
        // Return the axios post promise
        return axios.post("http://localhost:3000/cluster", instance);
      });

      // Wait for all promises to complete
      await Promise.all(promises);

      // If all requests are successful, show success message
      toast.success(`${count} clusters added successfully`);
      setLoadingAddData(false);
      props.setTrigger(false);
      setData([]);
    } catch (error) {
      console.error("Error adding clusters", error);
      toast.error("Error adding clusters");
      setLoadingAddData(false);
    }
  };

  return props.trigger ? (
    <div className="overlayer">
      <form onSubmit={handleSubmit} className="">
        <div className="form-header">
          <p>Cloud Project Information</p>
          <button
            type="button"
            className="closeFormBtn"
            onClick={() => {
              props.setTrigger(false);
              setData([]);
            }}
          >
            <img src={closeIcon} className="" alt="" srcset="" />
          </button>
        </div>

        <div className="row g-3">
          {provider === "google" && (
            <div>
              <div className="col-md-7">
                <label htmlFor="googleProjectID" className="form-label">
                  Cloud Project
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="googleProjectID"
                  placeholder="project-1234"
                />
              </div>
              <div className="col-md-7">
                <label htmlFor="billingTableId" className="form-label">
                  Billing Table ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="billingTableId"
                  placeholder="table-1234"
                />
              </div>
            </div>
          )}
          {provider === "aws" && (
            <div>
              <div className="col-md-7">
                <label htmlFor="awsProjectID" className="form-label">
                  Cloud Application
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="awsProjectID"
                  placeholder="application-1234"
                />
              </div>
              <div className="col-md-7">
                <label htmlFor="awsApplicationTag" className="form-label">
                  Application Tag
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="awsApplicationTag"
                  placeholder="tag-1234"
                />
              </div>
            </div>
          )}

          <div className="col">
            <label htmlFor="provider" className="form-label">
              Provider
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              id="provider"
              // value={provider}
              onChange={handleProviderChange}
            >
              <option value="Google">Google</option>
              <option value="AWS">AWS</option>
              <option value="IBM" disabled>
                IBM
              </option>
            </select>
          </div>
        </div>

        <div>
          <Table className="mt-4" hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Type</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {loading == true && (
                <div className="loading">Loading Instance Data....</div>
              )}
              {data.map((obj) => (
                <tr key={obj.id}>
                  <td>
                    <Link to={obj.selfLink}>{obj.name}</Link>
                  </td>
                  <td>{obj.zone}</td>
                  <td>{obj.status}</td>
                  <td>{obj.type}</td>
                  <td>
                    <input
                      type="checkbox"
                      readOnly
                      aria-label="obj existed"
                      checked={obj.existed}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCheck}
          >
            {loading == false && "Check"}
            <ClipLoader
              loading={loading}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </button>

          <button type="submit" className="btn btn-primary">
            {loadingAddData == false && "Add This Cloud Project"}
            <ClipLoader
              loading={loadingAddData}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </button>
        </div>
      </form>
    </div>
  ) : (
    ""
  );
};

export default AddClusterInfo;
