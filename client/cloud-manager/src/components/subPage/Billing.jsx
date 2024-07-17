import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";

import BillingGraph from "../graph/BillGraph";
import BillCircleChart from "../graph/BillCircleChart";
import { toast } from "react-toastify";

import "../style.scss";

const Billing = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [budget, setBudget] = useState(0);
  const [listBill, setListBill] = useState([]);
  const [listCloudProject, setListCloudProject] = useState([]);
  const [loadingProcessData, setLoadingProcessData] = useState(true);

  const [updateBudget, setUpdateBudget] = useState(false);
  const [projectBudgetList, setProjectBudgetList] = useState([]);
  const tempData = [
    {
      totalBill: 0,
      billByCloudProject: {},
    },
  ];
  const [data, setData] = useState(tempData);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [billResponse, projectResponse, cloudProjectResponse] =
        await Promise.all([
          axios.get(`http://localhost:3000/costs/project/${projectId}`),
          axios.get(`http://localhost:3000/project/${projectId}`),
          axios.get(`http://localhost:3000/cloudProject/project/${projectId}`),
        ]);

      if (billResponse.data) {
        setListBill(billResponse.data);
      }

      if (projectResponse.data) {
        setBudget(projectResponse.data.budgetLimit);
        setProject(projectResponse.data);
      }

      if (cloudProjectResponse.data) {
        setListCloudProject(cloudProjectResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmUpdateBudget = () => {
    try {
      const newBudget = document.getElementById("budgetUpdate").value;
      var updateProject = project;
      updateProject.budgetLimit = newBudget;
      const response = axios.put(
        `http://localhost:3000/project/${projectId}`,
        updateProject
      );
      toast.success("Budget updated successfully");
      setBudget(newBudget);
      setUpdateBudget(false);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (listBill.length > 0 && listCloudProject.length > 0) {
      setLoadingProcessData(true);
      const processedData = processBills(listBill, listCloudProject);
      setLoadingProcessData(false);
      setData(processedData);
    }
  }, [listBill, listCloudProject]);

  //const [projectBudgetList, setProjectBudgetList] = useState([]);
  useEffect(() => {
    //console.log("list cloud project:", listCloudProject);
    const updatedProjectBudgetList = listCloudProject.map((project) => {
      const totalBudget = project.budget.reduce((sum, item) => {
        const value = Object.values(item)[0]; // Get the budget value
        return sum + value;
      }, 0);

      return { ...project, totalBudget };
    });
    setProjectBudgetList(updatedProjectBudgetList);
    console.log("projectBudgetList:", projectBudgetList);
  }, [listCloudProject]);

  if (loading)
    return (
      <ClipLoader
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <div className="m-0 flex-wrap row-direction">
      <div className="overviewBudgetContainer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2em"
          height="2em"
          viewBox="0 0 26 26"
        >
          <path
            fill="black"
            d="M12.906-.031a1 1 0 0 0-.125.031A1 1 0 0 0 12 1v1H3a3 3 0 0 0-3 3v13c0 1.656 1.344 3 3 3h9v.375l-5.438 2.719a1.006 1.006 0 0 0 .875 1.812L12 23.625V24a1 1 0 1 0 2 0v-.375l4.563 2.281a1.006 1.006 0 0 0 .875-1.812L14 21.375V21h9c1.656 0 3-1.344 3-3V5a3 3 0 0 0-3-3h-9V1a1 1 0 0 0-1.094-1.031M2 5h22v13H2zm18.875 1a1 1 0 0 0-.594.281L17 9.563L14.719 7.28a1 1 0 0 0-1.594.219l-2.969 5.188l-1.219-3.063a1 1 0 0 0-1.656-.344l-3 3a1.016 1.016 0 1 0 1.439 1.44l1.906-1.906l1.438 3.562a1 1 0 0 0 1.812.125l3.344-5.844l2.062 2.063a1 1 0 0 0 1.438 0l4-4A1 1 0 0 0 20.875 6"
          />
        </svg>
        <p className="totalBillTitle">Total Bill</p>
        <p className="totalBill">${Math.round(data.totalBill * 100) / 100}</p>
        <div className="row-direction mb-4">
          <button
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Update the project budget"
            onClick={() => setUpdateBudget(!updateBudget)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="ml-2"
            >
              <g fill="none">
                <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path
                  fill="black"
                  d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z"
                />
              </g>
            </svg>
          </button>
          <p className="budget">Project Budget: ${budget}</p>
        </div>
        {updateBudget && (
          <div class="py-2 px-3 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
            <div class="w-full flex justify-between items-center gap-x-5">
              <div class="grow">
                <span class="block text-xs text-gray-500 dark:text-neutral-400">
                  Enter the new budget (USD)
                </span>
                <input
                  class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 "
                  type="number"
                  id="budgetUpdate"
                  length="10"
                ></input>
              </div>
              <button class="btn btn-primary" onClick={confirmUpdateBudget}>
                <p className="text-sm ">Update</p>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="billingGraph flex-wrap">
        <BillCircleChart billData={data} cloudProjectList={listCloudProject} />
      </div>
      <div className="billingGraph flex-wrap">
        <BillingGraph billData={data} cloudProjectList={listCloudProject} />
      </div>

      <div className="billCloudProject projectListPage">
        <Table className="mt-4" hover size="sm">
          <thead>
            <tr>
              <th>Cloud Application</th>
              <th>Cost(USD)</th>
              <th>Budget (USD)</th>
            </tr>
          </thead>

          {loadingProcessData == false && (
            <tbody>
              {listCloudProject.map((item, index) => (
                <tr key={index}>
                  <td className="hover:underline">
                    <Link to={`/cloudProject/${item._id}`}>{item.name}</Link>
                  </td>

                  {data.billByCloudProject[item.id] != undefined &&
                    data.billByCloudProject[item.id].totalBill != 0 && (
                      <td>{data.billByCloudProject[item.id].totalBill}</td>
                    )}
                  {data.billByCloudProject[item.id] != undefined &&
                    data.billByCloudProject[item.id].totalBill == 0 && (
                      <td>
                        {" "}
                        <p
                          className="noDataNote"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="It may be because the project has no cost data or several information is missing. Please check the cloud application dashboard for ensuring."
                        >
                          has no cost data
                        </p>
                      </td>
                    )}
                  <td>
                    {projectBudgetList[index] != null &&
                      projectBudgetList[index].totalBudget != 0 &&
                      projectBudgetList[index].totalBudget}
                    {projectBudgetList[index] != null &&
                      projectBudgetList[index].totalBudget == 0 && (
                        <p
                          className="noDataNote"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="It may be because the project has no cost data or several information is missing. Please check the cloud application dashboard for ensuring."
                        ></p>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default Billing;
const processBills = (bills, cloudProjects) => {
  let billByCloudProject = {};

  // Create a mapping of cloudProjectID to project details (projectId and projectName)
  let cloudProjectMap = {};
  cloudProjects.forEach((cloudProject) => {
    var cloudProjectId =
      cloudProject.provider == "aws" ? cloudProject.tag : cloudProject.id;
    billByCloudProject[cloudProjectId] = {
      projectName: cloudProject.name,
      totalBill: 0,
      bills: [],
      tag: cloudProject.tag || null,
    };
  });

  bills.forEach((bill) => {
    var costInUSD = parseFloat(bill.cost);
    const month = new Date(bill.startDate).toISOString().substring(0, 7); // YYYY-MM format
    const projectKey = bill.cloudProjectID;
    const provider = bill.provider;
    const currency = bill.currency;

    if (currency == "USD") {
      costInUSD = costInUSD;
    } else if (currency == "VND") {
      //convert to USD
      costInUSD = costInUSD / 24000;
    }

    let monthBill = billByCloudProject[projectKey].bills.find(
      (b) => b.month === month
    );
    if (monthBill) {
      monthBill.cost += costInUSD;
    } else {
      monthBill = { cost: costInUSD, month: month };
      billByCloudProject[projectKey].bills.push(monthBill);
    }

    billByCloudProject[projectKey].totalBill += costInUSD;
  });

  return {
    totalBill: Object.values(billByCloudProject).reduce(
      (total, project) => total + project.totalBill,
      0
    ),
    billByCloudProject: billByCloudProject,
  };
};
