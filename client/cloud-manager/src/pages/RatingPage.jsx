import React, { useEffect, useState } from "react";
import TopPage from "../components/TopPage";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const RatingPage = () => {
  const [loading, setLoading] = useState(true);
  const [overviewRatings, setOverviewRatings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [filteredOverviewRatings, setFilterOverviewRatings] = useState([]); // [1
  const [filters, setFilters] = useState({
    region: "all",
    provider: "all",
    product: "all",
  });
  const ratingsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOverviewRatings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/rating/overview");
      setOverviewRatings(response.data);
      console.log(overviewRatings);
    } catch (error) {
      console.error("Error fetching overview ratings:", error);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await axios.get("http://localhost:3000/rating");
      setRatings(response.data);
      setFilteredRatings(response.data); // Initialize filtered ratings with all ratings
      console.log(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    fetchOverviewRatings();
    fetchRating();
  }, []);

  useEffect(() => {
    if (ratings.length > 0 && overviewRatings.length > 0) {
      setLoading(false);
      ratings.sort((a, b) => b.overall_rating - a.overall_rating);
      overviewRatings.sort((a, b) => b.average_rating - a.average_rating);
    }
  }, [ratings, overviewRatings]);

  useEffect(() => {
    setFilteredRatings(
      ratings.filter((rating) => {
        return (
          (filters.region === "all" || rating.region === filters.region) &&
          (filters.provider === "all" ||
            rating.cloud_provider === filters.provider) &&
          (filters.product === "all" ||
            rating.product.includes(filters.product))
        );
      })
    );
    setFilterOverviewRatings(
      overviewRatings.filter((rating) => {
        return (
          (filters.region === "all" || rating._id.region === filters.region) &&
          (filters.provider === "all" ||
            rating._id.cloud_provider === filters.provider) &&
          (filters.product === "all" ||
            rating._id.product.includes(filters.product))
        );
      })
    );
    setCurrentPage(1); // Reset to the first page whenever filters change
  }, [filters, ratings]);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [id]: value }));
    console.log(filters);
  };

  // Pagination logic
  const indexOfLastRating = currentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = filteredRatings.slice(
    indexOfFirstRating,
    indexOfLastRating
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredRatings.length / ratingsPerPage);

  if (loading) {
    return <ClipLoader color="black" loading={loading} size={50} />;
  }

  return (
    <div className="homePage">
      <TopPage />
      <div className="midPage grid-cols-2 gap-2 min-h-full">
        <div className="max-h-full bg-white p-4 SideBar justify-start">
          <h2 className="text-2xl font-bold">Filter</h2>
          <div className="m-0">
            <label htmlFor="region" className="form-label">
              Region
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              id="region"
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="american">American</option>
              <option value="european">European</option>
              <option value="asian">Asian</option>
              <option value="african">African</option>
              <option value="australian">Australian</option>
            </select>
          </div>
          <div className="m-0">
            <label htmlFor="provider" className="form-label">
              Provider
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              id="provider"
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="google">Google</option>
              <option value="aws">AWS</option>
              <option value="alibaba">Alibaba</option>
              <option value="microsoft">Microsoft</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="m-0">
            <label htmlFor="product" className="form-label">
              Product
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              id="product"
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="Drive">Drive</option>
              <option value="Database">Database</option>
              <option value="Cloud Platform">Cloud Platform</option>
              <option value="Kubernetes Engine">Kubernetes Engine</option>
              <option value="Security">Security</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
          </div>
        </div>
        <div className="max-h-full p-4">
          {filters.region !== "all" ||
          filters.provider !== "all" ||
          filters.product !== "all" ? (
            <div className=" overflow-auto rounded-lg shadow bg-white p-10 mb-3">
              <h2 className="text-2xl font-bold">Overview Rating Result</h2>
              <div className="row-direction flex-wrap">
                {filteredOverviewRatings.map((rating, index) => (
                  <div
                    key={index}
                    className="m-4 col-direction justify-center w-40 h-40 align-middle rounded-lg border-2 border-gray-200 p-3 hover:shadow-lg"
                  >
                    {/* <div className="m=0 text-base text-gray-600">Rating</div> */}
                    <div className="row-direction justify-between">
                      <div className="m-0 text-base">
                        {rating._id.cloud_provider}
                      </div>
                      <div className="invisible">111 </div>
                      <div className="m-0 ">{rating._id.region}</div>
                    </div>
                    <div className="m-0 text-4xl">
                      {Math.round(rating.average_rating * 10) / 10}/5
                    </div>
                    <td className="m-0 text-xl text-center">
                      {Array.isArray(rating._id.product)
                        ? rating._id.product[0]
                        : rating._id.product}
                    </td>
                  </div>
                ))}
                {filteredOverviewRatings.length === 0 && (
                  <p className="p-3 py-2 text-center text-gray-500 italic">
                    No ratings found
                  </p>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="overflow-auto rounded-lg shadow bg-white p-10 mb-3">
            <h2 className="text-2xl font-bold">Detailed Rating List</h2>
            <table className="mt-4 w-full" hover size="lg">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Product
                </th>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Provider
                </th>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Overall Rating
                </th>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Region
                </th>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Country
                </th>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Detailed Rating
                </th>
                <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                  Review Link
                </th>
              </thead>
              <tbody>
                {currentRatings.map((rating, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 py-2 max-w-60">
                      {Array.isArray(rating.product)
                        ? rating.product.join(", ")
                        : rating.product}
                    </td>
                    <td className="p-3 py-2">{rating.cloud_provider}</td>
                    <td className="p-3 py-2  max-w-40">
                      {rating.overall_rating}
                    </td>
                    <td className="p-3 py-2">{rating.region}</td>
                    <td className="p-3 py-2">{rating.country}</td>
                    {rating.page_url !== "" ? (
                      <td className="p-3 py-2">
                        {Object.entries(rating.criteria_ratings).map(
                          ([key, value]) => (
                            <div key={key}>
                              <strong>{key}:</strong> {value}
                            </div>
                          )
                        )}
                      </td>
                    ) : (
                      <td className="p-3 py-2">
                        {Object.entries(rating.criteria_ratings).map(
                          ([key, value]) => (
                            <div key={key}>
                              <ul>
                                {Object.entries(value).map(
                                  ([subKey, subValue]) => (
                                    <li key={subKey}>
                                      <strong>
                                        {key}.{subKey}: {subValue}
                                      </strong>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )
                        )}
                      </td>
                    )}

                    <td className="p-3 py-2">
                      <a
                        href={rating.page_url || rating.review_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline cursor-pointer"
                      >
                        Review
                      </a>
                    </td>
                  </tr>
                ))}
                {currentRatings.length === 0 && ( // Show message when no ratings are found
                  <tr>
                    <td
                      colSpan={7}
                      className="p-3 py-2 text-center text-gray-500 italic"
                    >
                      No ratings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination m-4 flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 mx-1 my-2 border rounded ${
                    index + 1 === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingPage;
