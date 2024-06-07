import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";

import { ClipLoader } from "react-spinners";

import "../style.scss";

const ListInstances = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/clusters/${projectId}`
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
      <h3 className="text-2xl font-bold ">List Resources</h3>

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
          {rawData.map((instance, index) => (
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
  );
};

export default ListInstances;
