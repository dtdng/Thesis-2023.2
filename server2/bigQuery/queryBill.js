const { BigQuery } = require("@google-cloud/bigquery");


async function getBillingDataProjectGoogle(
  month,
  tableId,
  cloudProjectID,
  projectId
) {
  const bigquery = new BigQuery({
    // projectId: cloudProjectID,
  });

  const query = `
    SELECT 
      service.description AS service_description, 
      SUM(cost) AS total_cost, 
      invoice.month AS month, 
      currency
    FROM \`${tableId}\`
    WHERE invoice.month='${month}' AND project.id='${cloudProjectID}'
    
    GROUP BY service_description, month, currency
    ORDER BY total_cost DESC
    LIMIT 1000
  `;

  try {
    // Run the query
    const [job] = await bigquery.createQueryJob({ query });

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();
    const { startDate, endDate } = getStartAndEndDate(month);

    // Process the rows as needed
    const result = rows.map((row) => ({
      projectId: projectId,
      cloudProjectID: cloudProjectID,
      startDate: startDate,
      endDate: endDate,
      service: row.service_description,
      cost: row.total_cost,
      currency: row.currency,
      provider: "google",
    }));
    // console.log(result);
    return result;
  } catch (error) {
    console.error("ERROR:", error);
    return null;
  }
}
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
// const main = async () => {
//   const response = await getBillingDataProjectGoogle(
//     "202405",
//     "fir-learning-25dbc.BillingDataset",
//     "graduation-reasearch",
//     "test1"
//   );

//   console.log(response);
// };

// main();

module.exports = { getBillingDataProjectGoogle };
