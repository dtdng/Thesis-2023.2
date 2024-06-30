import React from "react";
import { useState, useEffect, useContext } from "react";
import TimePicker from "../TimePicker";
import "../style.scss";
import GraphCPU from "../graph/GraphCPU";
import GraphMemory from "../graph/GraphMemory";
import OverviewClusterInfo from "../OverviewClusterInfo";
import axios from "axios";
import { ClipLoader } from "react-spinners";

import { useParams } from "react-router-dom";
import MapChart from "../graph/MapChart";
import ClusterStatusChar from "../graph/ClusterStatusChar";

const Overview = (project) => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonPopup, setButtonPopup] = useState(false);

  const templateData = {
    google: {
      working: 0,
      notWorking: 0,
    },
    aws: {
      working: 0,
      notWorking: 0,
    },
    cluster: {
      working: 0,
      notWorking: 0,
    },
    regionCount: 0,
    region: {},
    country: {},
    type: {
      cluster: 0,
      VM: 0,
    },
    cloudProjectCount: 0,
    cloudProject: {},
  };

  const [data, setData] = useState(templateData);
  const [rawData, setRawData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/clusters/${projectId}`
      );
      setRawData(response.data);
      setLoading(false);
      // console.log("response.data", response.data);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setInterval(() => {
      fetchData();
    }, 300000);
  }, []);

  useEffect(() => {
    const temp = templateData;
    rawData.forEach((instance) => {
      if (instance.status === "RUNNING") {
        temp.cluster.working++;
        if (instance.provider === "google") {
          temp.google.working++;
        } else if (instance.provider === "aws") {
          temp.aws.working++;
        }
      } else {
        temp.cluster.notWorking++;
        if (instance.provider === "google") {
          temp.google.notWorking++;
        } else if (instance.provider === "aws") {
          temp.aws.notWorking++;
        }
      }

      // Update region count
      if (!temp.region[instance.region]) {
        temp.regionCount++;
        temp.region[instance.region] = 1;
      } else {
        temp.region[instance.region]++;
      }
      var countryName = "";

      // Update country count
      if (instance.provider === "google") {
        const regionParts = instance.region.split("-");
        const regionName =
          regionParts.length > 2
            ? regionParts.slice(0, -1).join("-")
            : instance.region;
        countryName = processedCountryName(regionName);
      } else {
        countryName = processedCountryName(instance.region);
      }

      if (!temp.country[countryName]) {
        temp.country[countryName] = 1;
      } else {
        temp.country[countryName]++;
      }

      if (!temp.cloudProject[instance.cloudProjectID]) {
        temp.cloudProjectCount++;
        temp.cloudProject[instance.cloudProjectID] = 1;
      } else {
        temp.cloudProject[instance.cloudProjectID]++;
      }

      // Update type count
      if (instance.type === "k8s_cluster") {
        temp.type.cluster++;
      } else {
        temp.type.VM++;
      }
    });

    setData(temp);
  }, [rawData]);

  if (loading)
    return (
      <ClipLoader
        loading={loading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <div className="subPage">
      {" "}
      <TimePicker />
      <OverviewClusterInfo processedData={data} />
      <div className="row-direction visualizeMapStatus">
        <div className="statusChart">
          <p className="chartHeader">Resource Status</p>
          <div className="">
            <ClusterStatusChar processedData={data} />
          </div>
          <p>
            {data.cluster.working} Working - {data.cluster.notWorking} Not
            Working
          </p>
        </div>

        <div className="map">
          <MapChart processedData={data} />
        </div>
      </div>
    </div>
  );
};

export default Overview;

const nameMapping = {
  "europe-west4": "NL",
  "europe-west6": "CH",
  "europe-west8": "IT",
  "europe-west9": "FR",
  "me-central1": "QA",
  "me-central2": "SA",
  "northamerica-northeast1": "us",
  "northamerica-northeast2": "us",
  "southamerica-east1": "us",
  "southamerica-west1": "us",
  "us-central1": "us",
  "us-east1": "us",
  "us-east4": "us",
  "us-east5": "us",
  "us-south1": "us",
  "us-west1": "us",
  "us-west2": "us",
  "us-west3": "us",
  "us-west4": "us",
  "us-west4-a": "us",
  "us-west4-b": "us",
  "us-west4-c": "us",
  "europe-central2": "PL",
  "europe-north1": "FI",
  "europe-southwest1": "ES",
  "europe-west1": "BE",
  "europe-west10": "DE",
  "europe-west12": "IT",
  "europe-west2": "GB",
  "europe-west3": "DE",

  "me-west1": "IL",
  "asia-east1": "TW",
  "asia-east2": "CN",
  "asia-northeast1": "JP",
  "asia-northeast2": "JP",
  "asia-northeast3": "KR",
  "asia-south1": "IN",
  "asia-south2": "IN",
  "asia-southeast1": "SG",
  "asia-southeast2": "ID",
  "australia-southeast1": "AU",
  "australia-southeast2": "AU",
  "africa-south1": "ZA",
  "us-east-2": "us",
  "us-east-1": "us",
  "us-west-1": "us",
  "us-west-2": "us",
  "af-south-1": "ZA",
  "ap-east-1": "CN",
  "ap-south-2": "IN",
  "ap-southeast-3": "ID",
  "ap-southeast-4": "AU",
  "ap-south-1": "IN",
  "ap-northeast-3": "JP",
  "ap-northeast-2": "KR",
  "ap-southeast-1": "SG",
  "ap-southeast-2": "AU",
  "ap-northeast-1": "JP",
  "ca-central-1": "CA",
  "ca-west-1": "CA",
  "eu-central-1": "DE",
  "eu-west-1": "IE",
  "eu-west-2": "GB",
  "eu-south-1": "IT",
  "eu-west-3": "FR",
  "eu-south-2": "ES",
  "eu-north-1": "SE",
  "eu-central-2": "CH",
  "il-central-1": "IL",
  "me-south-1": "AE",
  "me-central-1": "AE",
  "sa-east-1": "BR",
};

const processedCountryName = (name) => {
  return nameMapping[name];
};
