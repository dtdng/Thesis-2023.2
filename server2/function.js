const axios = require("axios");

const googleInstance = require("./query/GoogleInstance.js");
const awsInstance = require("./aws/instanceAWS.js");
const awsBill = require("./aws/billingAWS.js");
const googleBill = require("./bigQuery/queryBill.js");
// const testing = require("./testing/testInstanceGoogle.js");
const email = require("./email.js");

const arrayMonth = ["202404", "202405", "202406"];

async function updateNewBill() {
  axios.delete("http://localhost:3000/costs");
  arrayMonth.forEach((month) => {
    collectBill(month);
  });
}

async function collectMetric() {
  console.log(
    "==================================================================="
  );
  console.log("Start collecting metric...");
  console.log("Start collecting list project...");
  const listProjectID = await googleInstance.getListProject();
  var listInstance = [];
  for (const project_id of listProjectID) {
    console.log("Start collecting list instance in" + project_id + "...");
    const instances = await googleInstance.getListInstanceInMultiCloudProject(
      project_id
    );
    listInstance = listInstance.concat(instances);
  }
  // console.log(listInstance);
  for (const instance of listInstance) {
    if (instance.provider == "google") {
      if (instance.type == "compute#instance") {
        console.log("Start collecting metric for " + instance.name + "...");
        const cpuMetric = await googleInstance.getInstanceCPUMetricList(
          instance.cloudProjectID,
          instance.id
        );

        const memoryMetric = await googleInstance.getInstanceMemoryMetricList(
          instance.cloudProjectID,
          instance.id
        );
        if (memoryMetric != null) {
          if (memoryMetric.value == 0) {
          } else {
            memoryMetric.id = instance._id;
            //push to database + update status to running
            axios.post("http://localhost:3000/metric", memoryMetric);
          }
        }
        if (cpuMetric != null) {
          if (cpuMetric.value == 0) {
            //update status to terminated in database
            if (instance.status != "TERMINATED") {
              instance.status = "TERMINATED";
              axios.put(
                "http://localhost:3000/cluster/" + instance._id,
                instance
              );
            }
          } else {
            cpuMetric.id = instance._id;
            //push to database + update status to running
            axios.post("http://localhost:3000/metric", cpuMetric);
            if (instance.status != "RUNNING") {
              instance.status = "RUNNING";
              axios.put(
                "http://localhost:3000/cluster/" + instance._id,
                instance
              );
            }
          }
        }
      } else if (instance.type == "k8s_cluster") {
      }
    } else if (instance.provider == "aws") {
      if (instance.type == "t2.micro") {
        console.log("Start collecting metric for " + instance.id + "...");
        const cpuMetric = await awsInstance.getCPUUsageInstanceAWS(instance.id);
        const networkInMetric = await awsInstance.getNetworkInInstanceAWS(
          instance.id
        );
        const networkOutMetric = await awsInstance.getNetworkOutInstanceAWS(
          instance.id
        );

        if (cpuMetric != null) {
          if (cpuMetric.value == 0) {
            //update status to terminated in database
            if (instance.status != "TERMINATED") {
              instance.status = "TERMINATED";
              axios.put(
                "http://localhost:3000/cluster/" + instance._id,
                instance
              );
            }
          } else {
            cpuMetric.id = instance._id;
            //push to database + update status to running
            axios.post("http://localhost:3000/metric", cpuMetric);
            if (instance.status != "RUNNING") {
              instance.status = "RUNNING";
              axios.put(
                "http://localhost:3000/cluster/" + instance._id,
                instance
              );
            }
          }
        }
        if (networkInMetric != null) {
          if (networkInMetric.value == 0) {
          } else {
            networkInMetric.id = instance._id;
            axios.post("http://localhost:3000/metric", networkInMetric);
          }
        }
        if (networkOutMetric != null) {
          if (networkOutMetric.value == 0) {
          } else {
            networkOutMetric.id = instance._id;
            axios.post("http://localhost:3000/metric", networkOutMetric);
          }
        }
      } else {
      }
    } else {
    }
  }
  console.log("Finish collecting metric...");
}

async function collectBill(month) {
  console.log("Start collecting bill...");

  const listProjectID = await googleInstance.getListProject();
  console.log(listProjectID);
  let listCloudProject = [];

  for (const project_id of listProjectID) {
    try {
      const res = await axios.get(
        `http://localhost:3000/cloudProject/project/${project_id}`
      );
      listCloudProject = listCloudProject.concat(res.data); // Combine all cloud Applications
    } catch (error) {
      console.error(
        `Error fetching cloud applications for project ID ${project_id}:`,
        error
      );
    }
  }

  // console.log(listCloudProject);

  for (const cloudProject of listCloudProject) {
    if (cloudProject.provider === "google") {
      try {
        const bills = await googleBill.getBillingDataProjectGoogle(
          month,
          cloudProject.billingTableId,
          cloudProject.id,
          cloudProject.projectId
        );
        // console.log(bills);
        bills.forEach(async (bill) => {
          try {
            await axios.post("http://localhost:3000/cost", bill);
          } catch (error) {
            console.error(
              // `Error saving Google Cloud billing data for tag ${cloudProject.tag}:`,
              error
            );
          }
        });
      } catch (error) {
        console.error(
          `Error fetching Google Cloud billing data for tag ${cloudProject.tag}:`,
          error
        );
      }
      // Add logic for Google Cloud billing here
    } else if (cloudProject.provider === "aws") {
      const { startDate, endDate } = awsBill.getStartAndEndDate(month);

      try {
        const bills = await awsBill.getBillingDataApplicationAWS(
          startDate,
          endDate,
          cloudProject.tag,
          cloudProject.projectId
        );
        // console.log(bills);
        bills.forEach(async (bill) => {
          try {
            await axios.post("http://localhost:3000/cost", bill);
          } catch (error) {
            console.error(
              `Error saving AWS billing data for tag ${cloudProject.tag}:`,
              error
            );
          }
        });
      } catch (error) {
        console.error(
          `Error fetching AWS billing data for tag ${cloudProject.tag}:`,
          error
        );
      }
    } else {
      // Handle other providers if necessary
    }
  }
  console.log("Finish collecting bill...");
}

async function checkOverBudget() {
  const projectList = await axios.get("http://localhost:3000/projects");

  projectList.data.forEach(async (project) => {
    const costList = await axios.get(
      `http://localhost:3000/costs/total/${project._id}`
    );
    const budget = project.budgetLimit;
    var currentCost = 0;
    costList.data.forEach((cost) => {
      currentCost += cost.totalCostUSD;
    });
    console.log("current cost", currentCost);
    if (currentCost > (budget * 90) / 100) {
      project.projectMembers.forEach((member) => {
        email.sendAlertBudgetEmail(
          member.email,
          budget,
          costList.data,
          currentCost,
          project.projectName,
          project._id
        );
      });
    }
  });
}

module.exports = {
  updateNewBill,
  collectMetric,
  collectBill,
  checkOverBudget,
};
