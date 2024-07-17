import React, { useEffect, useState } from "react";
//import "../style.scss";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
import TopPage from "../components/TopPage";
import { Link } from "react-router-dom";

const OverviewRatingPage = () => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [overviewRatings, setOverviewRatings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [filters, setFilters] = useState({
    region: "all",
    provider: "all",
    product: "all",
  });

  const fetchOverviewRatings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/rating/overview");
      setOverviewRatings(response.data);
      setFilteredRatings(response.data); // Initialize filtered ratings with all ratings
      console.log(overviewRatings);
      setLoading2(true);
    } catch (error) {
      console.error("Error fetching overview ratings:", error);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await axios.get("http://localhost:3000/rating");
      setRatings(response.data); // Initialize filtered ratings with all ratings
      setLoading1(true);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    fetchOverviewRatings();
    fetchRating();
  }, []);

  useEffect(() => {
    console.log(overviewRatings);
  }, [overviewRatings]);

  const filterRatings = () => {
    const { region, provider, product } = filters;
    let updatedRatings = [...overviewRatings];

    if (region !== "all") {
      updatedRatings = updatedRatings.filter(
        (rating) => rating._id.region === region
      );
    }

    if (provider !== "all") {
      updatedRatings = updatedRatings.filter(
        (rating) => rating._id.cloud_provider === provider
      );
    }

    if (product !== "all") {
      updatedRatings = updatedRatings.filter((rating) =>
        rating._id.product.includes(product)
      );
    }

    setFilteredRatings(updatedRatings);
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [id]: value }));
    console.log(filters);
  };

  useEffect(() => {
    filterRatings();
  }, [filters, ratings]);

  if (loading1 == false || loading2 == false) {
    return <ClipLoader color="black" size={50} />;
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
          <div className="overflow-auto rounded-lg shadow bg-white p-10 mb-3">
            <h2 className="text-2xl font-bold">Overview Rating Result</h2>
            <div className="flex flex-col flex-wrap">
              <DataComponent data={filteredRatings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewRatingPage;

const processRatings = (ratings) => {
  let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalCount = 0;
  let totalRating = 0.0;

  ratings.forEach((ratingData) => {
    const rating = parseInt(ratingData.rating);
    const count = ratingData.count;
    ratingCounts[rating] += count;
    totalCount += count;
    totalRating += rating * count;
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

const processData = (data) => {
  return data.map((item) => {
    const { product, region, cloud_provider } = item._id;
    const {
      overallRating,
      totalCount,
      Rating_1,
      Rating_2,
      Rating_3,
      Rating_4,
      Rating_5,
    } = processRatings(item.ratings);

    return {
      overallRating,
      totalCount,
      Rating_1: Rating_1.toFixed(2),
      Rating_2: Rating_2.toFixed(2),
      Rating_3: Rating_3.toFixed(2),
      Rating_4: Rating_4.toFixed(2),
      Rating_5: Rating_5.toFixed(2),
      product,
      region,
      cloud_provider,
    };
  });
};

const DataComponent = ({ data }) => {
  const processedData = processData(data);
  processedData.sort((a, b) => {
    if (b.overallRating === a.overallRating) {
      return b.totalCount - a.totalCount;
    }
    return b.overallRating - a.overallRating;
  });
  return (
    <div>
      {processedData.map((item, index) => (
        <div className="flex flex-row pb-3 pt-2 border-b-2" key={index}>
          <div>
            <p className="font-semibold">
              Overall Rating: {item.overallRating}/5
            </p>
            <p>{item.totalCount} ratings</p>
            <p className="text-sm">5 stars: {item.Rating_5}%</p>
            <p className="text-sm">4 stars: {item.Rating_4}%</p>
            <p className="text-sm">3 stars: {item.Rating_3}%</p>
            <p className="text-sm">2 stars: {item.Rating_2}%</p>
            <p className="text-sm">1 star: {item.Rating_1}%</p>
          </div>

          <div className="pl-5">
            <div className="flex flex-row">
              <div className=" border-slate-950 border-solid border-opacity-0 w-24 h-24 p-3">
                {item.cloud_provider === "google" && (
                  <img
                    src="https://www.gartner.com/imagesrv/peer-insights/vendors/logos/google.png"
                    alt=""
                  />
                )}
                {item.cloud_provider === "aws" && (
                  <img
                    src="https://www.gartner.com/pi/vendorimages/amazon-web-services_1660165755780.png"
                    alt=""
                  />
                )}
                {item.cloud_provider === "alibaba" && (
                  <img
                    src="https://www.gartner.com/imagesrv/peer-insights/vendors/logos/alibaba-cloud.png"
                    alt=""
                  />
                )}
                {item.cloud_provider === "microsoft" && (
                  <img
                    src="https://www.gartner.com/pi/vendorimages/microsoft_1711392102827.jpg"
                    alt=""
                  />
                )}
              </div>
              <div>
                <p className="text-xl font-bold">
                  {Array.isArray(item.product) ? item.product[0] : item.product}
                </p>
                <p>by {item.cloud_provider}</p>
                <p>Region: {item.region}</p>
              </div>
            </div>
            {Array.isArray(item.product) ? (
              <Link
                to={`/detailReview/${item.cloud_provider}/${item.region}/${item.product[0]}`}
                className="hover:underline hover:text-blue-700 hover:cursor-pointer"
              >
                More Detail
              </Link>
            ) : (
              <Link
                to={`/detailReview/${item.cloud_provider}/${item.region}/${item.product}`}
                className="hover:underline hover:text-blue-700 hover:cursor-pointer"
              >
                More Detail
              </Link>
            )}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};
