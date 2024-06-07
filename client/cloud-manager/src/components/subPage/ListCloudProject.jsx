import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";
import { ClipLoader } from "react-spinners";

import "../style.scss";

const ListCloudProject = ({ projects }) => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/cloudProject/project/${projectId}`
      );
      setRawData(response.data);
      console.log("response.data", response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="projectListPage overflow-auto rounded-lg shadow">
      <h3 className="text-2xl font-bold ">List Cloud Applications</h3>
      <table className="mt-4 w-full" hover size="sm">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
              Name
            </th>
            <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
              ID
            </th>
            <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
              Provider
            </th>
          </tr>
        </thead>
        <tbody>
          {rawData.map((instance) => (
            <tr key={instance._id} className="hover:bg-slate-100">
              <td className="pl-3 text-blue-500 hover:underline whitespace-nowrap">
                <Link to={`/cloudProject/${instance._id}`}>
                  {instance.name}
                </Link>
              </td>
              <td className="pl-3 text-gray-700 ">{instance.id}</td>
              <td className="pl-3 text-gray-700 whitespace-nowrap">
                {instance.provider}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCloudProject;
