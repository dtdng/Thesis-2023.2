import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import closeIcon from "../../assets/black-cancel.svg";
import { toast } from "react-toastify";
import axios from "axios";
import "../style.scss";

const RatingForm = ({ trigger, setTrigger, selectedInstance }) => {
  // State variables for sub-criteria ratings
  const [agility, setAgility] = useState({
    awareness: 5,
    flexibility: 5,
    adaptability: 5,
  });
  const [risk, setRisk] = useState({ provider: 5, compliance: 5, hr: 5 });
  const [security, setSecurity] = useState({
    data: 5,
    accessControl: 5,
    physical: 5,
  });
  const [cost, setCost] = useState({ acquisition: 5, ongoing: 5 });
  const [quality, setQuality] = useState({
    functionality: 5,
    reliability: 5,
    efficiency: 5,
  });
  const [capability, setCapability] = useState({
    usability: 5,
    effectiveness: 5,
    learnability: 5,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const overall_rating = (
      (Object.values(agility).reduce((a, b) => a + b, 0) +
        Object.values(risk).reduce((a, b) => a + b, 0) +
        Object.values(security).reduce((a, b) => a + b, 0) +
        Object.values(cost).reduce((a, b) => a + b, 0) +
        Object.values(quality).reduce((a, b) => a + b, 0) +
        Object.values(capability).reduce((a, b) => a + b, 0)) /
      (Object.keys(agility).length +
        Object.keys(risk).length +
        Object.keys(security).length +
        Object.keys(cost).length +
        Object.keys(quality).length +
        Object.keys(capability).length)
    ).toFixed(1);

    const likelihood_to_recommend = ((overall_rating / 5) * 10).toFixed(2);

    const ratingData = {
      cloud_provider: selectedInstance.provider,
      product: getProductTag(selectedInstance),
      overall_rating,
      likelihood_to_recommend,
      region: selectedInstance.region,
      country: "",
      page_url: "",
      criteria_ratings: {
        agility,
        risk,
        security,
        cost,
        quality,
        capability,
      },
    };
    // console.log("ratingData:", ratingData);
    try {
      const response = await axios.post(
        "http://localhost:3000/rating",
        ratingData
      );
      console.log("response:", response);
      toast.success("Rating submitted successfully!");
      setTrigger(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSubCriteria = (title, criteria, setCriteria) => {
    return (
      <div className="mb-2 mr-4">
        <p className="font-bold">{title}</p>
        {Object.keys(criteria).map((key) => (
          <div
            className="form-group row-direction w-64 justify-between"
            key={key}
          >
            <label htmlFor={key} className="pr-5 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <RatingStar
              rating={criteria[key]}
              setRating={(value) => setCriteria({ ...criteria, [key]: value })}
            />
          </div>
        ))}
      </div>
    );
  };

  return trigger ? (
    <div className="overlayer">
      <form onSubmit={handleSubmit} className="form min-w-60 justify-start">
        <div className="row-direction justify-start mb-1">
          <p className="m-0 font-bold text-xl mr-5">Rate Cloud Service</p>
        </div>
        <div className="flex flex-wrap">
          <p className="text-sm mb-2 mr-4">
            Region: {selectedInstance.region}{" "}
          </p>
          <p className="text-sm mb-2 mr-4">
            Provider: {selectedInstance.provider}{" "}
          </p>
          <p className="text-sm mb-2 mr-4">Product: {selectedInstance.type} </p>
        </div>
        <div className="m-0 w-full">
          <div className="row-direction min-w-80">
            {renderSubCriteria("Agility", agility, setAgility)}
            {renderSubCriteria("Risk", risk, setRisk)}
          </div>
          <div className="row-direction min-w-80">
            {renderSubCriteria("Security", security, setSecurity)}
            {renderSubCriteria("Cost", cost, setCost)}
          </div>
          <div className="row-direction min-w-80">
            {renderSubCriteria("Quality", quality, setQuality)}
            {renderSubCriteria("Capability", capability, setCapability)}
          </div>
        </div>
        <div className="row-direction">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setTrigger(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </form>
    </div>
  ) : (
    ""
  );
};

const RatingStar = ({ rating, setRating }) => {
  return (
    <div className="rating">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <FaStar
              className="star"
              color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
              size={20}
            />
          </label>
        );
      })}
    </div>
  );
};

const getProductTag = ({ type }) => {
  if (type == "t2.micro")
    return ["EC2", "t2.micro", "Cloud Platform", "Machine Learning"];
  else if (type == "t2.small")
    return ["EC2", "t2.small", "Cloud Platform", "Machine Learning"];
  else if (type == "compute#instance")
    return ["Compute Engine", "Cloud Platform", "Machine Learning", "GCP"];
  else if (type == "k8s_cluster")
    return ["Kubernetes Engine", "Cloud Platform", "Machine Learning", "GCP"];
  else if (type == "EKC")
    return [
      "Elastic Kubernetes Service",
      "Cloud Platform",
      "Machine Learning",
      "AWS",
    ];
  else if (type == "EKS")
    return [
      "Elastic Kubernetes Service",
      "Cloud Platform",
      "Machine Learning",
      "AWS",
    ];
};

export default RatingForm;
