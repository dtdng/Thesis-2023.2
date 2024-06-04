import React, { useEffect, useState } from "react";

import "./style.scss";
import MetricChart from "./graph/MetricChart";
import GraphCPU from "./graph/GraphCPU";
import GraphMemory from "./graph/GraphMemory";
import SimpleChart from "./graph/SimpleChart";

const OverviewInstance = ({ instance }) => {
  const temp = {
    name: "test",
    id: "123",
    type: "test",
    status: "test",
    region: "test",
    cloudProjectID: "test",
    provider: "test",
  };

  const [data, setData] = useState(temp);

  useEffect(() => {
    setData(instance);
  }, [instance]);

  return (
    <div className="instanceOverview">
      <div className="instanceInformation">
        <div className="instanceInformationTitle">
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fit=""
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              d="M14.44 16.95L11.584 12l2.854-5.032h5.706L23 11.998l-2.854 4.95H14.44zM3.853 22.94L1 17.99l2.854-5.03H9.56l2.855 5.03-2.854 4.95h-5.7zm0-11.98L1 6.03 3.854 1H9.56l2.855 5.032L9.56 10.96H3.855z"
              fill-rule="evenodd"
            ></path>
          </svg>
          Instance info
        </div>
        <div className="instanceInformationContent">
          <div className="info">
            <div className="infoTitle">Name</div>
            <div className="infoContent">{data.name}</div>
          </div>
          <div className="info">
            <div className="infoTitle">ID</div>
            <div className="infoContent">{data.id}</div>
          </div>
          <div className="info">
            <div className="infoTitle">Type</div>
            <div className="infoContent">{data.type}</div>
          </div>
        </div>
        <div className="instanceInformationContent">
          <div className="info">
            <div className="infoTitle">Status</div>
            <div className="infoContent">{data.status}</div>
          </div>
          <div className="info">
            <div className="infoTitle">Region</div>
            <div className="infoContent">{data.region}</div>
          </div>
          <div className="info">
            <div className="infoTitle">CloudProject ID</div>
            {data.provider == "google" && (
              <div className="infoContent">{data.cloudProjectID}</div>
            )}
            {data.provider == "aws" && (
              <div className="infoContent">
                {extractGroupIdentifier(data.cloudProjectID)}
              </div>
            )}
          </div>
          <div className="info">
            <div className="infoTitle">Provider</div>
            <div className="infoContent">{data.provider}</div>
          </div>
        </div>
      </div>
      {data.type === "compute#instance" && (
        <div className="row-direction">
          <MetricChart instanceID={data._id} type={"cpu"} />
          <MetricChart instanceID={data._id} type={"memory"} />
        </div>
      )}
      {data.type === "t2.micro" && (
        <div className="row-direction">
          <MetricChart instanceID={data._id} type={"cpu"} />
          {/* <MetricChart instanceID={data._id} type={"network_in"} /> */}
          {/* <MetricChart instanceID={data._id} type={"network_out"} /> */}
        </div>
      )}
      {data.type === "compute#instance" && (
        <div className="row-direction">
          <SimpleChart instanceIDList={[data._id]} type={"cpu"} period={1} />
          <SimpleChart instanceIDList={[data._id]} type={"memory"} period={1} />
        </div>
      )}
      {data.type === "t2.micro" && (
        <div>
          <div className="row-direction">
            <SimpleChart instanceIDList={[data._id]} type={"cpu"} period={5} />
            <SimpleChart instanceIDList={[data._id]} type={"network_in"} period={5} />
            <SimpleChart instanceIDList={[data._id]} type={"network_out"} period={5}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewInstance;

function extractGroupIdentifier(arnString) {
  const parts = arnString.split(":"); // Split the string by ':'
  const groupIdentifier = parts[parts.length - 1]; // Get the last part
  return groupIdentifier;
}
