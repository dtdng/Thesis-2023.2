import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";

import BillingGraph from "../graph/BillGraph";
import BillCircleChart from "../graph/BillCircleChart";

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
        // console.log("List Cloud Project", cloudProjectResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
      // console.log("Processed Data", processedData);
    }
  }, [listBill, listCloudProject]);

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
    <div>
      <h1>Billing</h1>
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
        <p className="budget">Project Budget: ${budget}</p>
      </div>

      <div className="billingGraph flex-wrap">
        <BillCircleChart billData={data} cloudProjectList={listCloudProject} />
        <BillingGraph billData={data} cloudProjectList={listCloudProject} />
      </div>
      <div className="billCloudProject projectListPage">
        <Table className="mt-4" hover size="sm">
          <thead>
            <tr>
              <th>Cloud Project</th>
              <th>Cost(USD)</th>
              <th>% Change</th>
            </tr>
          </thead>

          {loadingProcessData == false && (
            <tbody>
              {listCloudProject.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>

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
                          title="It may be because the project has no cost data or several information is missing. Please check the cloud project dashboard for ensuring."
                        >
                          has no cost data
                        </p>
                      </td>
                    )}
                  <td>0</td>
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
