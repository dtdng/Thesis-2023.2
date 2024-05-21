import React from "react";

import "./style.scss";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const AddClusterInfo = (props) => {
  const { projectId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const clusterName = e.target.clusterName.value;
    const clusterID = e.target.clusterID.value;
    const cloudProjectID = e.target.cloudProjectID.value;
    const region = e.target.region.value;
    const provider = e.target.provider.value;
    const type = e.target.type.value;
    const apiKey = e.target.apiKey.value;
    if (!clusterName || !clusterID || !cloudProjectID || !region || !provider) {
      toast.error("Please fill all the fields");
      return;
    }

    const data = {
      name: clusterName,
      clusterID,
      region: region,
      projectID: projectId,
      cloudProjectID: cloudProjectID,
      provider,
      status: "Running",
      type: type,
      VITE_GOOGLE_API_KEY: apiKey,
    };

    console.log(data);
  };

  return props.trigger ? (
    <div className="overlayer">
      <form onSubmit={handleSubmit} className="">
        <div className="row g-3">
          <div className="mb-3 col">
            <label for="clusterName" class="form-label">
              Cluster Name
            </label>
            <input
              autoFocus
              type="text"
              className="form-control"
              id="clusterName"
              placeholder="cluster-12-abc"
            />
          </div>
          <div className="mb-3 col">
            <label for="clusterID" class="form-label">
              Cluster ID
            </label>
            <input
              type="text"
              className="form-control"
              id="clusterID"
              placeholder="02345..."
            />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-12">
            <label for="cloudProjectID" class="form-label">
              Cloud Project ID
            </label>
            <input
              type="text"
              className="form-control"
              id="cloudProjectID"
              placeholder="project-1234"
            />
          </div>
          <div className="col-md-12">
            <label for="apiKey" class="form-label">
              API KEY
            </label>
            <input
              type="password"
              className="form-control"
              id="apiKey"
              placeholder="api-key-123"
            />
          </div>
        </div>

        <div className="row g-3">
          <div className="col">
            <label for="region" class="form-label">
              Region
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              id="region"
            >
              <option selected value="us-west4-b">
                us-west4-b
              </option>
              <option value="us-west5-b">us-west5-b</option>
            </select>
          </div>

          <div className="col">
            <label for="provider" class="form-label">
              Provider
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              id="provider"
            >
              <option selected value="Google">
                Google
              </option>
              <option value="AWS">AWS</option>
              <option value="IBM" disabled>
                IBM
              </option>
            </select>
          </div>

          <div className="col ">
            <label for="type" class="form-label">
              Type
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              id="type"
            >
              <option selected>Instance</option>
              <option value="Cluster">Cluster</option>
            </select>
          </div>
        </div>

        <div>
          <button
            className="btn btn-outline-secondary btn-lg fs-6"
            onClick={() => props.setTrigger(false)}
          >
            Cancel
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

export default AddClusterInfo;
