import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import RatingForm from "../form/RatingForm";

const Reviews = ({ project }) => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/cluster/resource/type"
      );

      setInstances(response.data);
      console.log("response.data", response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const [buttonPopup, setButtonPopup] = useState(false);
  const openReviewForm = (instance) => {
    setSelectedInstance(instance);
    setButtonPopup(true);
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
    <div>
      <RatingForm
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
        selectedInstance={selectedInstance}
      />
      <div className="projectListPage w-max rounded-sm ">
        <h3 className="text-2xl font-bold ">Type of Instances</h3>
        <table className="mt-4 w-full " striped hover size="sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Product
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Provider
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Region
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Plan
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Count
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Review
              </th>
            </tr>
          </thead>
          <tbody>
            {loading == false &&
              instances.map((instance, index) => (
                <tr key={instance._id} className="hover:bg-slate-100">
                  <td className="pl-3 text-gray-700 whitespace-nowrap">
                    {instance.type}
                  </td>
                  <td className="pl-3 text-gray-700 whitespace-nowrap">
                    {instance.provider}
                  </td>
                  <td className="pl-3 text-gray-700 whitespace-nowrap">
                    {instance.region}
                  </td>
                  <td className="pl-3 text-gray-700 whitespace-nowrap">
                    {instance.plan}
                  </td>
                  <td className="pl-3 whitespace-nowrap row-direction">
                    {instance.count}
                  </td>
                  <td className="pl-3 text-gray-700 whitespace-nowrap">
                    <button
                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-2 mb-2"
                      onClick={() => {
                        openReviewForm(instance);
                      }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* <div className="projectListPage w-max rounded-sm mt-8 mb-8">
        <h3 className="text-2xl font-bold ">Rating List</h3>
        <div>Search Bar</div>
        <table className="mt-4 w-full" hover striped size="sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Product
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Provider
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Region
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Plan
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Overall Rating
              </th>
            </tr>
          </thead>
        </table>
      </div> */}
    </div>
  );
};

export default Reviews;
