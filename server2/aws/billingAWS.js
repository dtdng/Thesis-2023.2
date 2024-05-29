const AWS = require("aws-sdk");
const app = require("../../server/routes/costRoute");

// Configure the AWS SDK with your access and secret key
AWS.config.update({ region: "ap-southeast-2" });

const costExplorer = new AWS.CostExplorer();

const getBillingDataApplicationAWS= async (startDate, endDate, applicationTag) => {
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

  var result = [];

  try {
    const data = await costExplorer.getCostAndUsage(params).promise();

    data.ResultsByTime.forEach((result) => {
      result.Groups.forEach((group) => {
        const object = {
          cloudProjectID: applicationTag,
          startDate: result.TimePeriod.Start,
          endDate: result.TimePeriod.End,
          service: group.Keys[0],
          cost: group.Metrics.AmortizedCost.Amount,
          currency: group.Metrics.AmortizedCost.Unit,
          provider: "aws",
        };
        result.push(object);
      });
    });
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return null;
  }
  return result;
};

// Example usage
const startDate = "2024-05-01";
const endDate = "2024-05-31";
const applicationTag =
  "arn:aws:resource-groups:ap-southeast-2:992382481049:group/gr_test/03t6wxp3t3doobje3wfk4pcrqb";
// getBillingData(startDate, endDate, applicationTag);
