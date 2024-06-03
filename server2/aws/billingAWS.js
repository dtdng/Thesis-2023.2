const AWS = require("aws-sdk");
const app = require("../../server/routes/costRoute");

// Configure the AWS SDK with your access and secret key
AWS.config.update({ region: "ap-southeast-2" });

const costExplorer = new AWS.CostExplorer();

const getBillingDataApplicationAWS = async (
  startDate,
  endDate,
  applicationTag,
  projectId
) => {
  const params = {
    TimePeriod: {
      Start: startDate, // e.g., '2024-05-01'
      End: endDate, // e.g., '2024-05-31'
    },
    Granularity: "MONTHLY",
    Metrics: ["AmortizedCost"],
    Filter: {
      Tags: {
        Key: "awsApplication",
        Values: [applicationTag],
      },
    },
    GroupBy: [
      {
        Type: "DIMENSION",
        Key: "SERVICE",
      },
    ],
  };

  let result = [];

  try {
    const data = await costExplorer.getCostAndUsage(params).promise();

    data.ResultsByTime.forEach((timePeriod) => {
      timePeriod.Groups.forEach((group) => {
        // console.log(group);
        const object = {
          projectId: projectId,
          cloudProjectID: applicationTag,
          startDate: startDate,
          endDate: endDate,
          service: group.Keys[0],
          cost: group.Metrics.AmortizedCost.Amount,
          currency: group.Metrics.AmortizedCost.Unit,
          provider: "aws",
        };
        // console.log(object);
        result.push(object);
      });
    });
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return null;
  }
  // console.log(result);
  return result;
};

function getStartAndEndDate(month) {
  // Parse the month parameter
  const year = parseInt(month.slice(0, 4), 10);
  const monthIndex = parseInt(month.slice(4), 10);

  // Get the first day of the specified month
  const startDate = new Date(year, monthIndex - 1, 1);

  // Get the last day of the specified month
  const endDate = new Date(year, monthIndex, 0);

  // Format the dates as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}
module.exports = {
  getBillingDataApplicationAWS,
  getStartAndEndDate,
};
