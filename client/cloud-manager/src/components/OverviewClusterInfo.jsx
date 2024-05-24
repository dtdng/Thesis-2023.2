import React, { useEffect, useState } from "react";

import addIcon from "../assets/add.svg";
import cancelIcon from "../assets/cancel.svg";
import AddClusterInfo from "./form/AddClusterInfo";
import "./style.scss";

const OverviewClusterInfo = (processedData) => {
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
  };

  const [data, setData] = useState(templateData);

  useEffect(() => {
    setData(processedData.processedData);
    // console.log("processedData", processedData);
  }, [processedData]);

  const handleOpenForm = () => {
    setButtonPopup(true);
  };
  return (
    <div className="OverViewClusterInfo">
      <div className="listProvider">
        <AddClusterInfo trigger={buttonPopup} setTrigger={setButtonPopup} />
        <div className="provider">
          <div className="providerName">Google</div>
          <div className="cluster">
            <div className="numberCluster">
              {data.google.working + data.google.notWorking}
            </div>
            {data.google.notWorking > 0 ? (
              <div className="numberClusterNotWorking">
                {" "}
                <img src={cancelIcon} alt="" />
                {data.google.notWorking}
              </div>
            ) : null}
          </div>
          <div className="subtitle">Instance</div>
        </div>
        <div className="provider">
          <div className="providerName">AWS</div>
          <div className="cluster">
            <div className="numberCluster">
              {data.aws.working + data.aws.notWorking}
            </div>
            {data.aws.notWorking > 0 ? (
              <div className="numberClusterNotWorking">
                {" "}
                <img src={cancelIcon} alt="" />
                {data.aws.notWorking}
              </div>
            ) : null}
          </div>
          <div className="subtitle">Instance</div>
        </div>
        <div className="AddCluster">
          <button
            type="button"
            onClick={handleOpenForm}
            className="addClusterBtn"
          >
            <img src={addIcon} alt="" />
          </button>
        </div>
      </div>

      <div className="clusterOverview">
        <div className="numberOfClusters data">
          <h5>{data.type.cluster}</h5>
          <p className="data_name">K8s Clusters</p>
        </div>
        <div className="numberOfVMs data">
          <h5>{data.type.VM}</h5>
          <p className="data_name">VMs</p>
        </div>
        <div className="region data">
          <h5>{data.regionCount}</h5>
          <p className="data_name">Regions</p>
        </div>
        <div className="node data">
          <h5>5</h5>
          <p className="data_name">Nodes</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewClusterInfo;
