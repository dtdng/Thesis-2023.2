import React, { useEffect, useState } from "react";
import "../style.scss";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";

const category = [
  "Compute",
  "Monitoring",
  "Storage",
  "Networking",
  "Analytics",
  "Containers",
];

const templateData = [
  { Compute: 0 },
  { Monitoring: 0 },
  { Storage: 0 },
  { Networking: 0 },
  { Analytics: 0 },
  { Containers: 0 },
];

const ApplicationBudget = (props) => {
  //console.log(props.cloudProject);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [budgetData, setBudgetData] = useState(templateData);
  const [editableIndex, setEditableIndex] = useState(-1);

  useEffect(() => {
    console.log("budget:", props.cloudProject.budget);
    if (props.cloudProject.budget != undefined) {
      if (props.cloudProject.budget.length > 0) {
        // Update budget data with the values from props
        setBudgetData(props.cloudProject.budget);
      }
    } else {
      setBudgetData(templateData);
    }
  }, [props.cloudProject]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = { ...props.cloudProject, budget: budgetData };
    console.log(updateData);
    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:3000/cloudProject/${updateData._id}`,
        updateData
      );
      setLoading(false);
      toast.success("Update success");
    } catch (error) {
      console.error("Error updating budget:", error);
      setLoading(false);
      toast.error("Error updating budget.");
    }
  };

  return (
    <div className="application-budget flex col-direction items-start">
      <div className="row-direction">
        <h2 className="text-xl font-bold">Application Budgets (USD)</h2>
        <button onClick={handleUpdate} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="black"
              d="M20 7.423v10.962q0 .69-.462 1.153T18.384 20H5.616q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h10.961zm-8.004 9.115q.831 0 1.417-.582T14 14.543t-.582-1.418t-1.413-.586t-1.419.581T10 14.535t.582 1.418t1.414.587M6.769 9.77h7.423v-3H6.77z"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col items-start">
        {budgetData.map((item, index) => (
          <div className="flex flex-col" key={index}>
            <div className="text-sm row-direction">
              {category[index]}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="ml-2"
                onClick={() => setEditableIndex(index)}
              >
                <g fill="none">
                  <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="black"
                    d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z"
                  />
                </g>
              </svg>
            </div>
            <input
              disabled={editableIndex !== index}
              className="text-base bg-transparent"
              type="number"
              value={item[category[index]]}
              onChange={(e) => {
                let newData = [...budgetData];
                newData[index][category[index]] = parseFloat(e.target.value);
                setBudgetData(newData);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationBudget;
