const { BigQuery } = require("@google-cloud/bigquery");

// // Initialize the BigQuery client
// const bigquery = new BigQuery({
//   projectId: "bustling-dynamo-420507",
//   keyFilename: "D:/bustling-dynamo-420507-7ecd3e2a121a.json",
// });

// // Define the dataset and table ID
// const datasetId = "Billing_Dataset";
// const tableId = "gcp_billing_export_v1_0170AB_1A0C14_B679A1";

async function getBillingDataProjectGoogle(
  startDate,
  endDate,
  datasetId,
  tableId,
  cloudProjectID,
  projectId
) {
  
  const bigquery = new BigQuery({
    projectId: cloudProjectID,
  });

  const query = `
    SELECT 
      service.description AS service_description, 
      SUM(cost) AS total_cost, 
      invoice.month AS month, 
      currency
    FROM \`${cloudProjectID}.${datasetId}.${tableId}\`
    WHERE DATE(_PARTITIONTIME) = "${endDate}"
    
    GROUP BY service_description, month, currency
    ORDER BY total_cost DESC
    LIMIT 1000
  `;

  try {
    // Run the query
    const [job] = await bigquery.createQueryJob({ query });

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

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

module.exports = { getBillingDataProjectGoogle };
