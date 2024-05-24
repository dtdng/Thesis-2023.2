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
    <div className="projectListPage">
      <h3>List Instances</h3>

      <Table className="mt-4" hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Region</th>
            <th>Status</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {rawData.map((instance) => (
            <tr key={instance._id}>
              <td>
                <Link to={`/instance/${instance._id}`}>{instance.name}</Link>
              </td>
              <td>{instance.provider}</td>
              <td>{instance.region}</td>
              <td>{instance.status}</td>
              <td>{instance.type}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListInstances;
