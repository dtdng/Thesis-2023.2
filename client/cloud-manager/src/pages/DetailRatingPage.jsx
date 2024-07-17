import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import "./style.scss";
import TopPage from "../components/TopPage";

const processRatings = (data) => {
  let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalCount = 0;
  let totalRating = 0.0;

  data.forEach((item) => {
    const rating = parseFloat(item.overall_rating);
    const roundedRating = Math.round(rating);
    ratingCounts[roundedRating]++;
    totalCount++;
    totalRating += rating;
  });

  let ratingPercentages = {};
  for (let i = 1; i <= 5; i++) {
    ratingPercentages[`Rating_${i}`] = totalCount
      ? (ratingCounts[i] / totalCount) * 100
      : 0;
  }

  const overallRating = totalCount ? totalRating / totalCount : 0;

  return {
    overallRating: overallRating.toFixed(2),
    totalCount,
    ...ratingPercentages,
  };
};

const processCustomerExperience = (data) => {
  let criteriaTotals = {};
  let criteriaCounts = {};

  data.forEach((item) => {
    for (const [criteria, rating] of Object.entries(item.criteria_ratings)) {
      if (!criteriaTotals[criteria]) {
        criteriaTotals[criteria] = 0;
        criteriaCounts[criteria] = 0;
      }
      criteriaTotals[criteria] += parseFloat(rating);
      criteriaCounts[criteria]++;
    }
  });

  let experienceRatings = {};
  for (const [criteria, total] of Object.entries(criteriaTotals)) {
    experienceRatings[criteria] = (total / criteriaCounts[criteria]).toFixed(1);
  }

  return experienceRatings;
};

const DataComponent = ({ data }) => {
  const ratingsData = processRatings(data);
  const customerExperienceData = processCustomerExperience(data);

  return (
    <div className="flex flex-row">
      <div className="pr-5">
        <h2 className="text-2xl font-semibold">
          Overall Rating: {ratingsData.overallRating}/5 (
          {ratingsData.totalCount} Ratings)
        </h2>
        <h3 className="text-xl font-semibold">Rating Distribution</h3>
        <p className="text-lg">5 star: {ratingsData.Rating_5.toFixed(2)}%</p>
        <p className="text-lg">4 star: {ratingsData.Rating_4.toFixed(2)}%</p>
        <p className="text-lg">3 star: {ratingsData.Rating_3.toFixed(2)}%</p>
        <p className="text-lg">2 star: {ratingsData.Rating_2.toFixed(2)}%</p>
        <p className="text-lg">1 star: {ratingsData.Rating_1.toFixed(2)}%</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Customer Experience Overall</h3>
        {Object.entries(customerExperienceData).map(([criteria, rating]) => (
          <p className="text-lg" key={criteria}>
            {criteria}: {rating}
          </p>
        ))}
      </div>
    </div>
  );
};

const DetailRatingPage = () => {
  const { region, provider, product } = useParams();
  const [rating, setRating] = useState([]);
  const [loading, setLoading] = useState(false);
  const ratingsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const indexOfLastRating = currentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = rating.slice(indexOfFirstRating, indexOfLastRating);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(rating.length / ratingsPerPage);

  useEffect(() => {
    const fetchRating = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/rating/${region}/${provider}/${product}`
        );
        setRating(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rating:", error);
        setLoading(false);
      }
    };
    fetchRating();
  }, [region, provider, product]);

  useEffect(() => {
    if (rating.length > 0) {
      console.log(rating);
      setLoading(false);
      rating.sort((a, b) => b.overall_rating - a.overall_rating);
    }
  }, [rating]);

  if (loading) {
    return (
      <ClipLoader
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }

  return (
    <div className="homePage">
      <TopPage />
      <div className="midPage">
        <div className="midPageContent">
          <div className="flex flex-col bg-white p-3 mb-5 border-solid border-1 rounded-md border-gray-700 max-w-max">
            <div className="flex flex-row mb-3">
              <div className="border-slate-950 border-solid border-opacity-0 w-24 h-24 p-3">
                {provider === "google" && (
                  <img
                    src="https://www.gartner.com/imagesrv/peer-insights/vendors/logos/google.png"
                    alt=""
                  />
                )}
                {provider === "aws" && (
                  <img
                    src="https://www.gartner.com/pi/vendorimages/amazon-web-services_1660165755780.png"
                    alt=""
                  />
                )}
                {provider === "alibaba" && (
                  <img
                    src="https://www.gartner.com/imagesrv/peer-insights/vendors/logos/alibaba-cloud.png"
                    alt=""
                  />
                )}
                {provider === "microsoft" && (
                  <img
                    src="https://www.gartner.com/pi/vendorimages/microsoft_1711392102827.jpg"
                    alt=""
                  />
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-3xl">{product}</p>
                <p className="font-bold text-2xl">by {provider}</p>
                <p className="font-bold text-md">Region: {region}</p>
              </div>
            </div>
            {rating.length > 0 && <DataComponent data={rating} />}
          </div>
          <div className="overflow-auto rounded-lg shadow bg-white p-10 mb-3">
            <h2 className="text-2xl font-bold">Detailed Rating List</h2>
            <table className="mt-4 w-full" hover size="lg">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
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
                </tr>
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
                    <td className="p-3 py-2 max-w-40">
                      {rating.overall_rating}
                    </td>
                    <td className="p-3 py-2">{rating.region}</td>
                    <td className="p-3 py-2">{rating.country}</td>
                    <td className="p-3 py-2">
                      {Object.entries(rating.criteria_ratings).map(
                        ([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {value}
                          </div>
                        )
                      )}
                    </td>
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
                {currentRatings.length === 0 && (
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

export default DetailRatingPage;
