import React from "react";
import { useState, useEffect, useContext } from "react";
import TimePicker from "./TimePicker";
import "./style.scss";
import addIcon from "../assets/add.svg";
import cancelIcon from "../assets/cancel.svg";
import GraphCPU from "./graph/GraphCPU";
import GraphMemory from "./graph/GraphMemory";

const Overview = (project) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clusterList = [
    {
      clusterID: "cluster1",
      status: "active",
      provider: "Google",
      region: "us-central1",
      zone: "us-central1-a",
    },
    {
      clusterID: "cluster2",
      status: "active",
      provider: "Google",
      region: "us-central1",
      zone: "us-central1-a",
    },
    {
      clusterID: "cluster3",
      status: "inactive",
      provider: "AWS",
      region: "us-west-1",
      zone: "us-west-1a",
    },
    {
      clusterID: "cluster4",
      status: "inactive",
      provider: "AWS",
      region: "us-west-1",
      zone: "us-west-1a",
    },
  ];
  const clusterData = {
    google: {
      active: 0,
      inactive: 0,
    },
    aws: {
      active: 0,
      inactive: 0,
    },
  };
  const regionData = {
    "us-central1": {
      active: 0,
      inactive: 0,
    },
    "us-west-1": {
      active: 0,
      inactive: 0,
    },
    // Add more regions as needed
  };
  const [processData, setProcessData] = useState({ clusterData, regionData });

  const processingData = (clusterList) => {
    clusterList.forEach((cluster) => {
      if (cluster.provider === "Google") {
        clusterData.google[cluster.status]++;
      } else if (cluster.provider === "AWS") {
        clusterData.aws[cluster.status]++;
      }

      // Increment region-based counters
      if (regionData[cluster.region]) {
        regionData[cluster.region][cluster.status]++;
      }
    });

    return { clusterData, regionData };
  };

  useEffect(() => {
    const { clusterData, regionData } = processingData(clusterList);
    console.log("clusterData", clusterData);
    console.log("regionData", regionData);
    setProcessData({ clusterData, regionData });
  }, []);

  return (
    <div className="subPage">
      {" "}
      <TimePicker />
      {/* //TODO : Create the add cluster form */}
      <div className="listProvider">
        <div className="provider">
          <div className="providerName">Google</div>
          <div className="cluster">
            <div className="numberCluster">
              {processData &&
                processData.clusterData.google.active +
                  processData.clusterData.google.inactive}
            </div>
            {processData && processData.clusterData.google.inactive > 0 && (
              <div className="numberClusterNotWorking">
                {" "}
                <img src={cancelIcon} alt="" />
                processData.clusterData.google.inactive{" "}
              </div>
            )}
          </div>
          <div className="subtitle">Cluster</div>
        </div>
        <div className="provider">
          <div className="providerName">AWS</div>
          <div className="cluster">
            <div className="numberCluster">
              {processData &&
                processData.clusterData.aws.active +
                  processData.clusterData.aws.inactive}
            </div>

            {processData.clusterData.aws.inactive > 0 && (
              <div className="numberClusterNotWorking">
                {" "}
                <img src={cancelIcon} alt="" />
                {processData.clusterData.aws.inactive}{" "}
              </div>
            )}
          </div>
          <div className="subtitle">Cluster</div>
        </div>
        <div className="AddCluster">
          <button type="button">
            <img src={addIcon} alt="" />
          </button>
        </div>
      </div>
      <div className="overviewCluster"></div>
      <div className="clusterStatus"></div>
      <div className="graphList">
        <p>CPU</p>
        <GraphCPU />
        <p>Memory</p>
        <GraphMemory />
      </div>
    </div>
  );
};

export default Overview;
