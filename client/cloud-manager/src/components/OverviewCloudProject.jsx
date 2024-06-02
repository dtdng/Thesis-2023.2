import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import "./style.scss";
// import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import BillCateGoryCircleChart from "./graph/BillCategoryCircleChar";
var templateData = {
  id: "123",
  name: "test",
  provider: "test",
};

const OverviewCloudProject = ({ cloudProject, listInstances, billing }) => {
  const [data, setData] = useState(templateData);

  useEffect(() => {
    setData(cloudProject);
  }, [cloudProject]);

  return (
    <div className="instanceOverview">
      <div className="instanceInformation max-h-90 mb-4">
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
          Cloud Project Info
        </div>
        <div className="instanceInformationContent">
          <div className="info">
            <div className="infoTitle">ID</div>
            <div className="infoContent ">{data.id}</div>
          </div>
          <div className="info">
            <div className="infoTitle">Name</div>
            <div className="infoContent">{data.name}</div>
          </div>
          <div className="info">
            <div className="infoTitle">Provider</div>
            <div className="infoContent">{data.provider}</div>
          </div>
          {data.provider == "google" && (
            <div>
              <div className="info">
                <div className="infoTitle">Billing Table ID</div>
                <div className="infoContent">{data.billingTableId}</div>
              </div>
              {/* <div className="info">
                <div className="infoTitle">Billing Table ID</div>
                <div className="infoContent">{data.billingTableId}</div>
              </div> */}
            </div>
          )}
        </div>
      </div>
      <div className="billingInformation ml-10 max-h-90  mb-4 max-w-100">
        <BillCateGoryCircleChart billingData={billing} />
      </div>
      <div className="projectListPage m-8 overflow-auto rounded-lg shadow">
        <h3 className="text-2xl font-bold ">List Instances</h3>
        <table className="mt-4 w-full" hover size="sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Name
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Provider
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Region
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Type
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {listInstances.map((instance) => (
              <tr key={instance._id} className="hover:bg-slate-100">
                <td className="pl-3 text-blue-500 hover:underline whitespace-nowrap">
                  <Link to={`/instance/${instance._id}`}>{instance.name}</Link>
                </td>
                <td className="pl-3 text-gray-700 whitespace-nowrap">
                  {instance.provider}
                </td>
                <td className="pl-3 text-gray-700 whitespace-nowrap">
                  {instance.region}
                </td>
                <td className="pl-3 text-gray-700 whitespace-nowrap">
                  {instance.type}
                </td>
                <td className="pl-3 whitespace-nowrap">
                  {instance.status.toLowerCase() == "running" && (
                    <p className="running status">{instance.status}</p>
                  )}
                  {instance.status.toLowerCase() == "terminated" && (
                    <p className="stopped status">{instance.status}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverviewCloudProject;
